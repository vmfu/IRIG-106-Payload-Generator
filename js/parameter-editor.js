        window.selectParameter = function(path) {
            let target = appState.parameters[path[0]];
            for(let i=1; i<path.length; i++) {
                target = target.subParams[path[i]];
            }
            
            document.getElementById('editPath').value = JSON.stringify(path);
            
            // 1. Заполняем основные поля
            document.getElementById('editID').value = target.id || '';
            document.getElementById('editDesc').value = target.desc || '';
            document.getElementById('editType').value = target.type || 'UB';
            
            // 2. Явно ставим БИТЫ из модели ПЕРЕД обновлением UI
            // Это гарантирует, что мы видим сохраненное значение (например, 32)
            document.getElementById('editBits').value = target.bits;

            // 3. Обновляем UI (блокировку полей), но НЕ переписываем значение битов
            // Передаем true, чтобы пропустить сброс значения
            updateBitsFromType(true); 

            // 4. Заполняем остальные поля
            document.getElementById('editUnits').value = target.units || '';
            document.getElementById('editMin').value = target.min !== undefined ? target.min : '';
            document.getElementById('editMax').value = target.max !== undefined ? target.max : '';
            document.getElementById('editBehavior').value = target.behavior || 'sine';
            document.getElementById('editFreq').value = target.freq !== undefined ? target.freq : '';
            document.getElementById('editNoise').value = target.noise !== undefined ? target.noise : '';
            
            document.getElementById('editFormula').value = target.formula || '';
            document.getElementById('editDependsOn').value = target.dependsOn ? target.dependsOn.join(', ') : '';
            
            toggleFormulaSection();
            
            document.getElementById('paramEditorSection').style.display = 'block';
            updateParametersTable();
        }


        // Создание нового корневого параметра
        // Создание нового корневого параметра с дефолтными значениями
        function createNewParameter() {
            const timestamp = Date.now().toString(36).toUpperCase();
            const newParam = {
                id: 'PARAM_' + timestamp,
                desc: 'Новый параметр',
                type: 'UB',
                bits: 16,
                units: '',
                min: 0, 
                max: 65535,
                behavior: 'sine',
                freq: 0.1,
                noise: 0,
                formula: '',
                dependsOn: [],
                subParams: [],
                polyCoeffs: []
            };
            appState.parameters.push(newParam);
            const newIndex = appState.parameters.length - 1;
            selectParameter([newIndex]);
        }

        // Автоматическое обновление битов при выборе типа
        // skipValueUpdate - если true, то только настраивает UI (lock/placeholder), не меняя value
        function updateBitsFromType(skipValueUpdate = false) {
            const type = document.getElementById('editType').value;
            const bitsInput = document.getElementById('editBits');
            
            const typeSettings = {
                'UB': { bits: 16, locked: false },
                'SB': { bits: 16, locked: false },
                'IEEE754': { bits: 32, locked: true },
                'DOUBLE': { bits: 64, locked: true },
                'SCALED_INT': { bits: 16, locked: false },
                'DISCRETE': { bits: 8, locked: false },
                'TIME_CODE': { bits: 64, locked: false },
                'MIL1750A': { bits: 32, locked: true },
                'CONTAINER': { bits: 16, locked: false }
            };

            const setting = typeSettings[type] || { bits: 16, locked: false };
            
            // Настраиваем UI
            bitsInput.placeholder = setting.bits;
            bitsInput.disabled = setting.locked;
            bitsInput.style.backgroundColor = setting.locked ? 'rgba(255, 255, 255, 0.05)' : '';
            bitsInput.style.color = setting.locked ? '#888' : '#fff';
            bitsInput.title = setting.locked ? "Для этого стандарта количество бит фиксировано" : "";

            // Меняем значение ТОЛЬКО если это не запрещено (например, при ручном выборе типа пользователем)
            // ИЛИ если текущее значение пустое
            if (!skipValueUpdate) {
                // Если тип с фиксированными битами - форсируем их всегда
                if (setting.locked) {
                    bitsInput.value = setting.bits;
                } 
                // Иначе меняем только если поле пустое (чтобы не стирать ввод юзера)
                else if (!bitsInput.value) {
                    bitsInput.value = setting.bits;
                }
            }
        }





        // Добавление ребенка в контейнер
        function addChildParameter(parentPath) {
            // Находим родителя
            let parent = appState.parameters[parentPath[0]];
            for(let i=1; i<parentPath.length; i++) {
                parent = parent.subParams[parentPath[i]];
            }
            
            const newParam = {
                id: parent.id + '_SUB_' + (parent.subParams.length + 1),
                desc: 'Суб-параметр',
                type: 'UB',
                bits: parent.bits, // Обычно совпадают
                min: 0, max: 100,
                behavior: 'sine',
                subParams: []
            };
            
            parent.subParams.push(newParam);
            const newPath = [...parentPath, parent.subParams.length - 1];
            selectParameter(newPath);
        }

        // Сохранение из редактора
        // Сохранение из редактора с fallback на дефолты
        window.saveParameterFromEditor = function() {
            const pathStr = document.getElementById('editPath').value;
            if (!pathStr) return;
            const path = JSON.parse(pathStr);
            
            let target = appState.parameters[path[0]];
            for(let i=1; i<path.length; i++) {
                target = target.subParams[path[i]];
            }
            
            // Читаем значения с fallback
            target.id = document.getElementById('editID').value.toUpperCase() || 'UNNAMED';
            target.desc = document.getElementById('editDesc').value || 'Без описания';
            target.type = document.getElementById('editType').value || 'UB';
            target.bits = parseInt(document.getElementById('editBits').value);
            
            // Защита от NaN (если пользователь стер поле)
            if (isNaN(target.bits)) {
                 // Пытаемся взять из placeholder (дефолт)
                 target.bits = parseInt(document.getElementById('editBits').placeholder) || 16;
            }
            target.units = document.getElementById('editUnits').value || '';
            target.min = parseFloat(document.getElementById('editMin').value) || 0;
            target.max = parseFloat(document.getElementById('editMax').value) || 100;
            target.behavior = document.getElementById('editBehavior').value || 'sine';
            target.freq = parseFloat(document.getElementById('editFreq').value) || 0.1;
            target.noise = parseFloat(document.getElementById('editNoise').value) || 0;
            
            target.formula = document.getElementById('editFormula').value || '';
            const depsRaw = document.getElementById('editDependsOn').value;
            target.dependsOn = depsRaw ? depsRaw.split(',').map(s=>s.trim()).filter(s=>s) : [];
            
            if(target.behavior !== 'formula') {
                target.formula = '';
                target.dependsOn = [];
            }
            
            updateParametersTable();
            
            const btn = document.querySelector('#paramEditorSection .btn:last-child');
            const originalText = btn.innerText;
            btn.innerText = '✅ Сохранено!';
            setTimeout(() => btn.innerText = originalText, 1500);
        }


        function cancelEdit() {
            document.getElementById('paramEditorSection').style.display = 'none';
            document.getElementById('editPath').value = '';
            updateParametersTable(); // Снять выделение
        }
        
        function toggleFormulaSection() {
            const val = document.getElementById('editBehavior').value;
            document.getElementById('editFormulaSection').style.display = (val === 'formula') ? 'block' : 'none';
        }


            appState.parameters.forEach((param, idx) => {
                renderNode(param, idx, 0);
            });
        
        // Подсветка строк в дереве
        function highlightDependenciesInTree(depIds, active) {
            if (!depIds) return;
            
            depIds.forEach(id => {
                const row = document.getElementById(`param-row-${id}`);
                if (row) {
                    if (active) {
                        row.style.backgroundColor = 'rgba(255, 152, 0, 0.2)'; // Оранжевая подсветка
                        row.style.borderLeft = '3px solid #ff9800';
                        // Можно добавить скролл к элементу, если список длинный
                        // row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    } else {
                        row.style.backgroundColor = '';
                        row.style.borderLeft = '';
                    }
                }
            });
        }

        
        // Helper to delete from nested structure
        function deleteParamByPath(path) {
            if (!confirm('Удалить параметр?')) return;
            
            let target = appState.parameters;
            for(let i=0; i<path.length-1; i++) {
                target = target[path[i]].subParams;
            }
            target.splice(path[path.length-1], 1);
            
            updateParametersTable();
           
        }

        // Helper to add child to container
        function addSubParam(path) {
             // Logic to open modal and add to specific parent...
             // For simplicity, just alert in this snippet or implementing full modal logic later
             alert("Добавление в контейнер будет реализовано в следующем патче UI модального окна");
        }
