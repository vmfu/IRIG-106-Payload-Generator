// ============================================================================
// LANGUAGE - Language and UI Navigation
// ============================================================================

window.switchLanguage = function(lang) {
    updateLanguage(lang);

    document.querySelectorAll('.lang-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById('lang' + lang.charAt(0).toUpperCase() + lang.slice(1)).classList.add('active');
}

window.updateLanguage = function(lang) {
    currentLanguage = lang;

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (TRANSLATIONS[lang][key]) {
            if (element.tagName === 'INPUT' && element.type === 'button') {
                element.value = TRANSLATIONS[lang][key];
            } else {
                element.textContent = TRANSLATIONS[lang][key];
            }
        }
    });

    document.querySelectorAll('option[data-i18n]').forEach(option => {
        const key = option.getAttribute('data-i18n');
        if (TRANSLATIONS[lang][key]) {
            option.textContent = TRANSLATIONS[lang][key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (TRANSLATIONS[lang][key]) {
            element.placeholder = TRANSLATIONS[lang][key];
        }
    });

    localStorage.setItem('irig106_language', lang);

    const helpRu = document.getElementById('help-ru');
    const helpEn = document.getElementById('help-en');
    if (helpRu && helpEn) {
        if (currentLanguage === 'ru') {
            helpRu.style.display = 'block';
            helpEn.style.display = 'none';
        } else {
            helpRu.style.display = 'none';
            helpEn.style.display = 'block';
        }
    }
}

window.initLanguage = function() {
    const savedLang = localStorage.getItem('irig106_language');
    const browserLang = navigator.language.toLowerCase();

    if (savedLang && TRANSLATIONS[savedLang]) {
        currentLanguage = savedLang;
    } else if (browserLang.startsWith('ru')) {
        currentLanguage = 'ru';
    } else {
        currentLanguage = 'en';
    }

    updateLanguage(currentLanguage);

    const versionEl = document.getElementById('versionNumber');
    if (versionEl) {
        versionEl.textContent = VERSION;
    }
}

window.switchTab = function(tabName) {
    document.querySelectorAll('.content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(el => el.classList.remove('active'));

    document.getElementById(tabName).classList.add('active');

    const activeBtn = document.querySelector(`.tab-button[onclick="switchTab('${tabName}')"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    if (tabName === 'results' && appState.generatedData.length > 0) {
        updateDataTable();
        updateCharts();
    }
}
