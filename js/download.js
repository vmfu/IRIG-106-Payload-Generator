        window.downloadBinary = function() {
            if (!appState.binData) return;
            const blob = new Blob([appState.binData], { type: 'application/octet-stream' });
            downloadFile(blob, 'irig106_payload.bin');
        }

        window.downloadTMATS = function() {
            if (!appState.tmatsData) return;
            const blob = new Blob([appState.tmatsData], { type: 'text/plain' });
            downloadFile(blob, 'irig106_payload.tmats');
        }

        window.downloadReport = function() {
            if (!appState.reportData) return;
            const blob = new Blob([appState.reportData], { type: 'text/plain' });
            downloadFile(blob, 'irig106_config_report.txt');
        }

        window.downloadJSON = function() {
            const config = {
                numFrames: document.getElementById('numFrames').value,
                samplingRate: document.getElementById('samplingRate').value,
                byteOrder: document.getElementById('byteOrder').value,
                bitOrder: document.getElementById('bitOrder').value,
                parameters: appState.parameters
            };
            const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
            downloadFile(blob, 'irig106_config.json');
        }

        window.saveConfig = function() {
            downloadJSON();
        }

        window.loadConfig = function() {
            const fileInput = document.getElementById('configFile');
            const file = fileInput.files[0];
            if (!file) {
                alert('Пожалуйста, выберите файл JSON для загрузки');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const config = JSON.parse(e.target.result);

                    document.getElementById('numFrames').value = config.numFrames || 1000;
                    document.getElementById('samplingRate').value = config.samplingRate || 100;
                    document.getElementById('byteOrder').value = config.byteOrder || 'big-endian';
                    document.getElementById('bitOrder').value = config.bitOrder || 'msb-first';

                    if (config.parameters && Array.isArray(config.parameters)) {
                        appState.parameters = config.parameters;
                        updateParametersTable();
                    }

                    alert('Конфигурация успешно загружена!');
                } catch (error) {
                    alert('Ошибка при загрузке конфигурации: ' + error.message);
                }
            };
            reader.readAsText(file);
        }

        window.downloadFile = function(blob, filename) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
