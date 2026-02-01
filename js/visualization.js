		window.updateHexViewer = function() {
            const container = document.getElementById('hexViewer');
            if (!appState.binData) return;

            const buffer = appState.binData;
            const bytesPerLine = 16;
            let html = '';
            
            // Показываем первые 1024 байт (чтобы не вешать браузер)
            const limit = Math.min(buffer.length, 1024); 

            for (let i = 0; i < limit; i += bytesPerLine) {
                // Offset
                const offset = i.toString(16).padStart(8, '0').toUpperCase();
                
                // Bytes
                let hexPart = '';
                let asciiPart = '';
                
                for (let j = 0; j < bytesPerLine; j++) {
                    if (i + j < limit) {
                        const byte = buffer[i + j];
                        hexPart += byte.toString(16).padStart(2, '0').toUpperCase() + ' ';
                        asciiPart += (byte >= 32 && byte <= 126) ? String.fromCharCode(byte) : '.';
                    } else {
                        hexPart += '   ';
                    }
                }
                
                html += `<span class="hex-offset">${offset}</span><span class="hex-bytes">${hexPart}</span><span class="hex-ascii">${asciiPart}</span><br>`;
            }
            
            if (buffer.length > limit) {
                html += `<div style="text-align:center; color: #888; margin-top:5px;">... показано ${limit} из ${buffer.length} байт ...</div>`;
            }

            container.innerHTML = html;
        }

		
        // ===== BIT WRITER CLASS =====
        class BitWriter {
            constructor(byteOrder = 'big-endian', bitOrder = 'msb-first') {
                this.buffer = new Uint8Array(10000);
                this.bitPosition = 0;
                this.byteOrder = byteOrder;
                this.bitOrder = bitOrder;
            }

            writeBits(value, numBits) {
                if (numBits <= 0 || numBits > 64) return;

                value = BigInt(value) & ((1n << BigInt(numBits)) - 1n);

                if (this.bitOrder === 'msb-first') {
                    // MSB-First: старший бит пишем первым
                    for (let i = numBits - 1; i >= 0; i--) {
                        const bit = Number((value >> BigInt(i)) & 1n);
                        this._writeBit(bit);
                    }
                } else {
                    // LSB-First: младший бит пишем первым
                    for (let i = 0; i < numBits; i++) {
                        const bit = Number((value >> BigInt(i)) & 1n);
                        this._writeBit(bit);
                    }
                }
            }

            _writeBit(bit) {
                const byteIdx = Math.floor(this.bitPosition / 8);
                const bitIdx = 7 - (this.bitPosition % 8);
                
                if (byteIdx >= this.buffer.length) {
                    const newBuffer = new Uint8Array(this.buffer.length * 2);
                    newBuffer.set(this.buffer);
                    this.buffer = newBuffer;
                }

                if (bit) {
                    this.buffer[byteIdx] |= (1 << bitIdx);
                }

                this.bitPosition++;
            }

            getBuffer() {
                const totalBytes = Math.ceil(this.bitPosition / 8);
                return this.buffer.slice(0, totalBytes);
            }

            reset() {
                this.buffer.fill(0);
                this.bitPosition = 0;
            }

            getTotalBytes() {
                return Math.ceil(this.bitPosition / 8);
            }
        }
		
		// ===encodeRecursive отвечает за правильную упаковку битов в зависимости от активного типа данных (важно для контейнеров)
		function encodeRecursive(value, param, bitWriter, frameIdx) {
			// ====== CONTAINER HANDLING ======
			if (param.type === 'CONTAINER') {
				if (!param.subParams || param.subParams.length === 0) {
					bitWriter.writeBits(0n, param.bits);
					return;
				}
				
				const activeIdx = frameIdx % param.subParams.length;
				const activeSubParam = param.subParams[activeIdx];
				encodeRecursive(value, activeSubParam, bitWriter, frameIdx);
				return;
			}

			let encoded = 0n;

			// ====== TIMECODE SPECIAL HANDLING ======
			if (param.type === 'TIMECODE') {
				// value - объект { _isTimeCode: true, days: number, millis: number }
				if (typeof value === 'object' && value._isTimeCode) {
					const days = BigInt(value.days) & 0xFFFFn;
					const millis = BigInt(value.millis) & 0xFFFFFFFFn;
					
					// TIMECODE структура: [16-bit days][32-bit milliseconds] = 48 бит
					// Если нужно ещё 16 бит для 64-bit (TIMECODE может быть 64-bit),
					// добавляем нули в старший байт
					encoded = (days << 32n) | millis;
				} else {
					// Fallback для старого формата
					encoded = BigInt(Math.floor(value)) & ((1n << BigInt(param.bits)) - 1n);
				}
				bitWriter.writeBits(encoded, param.bits);
				return;
			}

			// ====== CONVERT VALUE TO NUMBER (safe) ======
			let numValue;
			if (typeof value === 'bigint') {
				// Если всё ещё BigInt, конвертируем безопасно
				try {
					numValue = Number(value);
					if (!isFinite(numValue)) {
						consoleLog(`⚠️ BigInt value too large for ${param.id}, using clamped value`, 'warning');
						numValue = Math.pow(2, param.bits - 1) - 1;
					}
				} catch (e) {
					numValue = 0;
					consoleLog(`❌ Error converting BigInt: ${e.message}`, 'error');
				}
			} else {
				numValue = value;
			}

			// ====== ENCODE BY TYPE ======
			switch (param.type) {
				case 'UB': { // Unsigned Binary
					const maxVal = Math.pow(2, param.bits) - 1;
					encoded = BigInt(Math.max(0, Math.min(Math.round(numValue), maxVal)));
					break;
				}

				case 'SB': { // Signed Binary (Two's Complement)
					const maxSB = Math.pow(2, param.bits - 1) - 1;
					const minSB = -Math.pow(2, param.bits - 1);
					const clampedSB = Math.max(minSB, Math.min(maxSB, Math.round(numValue)));
					
					if (clampedSB >= 0) {
						encoded = BigInt(clampedSB);
					} else {
						// Two's complement для отрицательных чисел
						encoded = BigInt((1n << BigInt(param.bits)) + BigInt(clampedSB));
					}
					break;
				}

				case 'DISCRETE': // Boolean flag
					encoded = (numValue !== 0) ? 1n : 0n;
					break;

				case 'IEEE754': { // 32-bit Float
					const arr = new Float32Array([numValue]);
					const view = new Uint32Array(arr.buffer);
					encoded = BigInt(view[0]);
					break;
				}

				case 'DOUBLE': { // 64-bit Float
					const arr = new Float64Array([numValue]);
					const view = new BigUint64Array(arr.buffer);
					encoded = view[0];
					break;
				}

				case 'SCALEDINT': { // Linear scaling: Raw = (EU - A0) / A1
					const a0 = param.scaleFactorA0 || 0;
					const a1 = param.scaleFactorA1 || 1;
					const rawValue = (numValue - a0) / a1;
					const maxRaw = Math.pow(2, param.bits) - 1;
					encoded = BigInt(Math.max(0, Math.min(Math.round(rawValue), maxRaw)));
					break;
				}

				case 'MIL1750A': { // MIL-STD-1750A 32-bit Float
					encoded = floatToMil1750A(numValue);
					break;
				}

				default: {
					encoded = BigInt(Math.max(0, Math.round(numValue)));
				}
			}

			// ====== WRITE BITS ======
			bitWriter.writeBits(encoded, param.bits);
		}



		
		// функцию инъекции ошибок
		function applyErrorInjection(buffer, errorRate) {
            if (errorRate <= 0) return;
            
            consoleLog(`[ERROR INJECTION] Внесение ошибок с вероятностью ${errorRate}...`, 'warning');
            let errorCount = 0;
            const totalBits = buffer.length * 8;
            
            // Проходим по байтам и инвертируем биты
            for (let i = 0; i < buffer.length; i++) {
                let byte = buffer[i];
                for (let bit = 0; bit < 8; bit++) {
                    if (Math.random() < errorRate) {
                        byte ^= (1 << bit); // XOR инверсия
                        errorCount++;
                    }
                }
                buffer[i] = byte;
            }
            consoleLog(`[ERROR INJECTION] Повреждено ${errorCount} бит из ${totalBits})`, 'warning');
        }

        // ===== PAYLOAD GENERATION WITH PROPER BIT PACKING =====
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

		function generateValue(param, t, frameIdx, context) {
