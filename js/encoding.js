		window.encodeRecursive = function(value, param, bitWriter, frameIdx) {
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
