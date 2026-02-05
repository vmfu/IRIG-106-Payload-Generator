        window.updateParametersTable = function() {
            const container = document.getElementById('treeContainer');
            if (!container) return;
            container.innerHTML = '';

            // Глобальный счетчик слов для всего кадра (Major Frame)
            // Примечание: Это упрощенный подсчет. В реальности IRIG 106 сложнее (minor frames).
            // Но для линейного списка это даст понимание позиции.
            let globalWordCounter = 1; 

            function renderNode(param, index, depth, parentIndices = []) {
                const row = document.createElement('div');
                row.className = 'tree-row';
                row.id = `param-row-${param.id}`;
                
                if (param.dependsOn && param.dependsOn.length > 0) {
                     row.onmouseenter = () => highlightDependenciesInTree(param.dependsOn, true);
                     row.onmouseleave = () => highlightDependenciesInTree(param.dependsOn, false);
                }

                let indentHtml = '';
                for(let i=0; i<depth; i++) indentHtml += '<span class="tree-indent"></span>';
                
                let icon = param.type === 'CONTAINER' ? '📂' : '📄';
                if (depth > 0) icon = '↳';

                // Определяем номер слова и размер
                // Для контейнеров номер слова не всегда применим напрямую, если они виртуальные,
                // но для визуализации оставим начало блока.
                const currentWordNum = globalWordCounter;
                
                // Если это не контейнер, увеличиваем счетчик слов
                // (Предполагаем 1 параметр = 1+ слов, но для упрощения пока +1)
                // Если параметр > 16 бит, он может занимать несколько слов.
                // Для точного IRIG нужно делить bits / 16.
                
                let wordCount = Math.ceil((param.bits || 16) / 16);
                if (param.type === 'CONTAINER') wordCount = 0; // Container сам не занимает слова, занимают дети

                // Увеличиваем глобальный счетчик только для конечных параметров
                if (param.type !== 'CONTAINER') {
                    globalWordCounter += wordCount;
                }

                const currentPath = [...parentIndices, index]; 
                const pathStr = JSON.stringify(currentPath);
                
                const editingPathStr = document.getElementById('editPath').value;
                if (editingPathStr === pathStr) {
                    row.style.background = 'rgba(0, 188, 212, 0.2)';
                    row.style.borderLeft = '3px solid #00bcd4';
                }

                // Визуализация битов (исправлено чтение)
                // Если биты не заданы (старые сейвы), берем дефолт 16
                const bitsDisplay = param.type === 'CONTAINER' ? '-' : (param.bits || 16);

                row.innerHTML = `
                    <div class="tree-cell" style="width: 40%; cursor: pointer;" onclick='selectParameter(${pathStr})'>
                        ${indentHtml} <span style="color: #00bcd4; font-weight: bold;">${icon} ${param.id}</span>
                    </div>
                    <div class="tree-cell" style="width: 15%; color: #888; font-family: monospace;">
                        ${param.type !== 'CONTAINER' ? currentWordNum : ''}
                    </div>
                    <div class="tree-cell" style="width: 15%">
                        <span class="param-type-badge ${param.type==='CONTAINER'?'container-badge':''}">${param.type}</span>
                    </div>
                    <div class="tree-cell" style="width: 10%; font-family: monospace; color: #ff9800;">
                        ${bitsDisplay}
                    </div>
                    <div class="tree-cell" style="width: 20%">
                        <div class="param-action">
                             ${param.type === 'CONTAINER' ? 
                               `<button class="btn btn-success" style="padding: 2px 6px; font-size: 9px;" onclick='addChildParameter(${pathStr}); event.stopPropagation();'>+Child</button>` : ''}
                            <button class="btn btn-danger" style="padding: 2px 6px; font-size: 9px;" onclick='deleteParamByPath(${pathStr}); event.stopPropagation();'>✕</button>
                        </div>
                    </div>
                `;
                container.appendChild(row);

                if (param.subParams && param.subParams.length > 0) {
                    param.subParams.forEach((sub, subIdx) => {
                        renderNode(sub, subIdx, depth + 1, currentPath);
                    });
                }
            }

            appState.parameters.forEach((param, idx) => {
                renderNode(param, idx, 0);
            });
        }
