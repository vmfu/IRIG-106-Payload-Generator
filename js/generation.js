	// ===== GENERATION FUNCTIONS =====

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
		}, 100);
	}

	window.updateProgress = function(percent) {
		document.getElementById('progressFill').style.width = percent + '%';
		document.getElementById('progressText').textContent = percent + '%';
	}

	window.generatePayload = function(numFrames, samplingRate) {
		try {
			const context = {};

			const bitWriter = new BitWriter(
				document.getElementById('byteOrder').value,
				document.getElementById('bitOrder').value
			);

			appState.parameters.forEach(p => {
				context[p.id] = 0;
			});

			for (let frameIdx = 0; frameIdx < numFrames; frameIdx++) {
				const t = (frameIdx / samplingRate);
				const frameObj = { frameIdx: frameIdx, timestamp: t };

				appState.parameters.forEach(param => {
					let value = window.generateValue(param, t, frameIdx, context);

					if (param.noise > 0) {
						value += param.noise * window.gaussianRandom();
					}

					value = Math.max(param.min, Math.min(param.max, value));

					context[param.id] = value;
					frameObj[param.id] = value;
				});

				appState.generatedData.push(frameObj);

				appState.parameters.forEach(param => {
					const value = context[param.id];
					window.encodeRecursive(value, param, bitWriter, frameIdx);
				});

				if ((frameIdx + 1) % Math.ceil(numFrames / 10) === 0) {
					const progress = Math.round((frameIdx + 1) / numFrames * 100);
					updateProgress(progress);
					consoleLog(`  [${progress}%] Обработано ${frameIdx + 1}/${numFrames} кадров`, 'info');
				}
			}

			appState.binData = bitWriter.getBuffer();

			if (document.getElementById('enableErrorInjection') && document.getElementById('enableErrorInjection').checked) {
				applyErrorInjection(appState.binData, parseFloat(document.getElementById('errorRate').value));
			}

			consoleLog(`[УСПЕХ] Сгенерировано ${numFrames} кадров`, 'success');

			finalizeGeneration(numFrames, samplingRate);

		} catch (err) {
			consoleLog(`[ОШИБКА] ${err.message}`, 'error');
			console.error(err);
			appState.isGenerating = false;
			document.getElementById('generateBtn').disabled = false;
			document.getElementById('cancelBtn').disabled = true;
		}
	}

	function applyErrorInjection(buffer, errorRate) {
		if (errorRate <= 0) return;

		consoleLog(`[ERROR INJECTION] Внесение ошибок с вероятностью ${errorRate}...`, 'warning');
		let errorCount = 0;
		const totalBits = buffer.length * 8;

		for (let i = 0; i < buffer.length; i++) {
			let byte = buffer[i];
			for (let bit = 0; bit < 8; bit++) {
				if (Math.random() < errorRate) {
					byte ^= (1 << bit);
					errorCount++;
				}
			}
			buffer[i] = byte;
		}
		consoleLog(`[ERROR INJECTION] Повреждено ${errorCount} бит из ${totalBits})`, 'warning');
	}

	function finalizeGeneration(numFrames, samplingRate) {
		consoleLog(`[ЭТАП 3] Генерация TMATS...`, 'info');
		appState.tmatsData = window.generateTMATS();

		consoleLog(`[ЭТАП 4] Генерация отчета...`, 'info');
		appState.reportData = window.generateReport(numFrames, samplingRate);

		if (document.getElementById('enableLoopback').checked) {
			window.performDeepLoopbackTest();
		}

		updateHexViewer();
		try {
			drawWaterfall();
		} catch (e) {
			console.error("Ошибка отрисовки водопада:", e);
		}

		updateProgress(100);
		document.getElementById('statusText').textContent = '✓ Успешно завершена';
		document.getElementById('framesGenerated').textContent = numFrames;

		if (appState.binData) {
			document.getElementById('binSize').textContent = appState.binData.length + ' байт';
		}

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

	window.cancelGeneration = function() {
		appState.isGenerating = false;
		consoleLog(`[ОТМЕНА] Генерация прервана пользователем`, 'warning');
		document.getElementById('generateBtn').disabled = false;
		document.getElementById('cancelBtn').disabled = true;
	}
