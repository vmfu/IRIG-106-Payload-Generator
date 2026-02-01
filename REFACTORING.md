# Рефакторинг IRIG 106 Payload Generator

## Цель
Разделить монолитный HTML файл (6000+ строк) на модульную структуру для удобства разработки.

---

## Новая структура проекта

```
IRIG 106 Payload Generator/
├── index.html                          # Только структура (lines ~635-3203)
├── css/
│   └── styles.css                     # Все стили (lines 8-634)
├── js/
│   ├── constants.js                   # VERSION, TRANSLATIONS (lines 3204-3670)
│   ├── state.js                       # appState, state management (lines 3743-3760)
│   ├── initialization.js              # initializeDefaults, default params (lines 3765-3930)
│   ├── ui.js                          # renderTree, switchTab, updateParametersTable (lines 3932-4074)
│   ├── parameter-editor.js            # selectParameter, saveParameterFromEditor, deleteParameter (lines 4075-4313)
│   ├── generation.js                  # startGeneration, generatePayload (lines 4437-4715)
│   ├── bitwriter.js                   # BitWriter class (lines 4513-4573)
│   ├── encoding.js                   # encodeRecursive и функции кодирования (lines 4574-4715)
│   ├── loopback.js                    # Функции декодирования для loopback (lines ~4716-5070)
│   ├── formulas.js                    # computeValue, formula evaluation (lines ~3774-3930)
│   ├── visualization.js               # updateHexViewer, updateCharts, drawWaterfall (lines 4472-5152)
│   ├── tmats.js                      # generateTMATS (lines 5232-5442)
│   ├── download.js                   # downloadBinary, downloadTMATS, etc. (lines ~5153-5231)
│   └── main.js                       # Entry point, event listeners (lines 3743-3760, initializeDefaults)
├── vendor/
│   └── chart.min.js                   # Chart.js библиотека (уже есть)
├── LICENSE
├── README.md
├── AGENTS.md
└── REFACTORING.md                    # Этот файл
```

---

## Карта извлечения (Где что искать в старом файле)

### 1. CSS Стили (`css/styles.css`)
**Источник:** `IRIG 106 Payload Generator.html`
**Строки:** 8-634 (включая теги `<style>` и `</style>`)
**Действие:** Извлечь содержимое между `<style>` и `</style>`

---

### 2. Константы и переводы (`js/constants.js`)
**Источник:** `IRIG 106 Payload Generator.html`
**Строки:** 3204-3670
**Содержание:**
- `VERSION = "1.0.0"`
- `TRANSLATIONS` объект (ru/en переводы)
- `currentLanguage` переменная
- `updateLanguage(key)` функция (line 3672)

---

### 3. Состояние приложения (`js/state.js`)
**Источник:** `IRIG 106 Payload Generator.html`
**Строки:** 3743-3760
**Содержание:**
- `let appState = { ... }` объект
- Все поля состояния (parameters, generatedData, frameData, binData, tmatsData, reportData, isGenerating, startTime, charts)

---

### 4. Инициализация (`js/initialization.js`)
**Источник:** `IRIG 106 Payload Generator.html`
**Строки:** 3765-3930 (приблизительно)
**Содержание:**
- `function initializeDefaults()` - дефолтные параметры
- Пример конфигурации "MARS-MISSION-1"
- DOMContentLoaded event listener setup

---

### 5. Формулы и вычисления (`js/formulas.js`)
**Источник:** `IRIG 106 Payload Generator.html`
**Строки:** ~3930-4074 (нужно уточнить точные границы)
**Содержание:**
- `function computeValue(param, frameIdx, allParams, allValues, time)` - вычисление значений параметров
- Формула evaluation logic
- Обработка разных поведений (sine, ramp, random, counter, frozen, time, formula, discrete)

---

### 6. UI Функции (`js/ui.js`)
**Источник:** `IRIG 106 Payload Generator.html`
**Строки:** 3932-4074
**Содержание:**
- `function updateParametersTable()` - рендер таблицы параметров
- `function switchTab(tabName)` - переключение табов
- `function switchLanguage(lang)` - смена языка
- `function updateLanguage(lang)` - обновление текстов

---

### 7. Редактор параметров (`js/parameter-editor.js`)
**Источник:** `IRIG 106 Payload Generator.html`
**Строки:** 4075-4313
**Содержание:**
- `function selectParameter(path)` - открытие редактора
- `function saveParameterFromEditor()` - сохранение параметра
- `function deleteParameter(idx)` - удаление параметра
- Modal открытие/закрытие

---

### 8. Генерация данных (`js/generation.js`)
**Источник:** `IRIG 106 Payload Generator.html`
**Строки:** 4437-4715 (включая BitWriter class)
**Содержание:**
- `function startGeneration()` - точка входа генерации
- `function generatePayload(numFrames, samplingRate)` - основной цикл генерации
- Error injection логика
- Progress bar управление

