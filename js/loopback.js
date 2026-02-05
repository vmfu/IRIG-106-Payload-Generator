	// ===== LOOPBACK TESTING FUNCTIONS =====

	window.performDeepLoopbackTest = function() {
		if (!appState.binData) return;
		consoleLog('[LOOPBACK] Запуск проверки целостности данных...', 'warning');

		let totalBitsPerFrame = 0;
		appState.parameters.forEach(p => totalBitsPerFrame += p.bits);

		const expectedBytesMin = Math.floor((appState.generatedData.length * totalBitsPerFrame) / 8);
		const actualBytes = appState.binData.length;

		if (actualBytes >= expectedBytesMin) {
			consoleLog(`[LOOPBACK] OK: Размер данных корректен (${actualBytes} байт).`, 'success');
		} else {
			consoleLog(`[LOOPBACK] ОШИБКА: Недобор данных! Ожидалось минимум ${expectedBytesMin}, получено ${actualBytes}`, 'error');
		}
	}
