        window.generateTMATS = function() {
            const now = new Date();
            const dateStr = now.toISOString().split('T')[0].replace(/-/g, '-'); // MM-DD-YYYY format ideally
            
            let tmats = '';
            // G-Group (General)
            tmats += 'G\\PN\\IRIG-106-GENERATOR;\n'; // Program Name
            tmats += 'G\\106\\17;\n';                 // IRIG 106 Version (Ch 10)
            tmats += `G\\DSI\\TEST_MISSION_${now.getTime()};\n`; // DataSourceID
            tmats += 'G\\SC\\TOP_SECRET;\n';          // Security Classification
            
            // R-Group (Recorder - Virtual)
            tmats += 'R-1\\ID\\REC-1;\n';
            tmats += 'R-1\\DSI\\TEST_MISSION;\n';
            tmats += 'R-1\\N\\1;\n';                   // Number of streams
            tmats += 'R-1\\IDX\\1;\n';
            tmats += 'R-1\\S-1\\DSI\\TEST_MISSION;\n';
            tmats += 'R-1\\S-1\\T\\PCM;\n';            // Type PCM
            
            // P-Group (PCM Attributes)
            tmats += 'P-1\\DLN\\LINK_1;\n';
            tmats += 'P-1\\D1\\PCM;\n'; 
            tmats += 'P-1\\TF\\ONE;\n';                // Minor frames per major (1)
            
            // D-Group (Defined Parameters)
            appState.parameters.forEach((p, i) => {
                const idx = i + 1;
                tmats += `D-1\\MN-${idx}\\${p.id};\n`; // Measurement Name
                tmats += `D-1\\LT-${idx}\\${p.id};\n`; // Link Type
            });
            
            // Comment
            tmats += 'C\\COM\\Generated in IRIG 106 Payload Generator by Vladimir Funtikov;\n';
            
            return tmats;
        }


        function generateReport(numFrames, samplingRate) {
            let report = '='.repeat(60) + '\n';
            report += ' ОТЧЕТ КОНФИГУРАЦИИ ГЕНЕРАТОРА IRIG 106\n';
            report += '='.repeat(60) + '\n\n';
            report += `ПАРАМЕТРЫ ГЕНЕРАЦИИ:\n`;
            report += ` Количество кадров: ${numFrames}\n`;
            report += ` Частота дискретизации: ${samplingRate} Гц\n`;
            report += ` Время генерации: ${(performance.now() - appState.startTime).toFixed(2)} мс\n\n`;
            report += `ПАРАМЕТРЫ:\n`;
            report += '─'.repeat(60) + '\n';
            appState.parameters.forEach((p, i) => {
                report += `${i+1}. ${p.id.padEnd(25)} | ${p.type.padEnd(12)} | ${p.bits} бит\n`;
                report += `   ${p.desc}\n`;
                report += `   Диапазон: ${p.min} - ${p.max} ${p.units}\n\n`;
            });
            return report;
        }
		function performDeepLoopbackTest() {