---

### 9. BitWriter класс (`js/bitwriter.js`)
**Источник:** `IRIG 106 Payload Generator.html`
**Строки:** 4513-4573
**Содержание:**
- `class BitWriter` - класс для битовой записи
- Методы: `writeBits()`, `getBuffer()`, `reset()`, `getTotalBytes()`
- Поддержка byte order и bit order

---

### 10. Кодирование (`js/encoding.js`)
**Источник:** `IRIG 106 Payload Generator.html`
**Строки:** 4574-4715
**Содержание:**
- `function encodeRecursive(value, param, bitWriter, frameIdx)` - рекурсивное кодирование
- Type-specific encode функции (UB, SB, IEEE754, DOUBLE, DISCRETE, TIMECODE, MIL1750A)
- CONTAINER subcommutation логика

---

### 11. Loopback/Dekodierung (`js/loopback.js`)
**Источник:** `IRIG 106 Payload Generator.html`
**Строки:** ~4716-5070 (нужно уточнить)
**Содержание:**
- Decode функции для всех типов данных
- Loopback testing логика
- Error rate calculation

---

### 12. Визуализация (`js/visualization.js`)
**Источник:** `IRIG 106 Payload Generator.html`
**Строки:** 4472-5152
**Содержание:**
- `function updateHexViewer()` - hex viewer
- `function updateCharts()` - Chart.js обновление
- `function drawWaterfall()` - waterfall canvas
- `function updateDataTable()` - таблица данных

---

### 13. TMATS генерация (`js/tmats.js`)
**Источник:** `IRIG 106 Payload Generator.html`
**Строки:** 5232-5442
**Содержание:**
- `function generateTMATS()` - создание TMATS файла
- TMATS format generation

---

### 14. Скачать функции (`js/download.js`)
**Источник:** `IRIG 106 Payload Generator.html`
**Строки:** ~5153-5231 (нужно уточнить)
**Содержание:**
- `function downloadBinary()` - скачать .bin
- `function downloadTMATS()` - скачать .tmats
- `function downloadReport()` - скачать .txt
- `function downloadJSON()` - скачать .json

---

### 15. Main entry point (`js/main.js`)
**Источник:** `IRIG 106 Payload Generator.html`
**Строки:** 3743-3760 + initializeDefaults вызов + event listeners
**Содержание:**
- Инициализация appState
- DOMContentLoaded event listener
- Event binding для UI элементов
- Initialize defaults вызов

---

### 16. HTML структура (`index.html`)
**Источник:** `IRIG 106 Payload Generator.html`
**Строки:** 635-3203 (между `</style>` и `<script>`)
**Содержание:**
- Вся HTML структура
- Header, tabs, forms, modals
- НЕ включает теги `<style>` и `<script>` (они будут в отдельных файлах)
- Добавить теги `<link>` для CSS
- Добавить теги `<script>` для JS модулей

---

## План действий

### Этап 1: Создание структуры папок
- [ ] Создать папки: `css/`, `js/`, `vendor/`

### Этап 2: Извлечение CSS
- [ ] Извлечь строки 8-634 в `css/styles.css`
- [ ] Убрать теги `<style>` и `</style>`
- [ ] Проверить, что CSS корректен

### Этап 3: Извлечение JS модулей
- [ ] Извлечь `js/constants.js` (lines 3204-3670)
- [ ] Извлечь `js/state.js` (lines 3743-3760)
- [ ] Извлечь `js/initialization.js` (lines 3765-3930)
- [ ] Извлечь `js/formulas.js` (найти точные границы)
- [ ] Извлечь `js/ui.js` (lines 3932-4074)
- [ ] Извлечь `js/parameter-editor.js` (lines 4075-4313)
- [ ] Извлечь `js/bitwriter.js` (lines 4513-4573)
- [ ] Извлечь `js/encoding.js` (lines 4574-4715)
- [ ] Извлечь `js/generation.js` (lines 4437-4715, excluding BitWriter)
- [ ] Извлечь `js/loopback.js` (найти точные границы)
- [ ] Извлечь `js/visualization.js` (lines 4472-5152)
- [ ] Извлечь `js/tmats.js` (lines 5232-5442)
- [ ] Извлечь `js/download.js` (найти точные границы)
- [ ] Извлечь `js/main.js` (create entry point)

### Этап 4: Создание нового HTML
- [ ] Создать `index.html` на основе старого (lines 635-3203)
- [ ] Убрать весь JavaScript из `<script>` тега
- [ ] Добавить `<link rel="stylesheet" href="css/styles.css">` в `<head>`
- [ ] Добавить `<script>` теги для всех JS модулей в правильном порядке
- [ ] Переместить chart.min.js в `vendor/`

