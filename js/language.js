		window.switchLanguage = function(lang) {
		  updateLanguage(lang);
		  
		  // Update button states
		  document.querySelectorAll('.lang-button').forEach(btn => {
			btn.classList.remove('active');
		  });
		  document.getElementById('lang' + lang.charAt(0).toUpperCase() + lang.slice(1)).classList.add('active');
		}

        // ===== TAB SWITCHING =====
        function switchTab(tabName) {
            document.querySelectorAll('.content').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.tab-button').forEach(el => el.classList.remove('active'));
            
            document.getElementById(tabName).classList.add('active');
            event.target.classList.add('active');

            if (tabName === 'results' && appState.generatedData.length > 0) {
                updateDataTable();
                updateCharts();
            }
        }

        // ===== DEFAULTS =====
         function initializeDefaults() {
