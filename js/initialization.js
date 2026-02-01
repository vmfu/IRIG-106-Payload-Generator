         window.initializeDefaults = function() {
            // === ПРИМЕР: ТЕЛЕМЕТРИЯ РАКЕТЫ-НОСИТЕЛЯ "MARS-MISSION-1" ===
            // Структура кадра соответствует IRIG 106 Class II
            appState.parameters = [
                // 1. СИНХРОНИЗАЦИЯ И ВРЕМЯ
                { 
                    id: 'SYNC_PATTERN_1', desc: 'Маркер начала кадра (0xEB90)', type: 'UB', bits: 16, 
                    units: 'hex', min: 60304, max: 60304, behavior: 'frozen', freq: 0, noise: 0 
                },
                { 
                    id: 'SYNC_PATTERN_2', desc: 'Маркер начала кадра (0xEB90)', type: 'UB', bits: 16, 
                    units: 'hex', min: 60304, max: 60304, behavior: 'frozen', freq: 0, noise: 0 
                },
                { 
                    id: 'MISSION_TIME', desc: 'Бортовое время (мкс с старта)', type: 'TIME_CODE', bits: 48, 
                    units: 'us', min: 0, max: 100000, behavior: 'time', freq: 1, noise: 0 
                },
                { 
                    id: 'FRAME_COUNTER', desc: 'Счетчик малых кадров (Minor Frame)', type: 'UB', bits: 16, 
                    units: 'cnt', min: 0, max: 65535, behavior: 'counter', freq: 1, noise: 0 
                },

                // 2. БОРТОВОЙ КОМПЬЮТЕР (MIL-STD-1750A)
                { 
                    id: 'OBC_ALIVE_CNT', desc: 'Heartbeat БЦВМ', type: 'UB', bits: 8, 
                    units: 'cnt', min: 0, max: 255, behavior: 'counter', freq: 1, noise: 0 
                },
                { 
                    id: 'GUIDANCE_MODE', desc: 'Режим наведения (0-Safe, 1-Launch, 2-Orbit)', type: 'DISCRETE', bits: 8, 
                    units: 'enum', min: 0, max: 5, behavior: 'ramp', freq: 0.01, noise: 0 
                },
                { 
                    id: 'TARGET_ALTITUDE', desc: 'Целевая орбита (MIL-STD-1750A)', type: 'MIL1750A', bits: 32, 
                    units: 'km', min: 200, max: 200, behavior: 'frozen', freq: 0, noise: 0 
                },

                // 3. ДИНАМИКА ПОЛЕТА (Взаимосвязанные параметры)
                // t - время симуляции. Симулируем разгон.
                { 
                    id: 'FLIGHT_TIME', desc: 'Время полета (t)', type: 'IEEE754', bits: 32, 
                    units: 's', min: 0, max: 1000, behavior: 'time', freq: 1, noise: 0 
                },
                { 
                    id: 'ROCKET_ALTITUDE', desc: 'Высота (H = 0.5 * a * t^2)', type: 'DOUBLE', bits: 64, 
                    units: 'm', min: 0, max: 200000, 
                    behavior: 'formula', formula: '0.5 * 40 * Math.pow(t, 2)', 
                    dependsOn: ['FLIGHT_TIME'], freq: 0, noise: 0 
                },
                { 
                    id: 'ROCKET_VELOCITY', desc: 'Скорость (V = a * t)', type: 'IEEE754', bits: 32, 
                    units: 'm/s', min: 0, max: 8000, 
                    behavior: 'formula', formula: '40 * t', 
                    dependsOn: ['FLIGHT_TIME'], freq: 0, noise: 0 
                },
                { 
                    id: 'DYNAMIC_PRESSURE', desc: 'Скоростной напор (Q = 0.5 * rho * V^2)', type: 'IEEE754', bits: 32, 
                    units: 'kPa', min: 0, max: 50, 
                    behavior: 'formula', formula: '0.5 * 1.225 * Math.exp(-p.ROCKET_ALTITUDE/10000) * Math.pow(p.ROCKET_VELOCITY, 2) / 1000', 
                    dependsOn: ['ROCKET_ALTITUDE', 'ROCKET_VELOCITY'], freq: 0, noise: 0 
                },

                // 4. ДВИГАТЕЛЬНАЯ УСТАНОВКА (Быстрые параметры)
                { 
                    id: 'CHAMBER_PRESSURE_1', desc: 'Давление в камере сгорания #1', type: 'IEEE754', bits: 32, 
                    units: 'bar', min: 240, max: 260, behavior: 'sine', freq: 50.0, noise: 2.5 
                },
                { 
                    id: 'TURBOPUMP_RPM', desc: 'Обороты ТНА', type: 'UB', bits: 16, 
                    units: 'rpm', min: 12000, max: 35000, behavior: 'ramp', freq: 0.05, noise: 100 
                },

                // 5. СУБКОММУТАТОР СИСТЕМ ЖИЗНЕОБЕСПЕЧЕНИЯ (Медленные данные)
                // Глубина 8 кадров. Идентификатор ID субкадра обязателен.
                { 
                    id: 'SUBCOM_ID_CNT', desc: 'Счетчик субкадра (0-8)', type: 'UB', bits: 16, 
                    units: 'idx', min: 0, max: 8, behavior: 'counter', freq: 1, noise: 0 
                },
                {
                    id: 'SUBCOM_CONTAINER', desc: 'Медленные параметры (Subcom 1:8)', type: 'CONTAINER', bits: 16, // Биты контейнера условны
                    min: 0, max: 0, behavior: 'subcommutated', freq: 1, noise: 0,
                    subParams: [
                        { id: 'BATTERY_VOLTAGE_A', desc: 'Напряжение Бат А (Кадр 0)', type: 'UB', bits: 16, units: 'dV', min: 270, max: 290, behavior: 'sine', freq: 0.1, noise: 1 },
                        { id: 'BATTERY_VOLTAGE_B', desc: 'Напряжение Бат Б (Кадр 1)', type: 'UB', bits: 16, units: 'dV', min: 270, max: 290, behavior: 'sine', freq: 0.1, noise: 1 },
                        { id: 'TANK_FUEL_TEMP', desc: 'Температура горючего (Кадр 2)', type: 'SB', bits: 16, units: 'degC', min: -180, max: -170, behavior: 'random', freq: 1, noise: 0.5 },
                        { id: 'TANK_OX_TEMP', desc: 'Температура окислителя (Кадр 3)', type: 'SB', bits: 16, units: 'degC', min: -190, max: -180, behavior: 'random', freq: 1, noise: 0.5 },
                        { id: 'IMU_TEMP_X', desc: 'Температура ГИРО X (Кадр 4)', type: 'UB', bits: 16, units: 'C', min: 30, max: 35, behavior: 'sine', freq: 0.01, noise: 0.1 },
                        
                        // 6. ГЛУБОКИЙ СУБКОММУТАТОР (Вложенный)
                        // В слоте 5 основного субкоммутатора находится еще один субкоммутатор (Sub-Subcom)
                        { 
                    id: 'DEEP_SUBCOM_ID_CNT', desc: 'Счетчик суб-субкадра (0-3)', type: 'UB', bits: 16, 
                    units: 'idx', min: 0, max: 3, behavior: 'counter', freq: 1, noise: 0 
                },
						{ 
                            id: 'DEEP_SUBCOM_CONTAINER', desc: 'Диагностика (Sub-Subcom 1:4)', type: 'CONTAINER', bits: 16,
                            min: 0, max: 0, behavior: 'subcommutated', freq: 1, noise: 0,
                            subParams: [
                                { id: 'VALVE_1_POS', desc: 'Клапан 1 (Deep 0)', type: 'UB', bits: 16, units: '%', min: 0, max: 100, behavior: 'ramp', freq: 0.2 },
                                { id: 'VALVE_2_POS', desc: 'Клапан 2 (Deep 1)', type: 'UB', bits: 16, units: '%', min: 0, max: 100, behavior: 'ramp', freq: 0.2 },
                                { id: 'VALVE_3_POS', desc: 'Клапан 3 (Deep 2)', type: 'UB', bits: 16, units: '%', min: 0, max: 100, behavior: 'ramp', freq: 0.2 },
                                { id: 'VALVE_4_POS', desc: 'Клапан 4 (Deep 3)', type: 'UB', bits: 16, units: '%', min: 0, max: 100, behavior: 'ramp', freq: 0.2 }
                            ]
                        },
                        
                        { id: 'RESERVED_SLOT_6', desc: 'Резерв (Кадр 6)', type: 'UB', bits: 16, units: '-', min: 0, max: 0, behavior: 'frozen', freq: 0, noise: 0 },
                        { id: 'CHECKSUM_SUB', desc: 'К/С Субкадра (Кадр 7)', type: 'UB', bits: 16, units: 'crc', min: 0, max: 65535, behavior: 'random', freq: 1, noise: 0 }
                    ]
                },

                // 7. НАВИГАЦИЯ (GPS)
                { 
                    id: 'GPS_LAT', desc: 'Широта (WGS84)', type: 'DOUBLE', bits: 64, 
                    units: 'deg', min: 45.9, max: 46.1, behavior: 'sine', freq: 0.001, noise: 0 
                },
                { 
                    id: 'GPS_LON', desc: 'Долгота (WGS84)', type: 'DOUBLE', bits: 64, 
                    units: 'deg', min: 63.3, max: 63.5, behavior: 'sine', freq: 0.001, noise: 0 
                }
            ];
            updateParametersTable();
        }



        window.resetToDefaults = function() {
            if (confirm('Вы уверены? Все текущие параметры будут удалены.')) {
                initializeDefaults();
            }
        }

        // ===== PARAMETERS TABLE =====
        // === НОВАЯ ЛОГИКА UI: MASTER-DETAIL ===

        function updateParametersTable() {
