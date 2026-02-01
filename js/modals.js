        window.deleteParameter = function(idx) {
            appState.parameters.splice(idx, 1);
            updateParametersTable();
       
        }

                function showAddParameterModal() {
            const modal = document.getElementById('addParamModal');
            modal.classList.add('active');
            
            // Сброс полей формы к дефолтным значениям
            document.getElementById('paramID').value = '';
            document.getElementById('paramDesc').value = '';
            document.getElementById('paramType').value = 'UB';
            document.getElementById('paramBits').value = '16';
            document.getElementById('paramUnits').value = '';
            document.getElementById('paramMin').value = '0';
            document.getElementById('paramMax').value = '100';
            document.getElementById('paramFreq').value = '0.1';
            document.getElementById('paramNoise').value = '0';
            
            // Сброс поведения и скрытие формулы
            const behaviorSelect = document.getElementById('paramBehavior');
            if (behaviorSelect) {
                behaviorSelect.value = 'sine'; // Дефолтное поведение
                // Триггерим событие change вручную, чтобы обновить UI
                const event = new Event('change');
                behaviorSelect.dispatchEvent(event);
            }
            
            // Очистка полей формулы
            if (document.getElementById('paramFormula')) document.getElementById('paramFormula').value = '';
            if (document.getElementById('paramDependsOn')) document.getElementById('paramDependsOn').value = '';
            if (document.getElementById('formulaInputSection')) document.getElementById('formulaInputSection').style.display = 'none';
        }


        window.addParameter = function() {
            // 1. Сначала читаем и обрабатываем зависимости (объявляем depsArray)
            const depsRaw = document.getElementById('paramDependsOn') ? document.getElementById('paramDependsOn').value : '';
            const depsArray = depsRaw ? depsRaw.split(',').map(s => s.trim()).filter(s => s.length > 0) : [];
            
            // 2. Читаем формулу
            const formulaRaw = document.getElementById('paramFormula') ? document.getElementById('paramFormula').value : '';

            // 3. Создаем объект параметра
            const param = {
                id: document.getElementById('paramID').value.toUpperCase(),
                desc: document.getElementById('paramDesc').value,
                type: document.getElementById('paramType').value,
                bits: parseInt(document.getElementById('paramBits').value),
                units: document.getElementById('paramUnits').value,
                min: parseFloat(document.getElementById('paramMin').value),
                max: parseFloat(document.getElementById('paramMax').value),
                behavior: document.getElementById('paramBehavior').value,
                freq: parseFloat(document.getElementById('paramFreq').value),
                noise: parseFloat(document.getElementById('paramNoise').value),
                
                // === НОВЫЕ ПОЛЯ ===
                formula: formulaRaw,
                dependsOn: depsArray,
                subParams: [], // Для будущих контейнеров
                polyCoeffs: [] // Для будущих полиномов
                // ==================
            };

            if (!param.id) {
                alert('ID параметра обязателен!');
                return;
            }

            appState.parameters.push(param);
            
            // Обновляем UI
            if (typeof updateParametersTable === 'function') {
                updateParametersTable();
            } else {
                // Fallback если новая таблица еще не внедрена
                const tbody = document.getElementById('paramsTableBody');
                if(tbody) { /* старая логика */ }
            }
            
          
            closeModal('addParamModal');

            // Очистка формы
            document.getElementById('paramID').value = '';
            document.getElementById('paramDesc').value = '';
            document.getElementById('paramBits').value = '16';
            document.getElementById('paramUnits').value = '';
            document.getElementById('paramMin').value = '0';
            document.getElementById('paramMax').value = '100';
            document.getElementById('paramFreq').value = '0.1';
            document.getElementById('paramNoise').value = '0';
            
            // Очистка новых полей (проверка на существование элементов)
            if(document.getElementById('paramFormula')) document.getElementById('paramFormula').value = '';
            if(document.getElementById('paramDependsOn')) document.getElementById('paramDependsOn').value = '';
            if(document.getElementById('formulaInputSection')) document.getElementById('formulaInputSection').style.display = 'none';
        }




 


        // ===== MODALS =====
        window.closeModal = function(modalId) {
            document.getElementById(modalId).classList.remove('active');
        }

        // ===== CONSOLE LOGGING =====
        window.consoleLog = function(message, type = 'info') {
            const console = document.getElementById('console');
            const line = document.createElement('div');
            line.className = `console-line console-${type}`;
            line.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            console.appendChild(line);
            console.scrollTop = console.scrollHeight;
        }

        // ===== GENERATION =====
        function startGeneration() {