### Этап 5: Исправление зависимостей
- [ ] Проверить, что все модули имеют доступ к глобальным переменным
- [ ] Добавить `window.appState`, `window.TRANSLATIONS`, etc. где нужно
- [ ] Убедиться, что функции вызываются в правильном порядке

### Этап 6: Тестирование
- [ ] Открыть `index.html` в браузере
- [ ] Проверить, что стили применяются
- [ ] Проверить, что UI работает (табы, формы, редактор параметров)
- [ ] Проверить генерацию данных
- [ ] Проверить визуализацию (charts, hex viewer)
- [ ] Проверить скачивание файлов

### Этап 7: Очистка
- [ ] Удалить старый `IRIG 106 Payload Generator.html`
- [ ] Обновить README.md с инструкциями по запуску
- [ ] Закоммитить изменения

---

## Проблемы, которые нужно решить

### 1. Глобальные переменные
- `appState` используется во всех функциях
- `VERSION`, `TRANSLATIONS`, `currentLanguage` нужны глобально
- `appState.charts` для Chart.js

**Решение:** Оставить ключевые переменные глобальными (на window) для простоты

### 2. Порядок загрузки скриптов
Модули должны загружаться в правильном порядке:
1. constants.js (VERSION, TRANSLATIONS)
2. state.js (appState)
3. bitwriter.js (класс для кодирования)
4. formulas.js (computeValue для generation.js)
5. encoding.js (encodeRecursive для generation.js)
6. generation.js (основная логика)
7. loopback.js (decode функции)
8. initialization.js (дефолтные параметры)
9. ui.js (UI функции)
10. parameter-editor.js (редактор)
11. visualization.js (charts, hex viewer)
12. tmats.js (TMATS генерация)
13. download.js (скачивание)
14. main.js (entry point, event listeners)

### 3. Event listeners
Некоторые event listeners создаются в разных функциях.
**Решение:** Собрать все event listeners в `main.js`

### 4. Chart.js
Требуется Chart.js библиотека.
**Решение:** Переместить существующий `chart.min.js` в `vendor/`

---

## Прогресс выполнения

### Этап 1: Создание структуры папок
- [x] Создать папки: `css/`, `js/`, `vendor/`

### Этап 2: Извлечение CSS
- [x] Извлечь строки 8-634 в `css/styles.css`
- [ ] Убрать теги `<style>` и `</style>`
- [ ] Проверить, что CSS корректен

### Этап 3: Извлечение JS модулей
- [x] Извлечь `js/constants.js` (lines 3204-3670)
- [ ] Извлечь `js/state.js` (lines 3743-3760)
- [ ] Извлечь `js/initialization.js` (lines 3765-3930)
- [ ] Извлечь `js/formulas.js` (найти точные границы)
- [ ] Извлечь `js/ui.js` (lines 3932-4074)
- [ ] Извлечь `js/parameter-editor.js` (lines 4075-4313)
- [ ] Извлечь `js/bitwriter.js` (lines 4513-4573)
- [ ] Извлечь `js/encoding.js` (lines 4574-4715)
- [ ] Извлечь `js/generation.js` (lines 4437-4715, excluding BitWriter)
- [ ] Извлечь `js/loopback.js` (найти точные границы)
- [ ] Извлечь `js/visualization.js` (lines 4472-5152)
- [ ] Извлечь `js/tmats.js` (lines 5232-5442)
- [ ] Извлечь `js/download.js` (найти точные границы)
- [ ] Извлечь `js/main.js` (create entry point)

### Этап 4: Создание нового HTML
- [ ] Создать `index.html` на основе старого (lines 635-3203)
- [ ] Убрать весь JavaScript из `<script>` тега
- [ ] Добавить `<link rel="stylesheet" href="css/styles.css">` в `<head>`
- [ ] Добавить `<script>` теги для всех JS модулей в правильном порядке
- [ ] Переместить chart.min.js в `vendor/`

### Этап 5: Исправление зависимостей
- [ ] Проверить, что все модули имеют доступ к глобальным переменным
- [ ] Добавить `window.appState`, `window.TRANSLATIONS`, etc. где нужно
- [ ] Убедиться, что функции вызываются в правильном порядке

### Этап 6: Тестирование
- [ ] Открыть `index.html` в браузере
- [ ] Проверить, что стили применяются
- [ ] Проверить, что UI работает (табы, формы, редактор параметров)
- [ ] Проверить генерацию данных
- [ ] Проверить визуализацию (charts, hex viewer)
- [ ] Проверить скачивание файлов

### Этап 7: Очистка
- [ ] Удалить старый `IRIG 106 Payload Generator.html`
- [ ] Обновить README.md с инструкциями по запуску
- [ ] Закоммитить изменения

---

## Время выполнения

- **Начало:** 2026-02-01
- **Прогнозируемое завершение:** ~30-45 минут
- **Текущий статус:** Этап 2 завершен, начинаем Этап 3
