// ============================================================================
// FORMULAS - Value Generation and Formula Evaluation
// ============================================================================

	window.generateValue = function(param, t, frameIdx, context) {
		// ====== CONTAINER HANDLING ======
		if (param.type === 'CONTAINER') {
			if (!param.subParams || param.subParams.length === 0) {
				return 0;
			}
			const activeIdx = frameIdx % param.subParams.length;
			const activeSubParam = param.subParams[activeIdx];
			return generateValue(activeSubParam, t, frameIdx, context);
		}

		// ====== TIMECODE SPECIAL HANDLING ======
		// TIMECODE возвращается как строка в формате "days:milliseconds"
		// для правильной обработки в encodeRecursive()
		if (param.type === 'TIMECODE') {
			// t - время в секундах (float)
			// Переводим в миллисекунды, затем разбиваем на дни и мс
			const totalMs = Math.floor(t * 1000);
			const oneDayMs = 24 * 3600 * 1000;

			const days = Math.floor(totalMs / oneDayMs) & 0xFFFF; // 16-bit
			const millisInDay = totalMs % oneDayMs;
			const millisBits = millisInDay & 0xFFFFFFFF; // 32-bit

			// Возвращаем специальный объект для TIME_CODE
			return {
				_isTimeCode: true,
				days: days,
				millis: millisBits
			};
		}

		// ====== REGULAR VALUE GENERATION ======
		let val = 0;

		switch (param.behavior) {
			case 'counter':
				// Счётчик увеличивается с каждым фреймом
				const range = Math.floor(param.max - param.min);
				if (range > 0) {
					val = param.min + (frameIdx % (range + 1));
				} else {
					val = param.min;
				}
				break;

			case 'sine': {
				// Синусоида с возможностью полиномиальной амплитуды
				if (!param.polyCoeffs || param.polyCoeffs.length === 0) {
					// Стандартная синусоида
					val = param.min + (param.max - param.min) / 2 *
						(1 + Math.sin(2 * Math.PI * param.freq * t));
				} else {
					// С полиномиальными коэффициентами
					val = param.polyCoeffs[0] || 0;
					for (let k = 1; k < param.polyCoeffs.length; k++) {
						val += param.polyCoeffs[k] * Math.sin(2 * Math.PI * param.freq * k * t);
					}
				}
				break;
			}

			case 'ramp': {
				// Линейный нарастающий сигнал
				const period = 1.0 / param.freq;
				const phase = (t % period) / period; // 0 до 1
				val = param.min + (param.max - param.min) * phase;
				break;
			}

			case 'random':
				// Случайное значение в диапазоне
				val = param.min + Math.random() * (param.max - param.min);
				break;

			case 'frozen':
				// Постоянное значение (середина диапазона)
				val = (param.min + param.max) / 2;
				break;

			case 'discrete':
				// Булево значение
				val = Math.floor(Math.random() * Math.pow(2, Math.min(8, param.bits)));
				break;

			case 'time':
				// Текущее время в секундах
				val = t;
				break;

			case 'formula':
				// Вычисленное значение по формуле
				if (!param.formula) {
					val = 0;
					break;
				}
				try {
					// Создаём контекст с параметром 'p' для доступа к другим значениям
					const func = new Function('p', 't', 'frame', `return ${param.formula}`);
					val = func(context, t, frameIdx);

					// Защита от NaN и Infinity
					if (!isFinite(val)) {
						val = (param.min + param.max) / 2;
						consoleLog(`⚠️ Formula for ${param.id} returned non-finite value, using default`, 'warning');
					}
				} catch (e) {
					val = (param.min + param.max) / 2;
					consoleLog(`❌ Formula error for ${param.id}: ${e.message}`, 'error');
				}
				break;

			default:
				val = (param.min + param.max) / 2;
		}

		// ====== APPLY NOISE ======
		if (param.noise > 0) {
			val += param.noise * gaussianRandom();
		}

		// ====== CLAMP TO RANGE ======
		val = Math.max(param.min, Math.min(param.max, val));

		return val;
	}

	// Box-Muller transform для нормального распределения
	window.gaussianRandom = function() {
		let u = 0, v = 0;
		while (u === 0) u = Math.random();
		while (v === 0) v = Math.random();
		return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
	}
