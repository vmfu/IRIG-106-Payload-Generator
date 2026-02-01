// ============================================================================
// MAIN - Entry Point
// ============================================================================

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Инициализируем дефолтные параметры
    initializeDefaults();

    // Обновляем таблицу параметров
    updateParametersTable();

    // Обработчик переключения поведения (показать/скрыть настройки формулы)
    const behaviorSelect = document.getElementById('paramBehavior');
    const formulaSection = document.getElementById('formulaInputSection');

    if (behaviorSelect && formulaSection) {
        behaviorSelect.addEventListener('change', function() {
            if (this.value === 'formula') {
                formulaSection.style.display = 'block';
            } else {
                formulaSection.style.display = 'none';
            }
        });
    }

    // Показываем версию
    document.getElementById('versionNumber').textContent = VERSION;

    // Инициализируем язык
    if (typeof initLanguage === 'function') {
        initLanguage();
    }
});
