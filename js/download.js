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
