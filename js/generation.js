        window.startGeneration = function() {
            if (appState.parameters.length === 0) {
                alert('Добавьте хотя бы один параметр!');
                return;
            }

            appState.isGenerating = true;
            appState.startTime = performance.now();
            appState.generatedData = [];
            appState.frameData = [];

            document.getElementById('generateBtn').disabled = true;
            document.getElementById('cancelBtn').disabled = false;
            document.getElementById('console').innerHTML = '';

            const numFrames = parseInt(document.getElementById('numFrames').value);
            const samplingRate = parseInt(document.getElementById('samplingRate').value);

            consoleLog(`[ЭТАП 1] Инициализация генератора...`, 'info');
            consoleLog(`  Параметров: ${appState.parameters.length}`, 'info');
            consoleLog(`  Кадров: ${numFrames}`, 'info');
            consoleLog(`  Частота: ${samplingRate} Гц`, 'info');

            consoleLog(`[ЭТАП 2] Топологическая сортировка...`, 'info');

            setTimeout(() => {
                generatePayload(numFrames, samplingRate);
				try {
					drawWaterfall();
				} catch (e) {
					console.error("Ошибка отрисовки водопада:", e);
				}
            }, 100);
        }
		
		function updateHexViewer() {
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
