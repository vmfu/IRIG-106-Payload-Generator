        function generatePayload(numFrames, samplingRate) {
            try {
                const frameTime = numFrames / samplingRate;
                const context = {};
                
                // Инициализация BitWriter
                const bitWriter = new BitWriter(
                    document.getElementById('byteOrder').value,
                    document.getElementById('bitOrder').value
                );

                // Инициализация контекста
                appState.parameters.forEach(p => {
                    context[p.id] = 0;
                });

                // ГЛАВНЫЙ ЦИКЛ ПО КАДРАМ
                for (let frameIdx = 0; frameIdx < numFrames; frameIdx++) {
                    const t = (frameIdx / samplingRate);
                    const frameObj = { frameIdx: frameIdx, timestamp: t };

                    // ФАЗА 1: Вычисление значений (С учетом рекурсии)
                    appState.parameters.forEach(param => {
                        let value = generateValue(param, t, frameIdx, context);
                        
                        // Добавление шума
                        if (param.noise > 0) {
                            value += param.noise * gaussianRandom();
                        }
                        
                        // Ограничение диапазона (Clamp)
                        value = Math.max(param.min, Math.min(param.max, value));
                        
                        context[param.id] = value;
                        frameObj[param.id] = value;
                    });

                    appState.generatedData.push(frameObj);

                    // ФАЗА 2: Упаковка в биты (Рекурсивно)
                    appState.parameters.forEach(param => {
                        const value = context[param.id];
                        encodeRecursive(value, param, bitWriter, frameIdx);
                    });

                    // Логирование прогресса
                    if ((frameIdx + 1) % Math.ceil(numFrames / 10) === 0) {
                        const progress = Math.round((frameIdx + 1) / numFrames * 100);
                        updateProgress(progress);
                        consoleLog(`  [${progress}%] Обработано ${frameIdx + 1}/${numFrames} кадров`, 'info');
                    }
                }

                // ПОЛУЧЕНИЕ БИНАРНЫХ ДАННЫХ
                appState.binData = bitWriter.getBuffer();
                
                // ФАЗА 3: INJECTION (Внедрение ошибок)
                
                if (document.getElementById('enableErrorInjection') && document.getElementById('enableErrorInjection').checked) {
                     applyErrorInjection(appState.binData, document.getElementById('errorRate').value);
                }

                // ... (Далее код генерации TMATS, отчетов и завершения остается прежним) ...
                
                consoleLog(`[УСПЕХ] Сгенерировано ${numFrames} кадров`, 'success');
                // ... (остальной код завершения функции)
                
                // ЗАГЛУШКА ДЛЯ ЗАВЕРШЕНИЯ (скопируйте конец старой функции)
                finalizeGeneration(numFrames, samplingRate); 

            } catch (err) {
                consoleLog(`[ОШИБКА] ${err.message}`, 'error');
                console.error(err);
                appState.isGenerating = false;
                document.getElementById('generateBtn').disabled = false;
                document.getElementById('cancelBtn').disabled = true;
            }
        }
        
        // Вспомогательная функция, чтобы не дублировать код завершения
                // Вспомогательная функция завершения генерации
        function finalizeGeneration(numFrames, samplingRate) {
             consoleLog(`[ЭТАП 3] Генерация TMATS...`, 'info');
             appState.tmatsData = generateTMATS();
             
             consoleLog(`[ЭТАП 4] Генерация отчета...`, 'info');
             appState.reportData = generateReport(numFrames, samplingRate);
             
             // === ДОБАВЛЕНО: LOOPBACK TEST ===
             // Проверяем галочку и вызываем тест
             if (document.getElementById('enableLoopback').checked) {
                 performDeepLoopbackTest();
             }
             // ================================

             // === ДОБАВЛЕНО: HEX VIEWER ===
             // Обновляем просмотрщик hex-кодов (из предыдущего шага)
             updateHexViewer();
             // =============================
             
             updateProgress(100);
             document.getElementById('statusText').textContent = '✓ Успешно завершена';
             document.getElementById('framesGenerated').textContent = numFrames;
             
             // Обновляем размеры, если данные существуют
             if (appState.binData) {
                document.getElementById('binSize').textContent = appState.binData.length + ' байт';
             }
             
             // Разблокировка кнопок
             document.getElementById('downloadBinBtn').disabled = false;
             document.getElementById('downloadTmatsBtn').disabled = false;
             document.getElementById('downloadReportBtn').disabled = false;
             document.getElementById('downloadJsonBtn').disabled = false;

             appState.isGenerating = false;
             document.getElementById('generateBtn').disabled = false;
             document.getElementById('cancelBtn').disabled = true;

             updateDataTable();
             populateChartSelects();
        }



        // ===== ENCODING FUNCTION =====
        function encodeAndWriteValue(bitWriter, value, param) {
            let encoded = 0n;

            switch (param.type) {
                case 'UB':
                    // Unsigned Binary
                    encoded = BigInt(Math.round(Math.max(0, Math.min(value, Math.pow(2, param.bits) - 1))));
                    break;

                case 'SB':
                    // Signed Binary (Two's Complement)
                    const maxSB = Math.pow(2, param.bits - 1) - 1;
                    const minSB = -Math.pow(2, param.bits - 1);
                    const clampedSB = Math.max(minSB, Math.min(maxSB, Math.round(value)));
                    if (clampedSB < 0) {
                        encoded = BigInt((1n << BigInt(param.bits)) + BigInt(clampedSB));
                    } else {
                        encoded = BigInt(clampedSB);
                    }
                    break;

                case 'IEEE754':
                    // 32-bit Float
                    if (param.bits === 32) {
                        const arr = new Float32Array([value]);
                        const view = new Uint32Array(arr.buffer);
                        encoded = BigInt(view[0]);
                    } else {
                        encoded = BigInt(Math.round(value));
                    }
                    break;

                case 'DOUBLE':
                    // 64-bit Float (берем младшие 32 бита для совместимости)
                    const arr = new Float64Array([value]);
                    const view = new Uint32Array(arr.buffer);
                    encoded = BigInt(view[0]);
                    break;

                case 'SCALED_INT':
                    // Linear scaling: Raw = (EU - A0) / A1
                    const rawValue = (value - 0) / 0.01;
                    encoded = BigInt(Math.round(Math.max(0, Math.min(rawValue, Math.pow(2, param.bits) - 1))));
                    break;

                case 'MIL1750A':
                    // MIL-STD-1750A (simplified)
                    encoded = BigInt(Math.round(value));
                    break;

                case 'DISCRETE':
                    encoded = value !== 0 ? 1n : 0n;
                    break;

                case 'TIME_CODE':
                    // Days (16 bits) + Milliseconds (32 bits)
                    const totalMs = value;
                    const days = Math.floor(totalMs / (24 * 3600 * 1000)) % 65536;
                    const ms = Math.floor(totalMs) % (24 * 3600 * 1000);
                    encoded = (BigInt(days) << 32n) | BigInt(ms);
                    break;

                default:
                    encoded = 0n;
            }

            bitWriter.writeBits(encoded, param.bits);
        }

        function generateReport(numFrames, samplingRate, bytesPerFrame) {
            let report = '='.repeat(70) + '\n';
            report += ' ОТЧЕТ КОНФИГУРАЦИИ ГЕНЕРАТОРА IRIG 106 CHAPTER 4/10\n';
            report += '='.repeat(70) + '\n\n';
            report += `ПАРАМЕТРЫ ГЕНЕРАЦИИ:\n`;
            report += ` Количество кадров: ${numFrames}\n`;
            report += ` Частота дискретизации: ${samplingRate} Гц\n`;
            report += ` Длительность: ${(numFrames / samplingRate).toFixed(2)} сек\n`;
            report += ` Размер кадра: ${appState.parameters.reduce((s, p) => s + p.bits, 0)} бит (${bytesPerFrame} байт)\n`;
            report += ` Общий размер полезной нагрузки: ${numFrames * bytesPerFrame} байт\n`;
            report += ` Порядок байт: ${document.getElementById('byteOrder').value}\n`;
            report += ` Порядок бит: ${document.getElementById('bitOrder').value}\n`;
            report += ` Время генерации: ${(performance.now() - appState.startTime).toFixed(2)} мс\n\n`;
            
            report += `ПАРАМЕТРЫ (${appState.parameters.length} штук):\n`;
            report += '─'.repeat(70) + '\n';
            report += `${'ID'.padEnd(25)} ${'Тип'.padEnd(15)} ${'Биты'.padEnd(8)} ${'Диапазон'.padEnd(20)}\n`;
            report += '─'.repeat(70) + '\n';
            
            let bitOffset = 0;
            appState.parameters.forEach((p, i) => {
                report += `${p.id.padEnd(25)} ${p.type.padEnd(15)} ${p.bits.toString().padEnd(8)} ${p.min.toFixed(0)}-${p.max.toFixed(0)} ${p.units}\n`;
                report += `  Описание: ${p.desc}\n`;
                report += `  Поведение: ${p.behavior}, Частота: ${p.freq} Гц, Шум: ${p.noise}\n`;
                report += `  Байт-смещение: ${Math.floor(bitOffset / 8)}, Бит-смещение: ${bitOffset % 8}, Размер: ${p.bits} бит\n\n`;
                bitOffset += p.bits;
            });

            report += '─'.repeat(70) + '\n';
            report += `СТРУКТУРА КАДРА:\n`;
            report += `Каждый кадр содержит ${appState.parameters.length} параметров,\n`;
            report += `упакованных последовательно в ${bytesPerFrame} байт(ов) в порядке ${document.getElementById('bitOrder').value}.\n`;
            
            return report;
        }

        function cancelGeneration() {
            appState.isGenerating = false;
            consoleLog(`[ОТМЕНА] Генерация прервана пользователем`, 'warning');
            document.getElementById('generateBtn').disabled = false;
            document.getElementById('cancelBtn').disabled = true;
        }
