		// Version
		window.VERSION = "1.0.0"; // const VERSION = "1.0.0";

		// ============================================================================
		// INTERNATIONALIZATION SYSTEM
		// ============================================================================
		window.TRANSLATIONS = {
		  ru: {
			// Header
			pageTitle: "🚀 IRIG 106 Payload Generator",
			subtitle: "Учебный генератор телеметрических данных IRIG 106",
			version: "Версия",
			darkTheme: "Dark Sci-Fi Theme (JavaScript Edition)",
			author: "Разработано",
			// Tabs
			tabConfig: "Конфигурация",
			tabGeneration: "Генерация",
			tabResults: "Результаты",
			tabDownload: "Скачать",
			tabHelp: "Справка",
			// Frame Settings
			frameSettingsTitle: "Настройки кадра",
			labelNumFrames: "Количество кадров",
			hintNumFrames: "(10 - 10000)",
			labelSamplingRate: "Частота дискретизации (Гц)",
			hintSamplingRate: "(1 - 1000 Гц)",
			labelByteOrder: "Порядок байтов",
			optionBigEndian: "Big-Endian (MSB first)",
			optionLittleEndian: "Little-Endian (LSB first)",
			labelBitOrder: "Порядок бит",
			optionMSBFirst: "MSB-first",
			optionLSBFirst: "LSB-first",
			labelOptions: "Опции",
			optionLoopback: "Loopback-тестирование",
			optionDependencyCheck: "Проверка зависимостей",
			// File Settings
			fileSettingsTitle: "Настройки файлов",
			labelBinFilename: "Имя BIN файла ",
			labelTmatsFilename: "Имя TMATS файла",
			labelLogFilename: "Имя Log файла ",

			// Error Injection
			errorInjectionTitle: "Error Injection",
			optionEnableErrorInjection: "Включить внесение ошибок",
			labelBitErrorRate: "BER (Bit Error Rate)",
			hintBitErrorRate: "(0.0001 = 1 ошибка на 10k бит)",
			// Import / Export Config
			importConfigTitle: "Импорт / Экспорт конфигурации",
			labelConfigFile: "Файл конфигурации (.json)",
			btnLoadConfig: "Загрузить",
			btnSaveConfig: "Сохранить JSON",

			// Tree View
			treeViewTitle: "📑Параметры (Tree View)",
			treeColId: "ИД",
			treeColWord: "Слово",
			treeColType: "Тип",
			treeColBits: "Биты",
			treeColActions: "Действия",
			btnCreateNewParam: "Создать параметр",
			// Parameter Editor (Detail View)
			paramEditorTitle: "Редактор параметра",
			labelParamId: "ID параметра",
			labelParamDesc: "Описание",
			labelParamType: "Тип данных",
			labelParamBits: "Биты",
			labelParamUnits: "Единицы измерения",
			labelParamMin: "Min",
			labelParamMax: "Max",
			labelParamBehavior: "Поведение",
			labelParamFormula: "JavaScript формула",
			labelParamDependsOn: "Зависимости (ID через запятую)",
			labelParamFreq: "Частота (Hz)",
			labelParamNoise: "Шум (σ)",

			// Type options
			optionTypeUB: "UB (Unsigned Binary)",
			optionTypeSB: "SB (Signed Binary)",
			optionTypeIEEE754: "IEEE754 (32-bit Float)",
			optionTypeDouble: "DOUBLE (64-bit Float)",
			optionTypeScaledInt: "SCALEDINT (Ax+B)",
			optionTypeDiscrete: "DISCRETE (Bit flags)",
			optionTypeTimecode: "TIMECODE (High/Low)",
			optionTypeMil1750a: "MIL1750A (32-bit Float)",
			optionTypeContainer: "CONTAINER (Subcom)",

			// Behavior options
			optionBehaviorSine: "Sine (синус)",
			optionBehaviorRamp: "Ramp (линейный)",
			optionBehaviorRandom: "Random (случайный)",
			optionBehaviorCounter: "Counter (счётчик)",
			optionBehaviorFrozen: "Frozen (константа)",
			optionBehaviorTime: "Time (время)",
			optionBehaviorFormula: "Formula (JS)",
			optionBehaviorDiscrete: "Discrete (0/1)",
			optionBehaviorSubcom: "Subcommutated (Auto)",

			// Buttons
			btnCancelEdit: "Отмена",
			btnSaveParam: "Сохранить",
			// Dependency Graph
			graphTitle: "Граф зависимостей параметров",
			graphPlaceholder: "Граф будет построен автоматически после добавления зависимых параметров",

			// Generation Tab
			generationStatusTitle: "Статус генерации",
			btnStartGeneration: "Сгенерировать Payload",
			btnCancelGeneration: "Остановить",
			consoleOutputTitle: "Консоль вывода",
			// Tab Results
			chartsTitle: "Графики (Preview)",
			labelChartParam1: "Параметр 1",
			labelChartParam2: "Параметр 2",
			hexViewerTitle: "Просмотр Hex (Первые 200 байт)",

			// Tab Download
			downloadTitle: "Скачать файлы",
			downloadDesc: "Здесь можно скачать сгенерированные файлы. Кнопки станут активны после генерации.",
			btnDownloadBin: "Скачать Payload (.BIN)",
			btnDownloadTmats: "Скачать TMATS (.TMATS)",
			btnDownloadReport: "Скачать Отчет (.TXT)",
			btnDownloadJson: "Скачать JSON Config",

			// Stats
			statsTitle: "Статистика генерации",
			statStatus: "Статус:",
			statFrames: "Сгенерировано кадров:",
			statBinSize: "Размер .BIN:",
			statTmatsSize: "Размер .TMATS:",
			statReportSize: "Размер отчета:",
			statTime: "Время генерации:",

			// Control Panel
			controlPanelTitle: "Панель управления",
			samplingRate: "Частота дискретизации (Гц)",
			numFrames: "Количество кадров",
			byteOrder: "Порядок байтов",
			bigEndian: "Big-Endian (MSB first)",
			littleEndian: "Little-Endian (LSB first)",
			bitOrder: "Порядок бит",
			msbFirst: "MSB-first",
			lsbFirst: "LSB-first",
			checksumType: "Тип контрольной суммы",
			checksumNone: "Нет",
			checksumCRC16: "CRC-16 (CCITT)",
			checksumCRC32: "CRC-32 (IEEE 802.3)",
			enableDependencyCheck: "Включить проверку зависимостей",
			enableLoopbackTest: "Включить loopback-тестирование",
			generateButton: "🚀 Генерировать IRIG 106 Payload",
			
			// Output Files Section
			outputFilesTitle: "Выходные файлы",
			outputFilesDesc: "После успешной генерации будут доступны следующие файлы:",
			binaryPayload: "Бинарный payload (Chapter 4 PCM)",
			tmatsMetadata: "Метаданные TMATS (Telemetry Attributes Transfer Standard)",
			configReport: "Отчёт конфигурации (человеко-читаемый формат)",
			
			// What is IRIG 106
			whatIsTitle: "Что такое IRIG 106?",
			irigDescription: "**IRIG 106** (Inter-Range Instrumentation Group Standard 106) — это международный стандарт для записи и передачи телеметрических данных в аэрокосмической, оборонной и научной сферах.",
			chapter4Description: "**Chapter 4** определяет формат PCM (Pulse Code Modulation) — цифрового представления аналоговых и дискретных сигналов.",
			generatorPurpose: "Генератор позволяет создавать бинарные пакеты данных (`.bin`), метаданные TMATS (`.tmats`) и отчёты для тестирования систем обработки телеметрии, таких как:",
			
			// Frame Structure
			frameStructureTitle: "Структура Major Frame",
			frameDescription: "**Major Frame** — это основная единица данных, содержащая все параметры миссии.",
			frameWords: "Каждый кадр разбит на **слова (words)** фиксированной длины (обычно 8-64 бита).",
			typicalStructure: "Типичная структура кадра:",
			
			// Data Types
			dataTypesTitle: "Типы данных",
			unsignedBinaryTitle: "Беззнаковое целое (UB - Unsigned Binary)",
			signedBinaryTitle: "Знаковое целое (SB - Signed Binary)",
			ieee754Title: "32-битное число с плавающей точкой (IEEE754)",
			doubleTitle: "64-битное число с плавающей точкой (DOUBLE)",
			mil1750aTitle: "MIL-STD-1750A Float (32-bit)",
			timecodeTitle: "Временной код (TIMECODE)",
			discreteTitle: "Дискретные состояния (DISCRETE)",
			
			// Behaviors
			behaviorsTitle: "Поведения параметров",
			counterBehaviorTitle: "1️⃣ Counter (Счётчик)",
			sineBehaviorTitle: "2️⃣ Sine (Синусоида)",
			rampBehaviorTitle: "3️⃣ Ramp (Линейное нарастание)",
			randomBehaviorTitle: "4️⃣ Random (Случайное значение)",
			frozenBehaviorTitle: "5️⃣ Frozen (Константа)",
			timeBehaviorTitle: "6️⃣ Time (Время миссии)",
			formulaBehaviorTitle: "7️⃣ Formula (Вычисляемое значение)",
			discreteBehaviorTitle: "8️⃣ Discrete (Случайные состояния)",
			subcommutatedTitle: "9️⃣ Subcommutated (Субкоммутация)",
			
			// Advanced Features
			advancedTitle: "Продвинутые возможности",
			dependencyTitle: "Зависимости между параметрами",
			subcommutationTitle: "Субкоммутация (экономия полосы)",
			polyTitle: "Полиномиальная калибровка",
			tmatsTitle: "TMATS (автоматическая конфигурация)",
			loopbackTitle: "Loopback-тестирование",
			
			// Use Cases
			useCasesTitle: "Примеры использования",
			rocketTitle: "🚀 Ракета-носитель (первая ступень)",
			marsTitle: "🔴 Пример: Посадочный модуль",
			satelliteTitle: "🛰️ Спутник на низкой орбите",
			
			// Troubleshooting
			troubleshootingTitle: "Решение проблем",
			cyclicDependency: "❌ Ошибка: Циклическая зависимость",
			undefinedParameter: "❌ Ошибка: Undefined parameter in formula",
			nanValues: "❌ Ошибка: NaN в декодированных данных",
			precisionLoss: "⚠️ Потеря точности при кодировании GPS",
			subcommutationError: "❌ Субкоммутация работает некорректно",
			
			// Footer
			footerTitle: "О генераторе",
			developedBy: "Генератор разработан",
			forMissions: "для учебных целей 🎓",
			goodLuck: "Удачи в ваших космических миссиях! 🌌",
			
			// Console Messages
			consoleGenerating: "Генерация IRIG 106 payload...",
			consoleConfig: "Конфигурация:",
			consoleFrames: "кадров",
			consoleRate: "Частота",
			consoleByteOrder: "Порядок байтов",
			consoleBitOrder: "Порядок бит",
			consoleSuccess: "✅ Генерация завершена!",
			consoleBinarySize: "📦 Размер бинарных данных",
			consoleTmatsSize: "📄 Размер TMATS",
			consoleReportSize: "📊 Размер отчёта",
			consoleError: "❌ Ошибка генерации",
			consoleLoopback: "🔄 Loopback Test"
		  },
		  
		  en: {
			// Header
			pageTitle: "🚀 IRIG 106 Payload Generator",
			subtitle: "Educational IRIG 106 Telemetry Generator",
			version: "Version",
			darkTheme: "Dark Sci-Fi Theme (JavaScript Edition)",
			author: "Developed by",
			// Tabs
			tabConfig: "Configuration",
			tabGeneration: "Generation",
			tabResults: "Results",
			tabDownload: "Download",
			tabHelp: "Help",	
			// Frame Settings
			frameSettingsTitle: "Frame Settings",
			labelNumFrames: "Number of Frames",
			hintNumFrames: "(10 - 10000)",
			labelSamplingRate: "Sampling Rate (Hz)",
			hintSamplingRate: "(1 - 1000 Hz)",
			labelByteOrder: "Byte Order",
			optionBigEndian: "Big-Endian (MSB first)",
			optionLittleEndian: "Little-Endian (LSB first)",
			labelBitOrder: "Bit Order",
			optionMSBFirst: "MSB-first",
			optionLSBFirst: "LSB-first",
			labelOptions: "Options",
			optionLoopback: "Loopback testing",
			optionDependencyCheck: "Dependency checking",
			// File Settings
			fileSettingsTitle: "File Settings",
			labelBinFilename: "BIN Filename",
			labelTmatsFilename: "TMATS Filename",
			labelLogFilename: "Log Filename",

			// Error Injection
			errorInjectionTitle: "Error Injection",
			optionEnableErrorInjection: "Enable error injection",
			labelBitErrorRate: "BER (Bit Error Rate)",
			hintBitErrorRate: "(0.0001 = 1 error per 10k bits)",
			// Import / Export Config
			importConfigTitle: "Import / Export Config",
			labelConfigFile: "Config file (.json)",
			btnLoadConfig: "Load",
			btnSaveConfig: "Save JSON",

			// Tree View
			treeViewTitle: "📑Parameters (Tree View)",
			treeColId: "ID",
			treeColWord: "Word",
			treeColType: "Type",
			treeColBits: "Bits",
			treeColActions: "Actions",
			btnCreateNewParam: "Create parameter",
			// Parameter Editor (Detail View)
			paramEditorTitle: "Parameter Editor",
			labelParamId: "Parameter ID",
			labelParamDesc: "Description",
			labelParamType: "Data Type",
			labelParamBits: "Bits",
			labelParamUnits: "Units",
			labelParamMin: "Min",
			labelParamMax: "Max",
			labelParamBehavior: "Behavior",
			labelParamFormula: "JavaScript formula",
			labelParamDependsOn: "Dependencies (IDs, comma-separated)",
			labelParamFreq: "Frequency (Hz)",
			labelParamNoise: "Noise (σ)",

			// Type options
			optionTypeUB: "UB (Unsigned Binary)",
			optionTypeSB: "SB (Signed Binary)",
			optionTypeIEEE754: "IEEE754 (32-bit Float)",
			optionTypeDouble: "DOUBLE (64-bit Float)",
			optionTypeScaledInt: "SCALEDINT (Ax+B)",
			optionTypeDiscrete: "DISCRETE (Bit flags)",
			optionTypeTimecode: "TIMECODE (High/Low)",
			optionTypeMil1750a: "MIL1750A (32-bit Float)",
			optionTypeContainer: "CONTAINER (Subcom)",

			// Behavior options
			optionBehaviorSine: "Sine",
			optionBehaviorRamp: "Ramp",
			optionBehaviorRandom: "Random",
			optionBehaviorCounter: "Counter",
			optionBehaviorFrozen: "Frozen",
			optionBehaviorTime: "Time",
			optionBehaviorFormula: "Formula (JS)",
			optionBehaviorDiscrete: "Discrete (0/1)",
			optionBehaviorSubcom: "Subcommutated (Auto)",

			// Buttons
			btnCancelEdit: "Cancel",
			btnSaveParam: "Save",
			// Dependency Graph
			graphTitle: "Parameter Dependency Graph",
			graphPlaceholder: "Graph will be generated automatically after adding dependent parameters",

			// Generation Tab
			generationStatusTitle: "Generation Status",
			btnStartGeneration: "Generate Payload",
			btnCancelGeneration: "Stop",
			consoleOutputTitle: "Console Output",
			// Tab Results
			chartsTitle: "Charts (Preview)",
			labelChartParam1: "Parameter 1",
			labelChartParam2: "Parameter 2",
			hexViewerTitle: "Hex Viewer (First 200 bytes)",

			// Tab Download
			downloadTitle: "Download Files",
			downloadDesc: "Generated files can be downloaded here. Buttons will become active after generation.",
			btnDownloadBin: "Download Payload (.BIN)",
			btnDownloadTmats: "Download TMATS (.TMATS)",
			btnDownloadReport: "Download Report (.TXT)",
			btnDownloadJson: "Download JSON Config",

			// Stats
			statsTitle: "Generation Statistics",
			statStatus: "Status:",
			statFrames: "Frames Generated:",
			statBinSize: ".BIN Size:",
			statTmatsSize: ".TMATS Size:",
			statReportSize: "Report Size:",
			statTime: "Generation Time:",

			// Control Panel
			controlPanelTitle: "Control Panel",
			samplingRate: "Sampling Rate (Hz)",
			numFrames: "Number of Frames",
			byteOrder: "Byte Order",
			bigEndian: "Big-Endian (MSB first)",
			littleEndian: "Little-Endian (LSB first)",
			bitOrder: "Bit Order",
			msbFirst: "MSB-first",
			lsbFirst: "LSB-first",
			checksumType: "Checksum Type",
			checksumNone: "None",
			checksumCRC16: "CRC-16 (CCITT)",
			checksumCRC32: "CRC-32 (IEEE 802.3)",
			enableDependencyCheck: "Enable dependency checking",
			enableLoopbackTest: "Enable loopback testing",
			generateButton: "🚀 Generate IRIG 106 Payload",
			
			// Output Files Section
			outputFilesTitle: "Output Files",
			outputFilesDesc: "After successful generation, the following files will be available:",
			binaryPayload: "Binary payload (Chapter 4 PCM)",
			tmatsMetadata: "TMATS metadata (Telemetry Attributes Transfer Standard)",
			configReport: "Configuration report (human-readable format)",
			
			// What is IRIG 106
			whatIsTitle: "What is IRIG 106?",
			irigDescription: "**IRIG 106** (Inter-Range Instrumentation Group Standard 106) is an international standard for recording and transmitting telemetry data in aerospace, defense, and scientific fields.",
			chapter4Description: "**Chapter 4** defines the PCM (Pulse Code Modulation) format — digital representation of analog and discrete signals.",
			generatorPurpose: "The generator allows creating binary data packets (`.bin`), TMATS metadata (`.tmats`), and reports for testing telemetry processing systems such as:",
			
			// Frame Structure
			frameStructureTitle: "Major Frame Structure",
			frameDescription: "**Major Frame** is the main data unit containing all mission parameters.",
			frameWords: "Each frame is divided into **words** of fixed length (typically 8-64 bits).",
			typicalStructure: "Typical frame structure:",
			
			// Data Types
			dataTypesTitle: "Data Types",
			unsignedBinaryTitle: "Unsigned Integer (UB - Unsigned Binary)",
			signedBinaryTitle: "Signed Integer (SB - Signed Binary)",
			ieee754Title: "32-bit Floating Point (IEEE754)",
			doubleTitle: "64-bit Floating Point (DOUBLE)",
			mil1750aTitle: "MIL-STD-1750A Float (32-bit)",
			timecodeTitle: "Time Code (TIMECODE)",
			discreteTitle: "Discrete States (DISCRETE)",
			
			// Behaviors
			behaviorsTitle: "Parameter Behaviors",
			counterBehaviorTitle: "1️⃣ Counter",
			sineBehaviorTitle: "2️⃣ Sine",
			rampBehaviorTitle: "3️⃣ Ramp",
			randomBehaviorTitle: "4️⃣ Random",
			frozenBehaviorTitle: "5️⃣ Frozen (Constant)",
			timeBehaviorTitle: "6️⃣ Time (Mission Time)",
			formulaBehaviorTitle: "7️⃣ Formula (Calculated Value)",
			discreteBehaviorTitle: "8️⃣ Discrete (Random States)",
			subcommutatedTitle: "9️⃣ Subcommutated",
			
			// Advanced Features
			advancedTitle: "Advanced Features",
			dependencyTitle: "Parameter Dependencies",
			subcommutationTitle: "Subcommutation (bandwidth savings)",
			polyTitle: "Polynomial Calibration",
			tmatsTitle: "TMATS (automatic configuration)",
			loopbackTitle: "Loopback Testing",
			
			// Use Cases
			useCasesTitle: "Use Cases",
			rocketTitle: "🚀 Launch Vehicle (First Stage)",
			marsTitle: "🔴 Mars Lander",
			satelliteTitle: "🛰️ Low Earth Orbit Satellite",
			
			// Troubleshooting
			troubleshootingTitle: "Troubleshooting",
			cyclicDependency: "❌ Error: Cyclic dependency",
			undefinedParameter: "❌ Error: Undefined parameter in formula",
			nanValues: "❌ Error: NaN in decoded data",
			precisionLoss: "⚠️ Precision loss when encoding GPS",
			subcommutationError: "❌ Subcommutation not working correctly",
			
			// Footer
			footerTitle: "About Generator",
			developedBy: "Generator developed by",
			forMissions: "for educational purposes 🎓",
			goodLuck: "Good luck with your space missions! 🌌",
			
			// Console Messages
			consoleGenerating: "Generating IRIG 106 payload...",
			consoleConfig: "Configuration:",
			consoleFrames: "frames",
			consoleRate: "Rate",
			consoleByteOrder: "Byte order",
			consoleBitOrder: "Bit order",
			consoleSuccess: "✅ Generation complete!",
			consoleBinarySize: "📦 Binary data size",
			consoleTmatsSize: "📄 TMATS size",
			consoleReportSize: "📊 Report size",
			consoleError: "❌ Generation error",
			consoleLoopback: "🔄 Loopback Test"
		  }
		};

		// Current language state
		window.currentLanguage = 'ru'; // Default language

		// Translation helper function
		window.t = function(key) {
		  return TRANSLATIONS[currentLanguage][key] || key;
		};
