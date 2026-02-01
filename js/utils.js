		window.updateLanguage = function(lang) {
		  currentLanguage = lang;
		  
		  // Update all elements with data-i18n attribute
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
		  // Update <option> elements inside <select>
			document.querySelectorAll('option[data-i18n]').forEach(option => {
			  const key = option.getAttribute('data-i18n');
			  if (TRANSLATIONS[lang][key]) {
				option.textContent = TRANSLATIONS[lang][key];
			  }
			});

		  // Update placeholder texts
		  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
			const key = element.getAttribute('data-i18n-placeholder');
			if (TRANSLATIONS[lang][key]) {
			  element.placeholder = TRANSLATIONS[lang][key];
			}
		  });
		  
		  // Save language preference
		  localStorage.setItem('irig106_language', lang);
		    // Toggle Help Sections
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

		// Initialize language from localStorage or browser
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
		  // Set version number
		  document.getElementById('versionNumber').textContent = VERSION;

		}
	
        // ===== STATE =====
        let appState = {
