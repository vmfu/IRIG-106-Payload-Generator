	// ===== VISUALIZATION FUNCTIONS =====

	window.updateHexViewer = function() {
		const container = document.getElementById('hexViewer');
		if (!appState.binData) return;

		const buffer = appState.binData;
		const bytesPerLine = 16;
		let html = '';

		const limit = Math.min(buffer.length, 1024);

		for (let i = 0; i < limit; i += bytesPerLine) {
			const offset = i.toString(16).padStart(8, '0').toUpperCase();

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

	window.drawWaterfall = function() {
		const canvas = document.getElementById('waterfallCanvas');
		if (!canvas || !appState.binData) return;

		const ctx = canvas.getContext('2d');
		const numFrames = parseInt(document.getElementById('numFrames').value);
		const data = appState.binData;

		const bytesPerFrame = Math.ceil(data.length / numFrames);

		canvas.width = bytesPerFrame;
		canvas.height = numFrames;

		const imgData = ctx.createImageData(bytesPerFrame, numFrames);
		const pixels = imgData.data;

		for (let y = 0; y < numFrames; y++) {
			for (let x = 0; x < bytesPerFrame; x++) {
				const byteIndex = y * bytesPerFrame + x;

				let val = 0;
				if (byteIndex < data.length) {
					val = data[byteIndex];
				} else {
					val = 0;
				}

				const pIndex = (y * bytesPerFrame + x) * 4;

				pixels[pIndex] = val;
				pixels[pIndex + 1] = val;
				pixels[pIndex + 2] = val;
				pixels[pIndex + 3] = 255;
			}
		}

		ctx.putImageData(imgData, 0, 0);
	}

	window.updateDataTable = function() {
		const header = document.getElementById('dataTableHeader');
		header.innerHTML = '<th>Кадр</th>';
		appState.parameters.forEach(p => {
			const th = document.createElement('th');
			th.textContent = p.id;
			header.appendChild(th);
		});

		const tbody = document.getElementById('dataTableBody');
		tbody.innerHTML = '';

		const rowsToShow = Math.min(20, appState.generatedData.length);
		for (let i = 0; i < rowsToShow; i++) {
			const row = document.createElement('tr');
			const data = appState.generatedData[i];
			row.innerHTML = `<td class="frame-num">${data.frameIdx}</td>`;
			appState.parameters.forEach(p => {
				const td = document.createElement('td');
				const val = data[p.id];
				td.textContent = typeof val === 'number' ? val.toFixed(2) : val;
				row.appendChild(td);
			});
			tbody.appendChild(row);
		}
	}

	window.populateChartSelects = function() {
		const paramNames = appState.parameters.map(p => p.id);
		const sel1 = document.getElementById('chart1Param');
		const sel2 = document.getElementById('chart2Param');

		sel1.innerHTML = '';
		sel2.innerHTML = '';

		paramNames.forEach((name, idx) => {
			const opt1 = document.createElement('option');
			opt1.value = name;
			opt1.textContent = name;
			if (idx === 0) opt1.selected = true;
			sel1.appendChild(opt1);

			const opt2 = document.createElement('option');
			opt2.value = name;
			opt2.textContent = name;
			if (idx === 1) opt2.selected = true;
			sel2.appendChild(opt2);
		});

		updateCharts();
	}

	window.updateCharts = function() {
		const param1 = document.getElementById('chart1Param').value;
		const param2 = document.getElementById('chart2Param').value;

		drawChart('chart1', param1);
		drawChart('chart2', param2);
	}

	window.drawChart = function(canvasId, paramId) {
		if (appState.generatedData.length === 0) return;

		const canvas = document.getElementById(canvasId);
		const ctx = canvas.getContext('2d');

		if (appState.charts[canvasId]) {
			appState.charts[canvasId].destroy();
		}

		const values = appState.generatedData.map(d => d[paramId]);
		const labels = appState.generatedData.map((d, i) => i);

		appState.charts[canvasId] = new Chart(ctx, {
			type: 'line',
			data: {
				labels: labels,
				datasets: [{
					label: paramId,
					data: values,
					borderColor: 'rgb(0, 188, 212)',
					backgroundColor: 'rgba(0, 188, 212, 0.1)',
					tension: 0.1
				}]
			},
			options: {
				responsive: true,
				scales: {
					x: {
						title: {
							display: true,
							text: 'Кадр',
							color: '#888'
						},
						ticks: { color: '#888' },
						grid: { color: '#333' }
					},
					y: {
						title: {
							display: true,
							text: paramId,
							color: '#888'
						},
						ticks: { color: '#888' },
						grid: { color: '#333' }
					}
				},
				plugins: {
					legend: {
						labels: { color: '#888' }
					}
				}
			}
		});
	}
