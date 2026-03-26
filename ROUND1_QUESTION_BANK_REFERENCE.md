# Round 1 Question Bank Reference

This file is generated from the curated bank and is used as the event reference source.

## Structure

- MCQ pool: 50 Easy + 50 Hard
- Scenario pool: 10 scenarios x 5 questions each
- Connection-evaluation: 10 offline-evaluated questions
- Basic snippet coding: 10 reverse-connection coding questions
- Assignment per participant: 10 Easy MCQ + 10 Hard MCQ + 2 random scenarios (10 Q) + 2 connection questions + 2 snippet coding questions

## Easy MCQ (50)

### E1. GPIO Direction
- Question: In Arduino, what does pinMode(pin, OUTPUT) do?
- A. Sets the pin to read analog voltage
- B. Sets the pin to produce a digital signal
- C. Disables interrupts globally
- D. Configures UART baud rate
- Correct: B

### E2. ADC Width
- Question: On Arduino Uno, analogRead() usually returns values in which range?
- A. 0 to 255
- B. 0 to 1023
- C. 0 to 2047
- D. 0 to 4095
- Correct: B

### E3. PWM Meaning
- Question: PWM is mainly used in embedded systems to:
- A. Encrypt serial traffic
- B. Approximate analog output using duty cycle
- C. Increase CPU clock speed
- D. Store data in EEPROM
- Correct: B

### E4. Pull-up Resistor
- Question: INPUT_PULLUP on Arduino is commonly used to:
- A. Increase ADC precision
- B. Keep a digital input from floating
- C. Improve Wi-Fi range
- D. Enable hardware PWM
- Correct: B

### E5. I2C Wires
- Question: The two primary I2C signal lines are:
- A. TX and RX
- B. MOSI and MISO
- C. SDA and SCL
- D. CS and CLK
- Correct: C

### E6. SPI Role
- Question: In SPI communication, CS pin is used to:
- A. Control ADC reference level
- B. Select which slave device is active
- C. Reset the microcontroller
- D. Switch from 3.3V to 5V
- Correct: B

### E7. UART Basics
- Question: UART communication typically uses which pair?
- A. SDA/SCL
- B. TX/RX
- C. MISO/MOSI
- D. AIN+/AIN-
- Correct: B

### E8. LDR Behavior
- Question: For a typical LDR, resistance generally:
- A. Increases when light increases
- B. Decreases when light increases
- C. Stays constant with light changes
- D. Becomes negative in darkness
- Correct: B

### E9. DHT Sensor
- Question: DHT11/DHT22 sensors are used to measure:
- A. Distance and velocity
- B. Temperature and humidity
- C. Voltage and current
- D. Pressure and altitude only
- Correct: B

### E10. Ultrasonic Timing
- Question: HC-SR04 distance is computed from:
- A. Current consumption of trigger pin
- B. Echo pulse duration
- C. Ambient light level
- D. CPU clock cycles only
- Correct: B

### E11. Servo Control
- Question: Standard hobby servo position is commonly controlled using:
- A. I2C packet count
- B. PWM pulse width
- C. ADC resolution bits
- D. CAN arbitration ID
- Correct: B

### E12. Relay Purpose
- Question: A relay module in IoT prototypes is mainly used to:
- A. Amplify analog sensor voltage
- B. Switch higher-voltage/current loads
- C. Convert AC to DC automatically
- D. Measure humidity
- Correct: B

### E13. Debounce
- Question: Button debounce is required because mechanical switches:
- A. Have floating-point rounding errors
- B. Create rapid transient toggles when pressed
- C. Need analog calibration daily
- D. Lose EEPROM content
- Correct: B

### E14. Watchdog
- Question: A watchdog timer helps by:
- A. Generating PWM on extra channels
- B. Resetting the MCU if firmware hangs
- C. Increasing RAM size
- D. Encrypting BLE packets
- Correct: B

### E15. Raspberry Pi Type
- Question: Raspberry Pi is best described as a:
- A. Bare-metal sensor only
- B. Single board computer
- C. Only a bootloader chip
- D. Simple analog comparator
- Correct: B

### E16. GPIO Voltage
- Question: Most Raspberry Pi GPIO pins are logic-level:
- A. 1.8V
- B. 3.3V
- C. 5V tolerant always
- D. 12V industrial
- Correct: B

### E17. MQTT Pattern
- Question: MQTT primarily follows which communication model?
- A. Peer-to-peer block exchange
- B. Publish/Subscribe through broker
- C. Master-only serial polling
- D. Token ring bus
- Correct: B

### E18. Topic in MQTT
- Question: In MQTT, a topic is:
- A. A battery chemistry type
- B. A routing string for messages
- C. A firmware checksum
- D. An analog pin alias
- Correct: B

### E19. QoS 0
- Question: MQTT QoS 0 means:
- A. Exactly once delivery
- B. At least once delivery
- C. Best effort delivery
- D. Encrypted delivery
- Correct: C

### E20. Wi-Fi Module
- Question: ESP32 is popular in IoT because it has built-in:
- A. GPU tensor cores
- B. Wi-Fi and Bluetooth
- C. 48V PoE injector
- D. Industrial PLC ladder runtime
- Correct: B

### E21. HTTP Method
- Question: To send sensor data to REST API, the common method is:
- A. TRACE
- B. POST
- C. OPTIONS only
- D. HEAD only
- Correct: B

### E22. JSON Role
- Question: JSON in IoT cloud communication is typically used for:
- A. Power conversion
- B. Data serialization
- C. Noise filtering
- D. PWM generation
- Correct: B

### E23. Breadboard Rails
- Question: On a standard breadboard, side rails are usually for:
- A. Clock synthesis
- B. Power distribution
- C. SPI framing
- D. EEPROM addressing
- Correct: B

### E24. Diode Protection
- Question: A flyback diode is used with DC motors to:
- A. Increase rotation speed
- B. Suppress back EMF spikes
- C. Reduce UART latency
- D. Boost battery capacity
- Correct: B

### E25. Buzzer Use
- Question: Piezo buzzer in embedded projects is generally an:
- A. Input sensor
- B. Audio output actuator
- C. Protocol converter
- D. Storage element
- Correct: B

### E26. Temperature Sensor
- Question: LM35 output is generally proportional to:
- A. Humidity
- B. Temperature
- C. Distance
- D. Pressure
- Correct: B

### E27. Potentiometer
- Question: A potentiometer used with analogRead acts as:
- A. Current source
- B. Variable voltage divider
- C. Digital encoder
- D. RF transmitter
- Correct: B

### E28. Serial Monitor
- Question: Serial.begin(9600) sets:
- A. ADC resolution
- B. UART baud rate
- C. I2C address
- D. PWM duty cycle
- Correct: B

### E29. Raspberry Pi OS
- Question: Raspberry Pi typically runs:
- A. Bare C only
- B. Linux-based OS
- C. Only Arduino sketch format
- D. No operating system support
- Correct: B

### E30. Node-RED
- Question: Node-RED is commonly used to:
- A. Solder PCB layers
- B. Create visual IoT workflows
- C. Fabricate sensors
- D. Program FPGA bitstreams only
- Correct: B

### E31. BLE Full Form
- Question: BLE stands for:
- A. Binary Logic Engine
- B. Bluetooth Low Energy
- C. Bus Line Encoder
- D. Basic Link Ethernet
- Correct: B

### E32. Actuator Example
- Question: Which is an actuator?
- A. LDR
- B. Ultrasonic sensor
- C. Servo motor
- D. Thermistor
- Correct: C

### E33. Sensor Example
- Question: Which is a sensor?
- A. Relay
- B. DHT22
- C. Buzzer
- D. LED
- Correct: B

### E34. Digital Read Values
- Question: digitalRead() returns:
- A. Only floating values
- B. HIGH or LOW
- C. 0 to 1023
- D. Signed 16-bit value always
- Correct: B

### E35. Loop Function
- Question: In Arduino, loop() function:
- A. Runs once after reset
- B. Runs repeatedly after setup()
- C. Only runs on interrupt
- D. Runs only in debug mode
- Correct: B

### E36. Setup Function
- Question: In Arduino, setup() is mainly for:
- A. Repeated sensing forever
- B. One-time initialization
- C. Automatic cloud upload
- D. Compiling sketches at runtime
- Correct: B

### E37. I2C Pullups
- Question: I2C lines usually require:
- A. Series capacitors only
- B. Pull-up resistors
- C. H-bridge drivers
- D. Optocouplers always
- Correct: B

### E38. GPIO Expander
- Question: GPIO expander is used when:
- A. Need more digital pins than MCU has
- B. Need faster ADC conversion
- C. Need camera ISP
- D. Need LTE modem
- Correct: A

### E39. Cloud Dashboard
- Question: IoT dashboard mainly helps to:
- A. Manufacture PCBs
- B. Visualize and monitor telemetry
- C. Increase battery voltage
- D. Generate C compiler binaries
- Correct: B

### E40. OTA Meaning
- Question: OTA firmware update means:
- A. Over-the-air update
- B. Only terminal access
- C. Offline timing adjustment
- D. Output threshold averaging
- Correct: A

### E41. Ground Reference
- Question: In mixed modules, common GND is required to:
- A. Increase Wi-Fi range
- B. Share voltage reference between modules
- C. Reduce flash memory use
- D. Enable PWM on all pins
- Correct: B

### E42. NVIDIA SBC Example
- Question: Which board is a GPU-capable SBC often used for edge AI?
- A. Arduino Nano
- B. Jetson Nano
- C. ATmega328P DIP chip
- D. L293D motor driver
- Correct: B

### E43. Edge AI
- Question: Edge AI means running inference:
- A. Only in remote cloud
- B. On or near the device
- C. Inside battery charger
- D. Inside USB cable
- Correct: B

### E44. I2C Address
- Question: If two I2C devices have same fixed address, common workaround is:
- A. Increase baud rate
- B. Use I2C multiplexer
- C. Switch to pull-down resistors
- D. Disable ACK
- Correct: B

### E45. Sampling Rate
- Question: Sampling rate of a sensor defines:
- A. Power supply polarity
- B. How often data is measured
- C. Pin mode direction
- D. Packet encryption key size
- Correct: B

### E46. Latency
- Question: In IoT systems, latency refers to:
- A. Battery weight
- B. Delay between event and response
- C. ADC pin count
- D. Wire gauge thickness
- Correct: B

### E47. Threshold Alert
- Question: A threshold-based alert triggers when:
- A. Data equals zero always
- B. Measurement crosses configured limit
- C. MCU enters sleep mode
- D. UART parity is odd
- Correct: B

### E48. Raspberry Pi Camera
- Question: Raspberry Pi camera module is typically connected through:
- A. CSI interface
- B. PWM pin
- C. I2C only
- D. CAN bus only
- Correct: A

### E49. Basic RTOS Use
- Question: A small RTOS helps embedded apps by:
- A. Adding deterministic task scheduling
- B. Increasing analog voltage
- C. Replacing sensors
- D. Disabling interrupts permanently
- Correct: A

### E50. EEPROM Usage
- Question: EEPROM is commonly used to store:
- A. Temporary RAM stack
- B. Persistent configuration values
- C. Live camera frames
- D. Analog waveform output
- Correct: B

## Hard MCQ (50)

### H1. Applied 1: GPIO Direction
- Question: Practical check: In Arduino, what does pinMode(pin, OUTPUT) do?
- A. Sets the pin to read analog voltage
- B. Sets the pin to produce a digital signal
- C. Disables interrupts globally
- D. Configures UART baud rate
- Correct: B

### H2. Applied 2: ADC Width
- Question: Practical check: On Arduino Uno, analogRead() usually returns values in which range?
- A. 0 to 255
- B. 0 to 1023
- C. 0 to 2047
- D. 0 to 4095
- Correct: B

### H3. Applied 3: PWM Meaning
- Question: Practical check: PWM is mainly used in embedded systems to:
- A. Encrypt serial traffic
- B. Approximate analog output using duty cycle
- C. Increase CPU clock speed
- D. Store data in EEPROM
- Correct: B

### H4. Applied 4: Pull-up Resistor
- Question: Practical check: INPUT_PULLUP on Arduino is commonly used to:
- A. Increase ADC precision
- B. Keep a digital input from floating
- C. Improve Wi-Fi range
- D. Enable hardware PWM
- Correct: B

### H5. Applied 5: I2C Wires
- Question: Practical check: The two primary I2C signal lines are:
- A. TX and RX
- B. MOSI and MISO
- C. SDA and SCL
- D. CS and CLK
- Correct: C

### H6. Applied 6: SPI Role
- Question: Practical check: In SPI communication, CS pin is used to:
- A. Control ADC reference level
- B. Select which slave device is active
- C. Reset the microcontroller
- D. Switch from 3.3V to 5V
- Correct: B

### H7. Applied 7: UART Basics
- Question: Practical check: UART communication typically uses which pair?
- A. SDA/SCL
- B. TX/RX
- C. MISO/MOSI
- D. AIN+/AIN-
- Correct: B

### H8. Applied 8: LDR Behavior
- Question: Practical check: For a typical LDR, resistance generally:
- A. Increases when light increases
- B. Decreases when light increases
- C. Stays constant with light changes
- D. Becomes negative in darkness
- Correct: B

### H9. Applied 9: DHT Sensor
- Question: Practical check: DHT11/DHT22 sensors are used to measure:
- A. Distance and velocity
- B. Temperature and humidity
- C. Voltage and current
- D. Pressure and altitude only
- Correct: B

### H10. Applied 10: Ultrasonic Timing
- Question: Practical check: HC-SR04 distance is computed from:
- A. Current consumption of trigger pin
- B. Echo pulse duration
- C. Ambient light level
- D. CPU clock cycles only
- Correct: B

### H11. Applied 11: Servo Control
- Question: Practical check: Standard hobby servo position is commonly controlled using:
- A. I2C packet count
- B. PWM pulse width
- C. ADC resolution bits
- D. CAN arbitration ID
- Correct: B

### H12. Applied 12: Relay Purpose
- Question: Practical check: A relay module in IoT prototypes is mainly used to:
- A. Amplify analog sensor voltage
- B. Switch higher-voltage/current loads
- C. Convert AC to DC automatically
- D. Measure humidity
- Correct: B

### H13. Applied 13: Debounce
- Question: Practical check: Button debounce is required because mechanical switches:
- A. Have floating-point rounding errors
- B. Create rapid transient toggles when pressed
- C. Need analog calibration daily
- D. Lose EEPROM content
- Correct: B

### H14. Applied 14: Watchdog
- Question: Practical check: A watchdog timer helps by:
- A. Generating PWM on extra channels
- B. Resetting the MCU if firmware hangs
- C. Increasing RAM size
- D. Encrypting BLE packets
- Correct: B

### H15. Applied 15: Raspberry Pi Type
- Question: Practical check: Raspberry Pi is best described as a:
- A. Bare-metal sensor only
- B. Single board computer
- C. Only a bootloader chip
- D. Simple analog comparator
- Correct: B

### H16. Applied 16: GPIO Voltage
- Question: Practical check: Most Raspberry Pi GPIO pins are logic-level:
- A. 1.8V
- B. 3.3V
- C. 5V tolerant always
- D. 12V industrial
- Correct: B

### H17. Applied 17: MQTT Pattern
- Question: Practical check: MQTT primarily follows which communication model?
- A. Peer-to-peer block exchange
- B. Publish/Subscribe through broker
- C. Master-only serial polling
- D. Token ring bus
- Correct: B

### H18. Applied 18: Topic in MQTT
- Question: Practical check: In MQTT, a topic is:
- A. A battery chemistry type
- B. A routing string for messages
- C. A firmware checksum
- D. An analog pin alias
- Correct: B

### H19. Applied 19: QoS 0
- Question: Practical check: MQTT QoS 0 means:
- A. Exactly once delivery
- B. At least once delivery
- C. Best effort delivery
- D. Encrypted delivery
- Correct: C

### H20. Applied 20: Wi-Fi Module
- Question: Practical check: ESP32 is popular in IoT because it has built-in:
- A. GPU tensor cores
- B. Wi-Fi and Bluetooth
- C. 48V PoE injector
- D. Industrial PLC ladder runtime
- Correct: B

### H21. Applied 21: HTTP Method
- Question: Practical check: To send sensor data to REST API, the common method is:
- A. TRACE
- B. POST
- C. OPTIONS only
- D. HEAD only
- Correct: B

### H22. Applied 22: JSON Role
- Question: Practical check: JSON in IoT cloud communication is typically used for:
- A. Power conversion
- B. Data serialization
- C. Noise filtering
- D. PWM generation
- Correct: B

### H23. Applied 23: Breadboard Rails
- Question: Practical check: On a standard breadboard, side rails are usually for:
- A. Clock synthesis
- B. Power distribution
- C. SPI framing
- D. EEPROM addressing
- Correct: B

### H24. Applied 24: Diode Protection
- Question: Practical check: A flyback diode is used with DC motors to:
- A. Increase rotation speed
- B. Suppress back EMF spikes
- C. Reduce UART latency
- D. Boost battery capacity
- Correct: B

### H25. Applied 25: Buzzer Use
- Question: Practical check: Piezo buzzer in embedded projects is generally an:
- A. Input sensor
- B. Audio output actuator
- C. Protocol converter
- D. Storage element
- Correct: B

### H26. Applied 26: Temperature Sensor
- Question: Practical check: LM35 output is generally proportional to:
- A. Humidity
- B. Temperature
- C. Distance
- D. Pressure
- Correct: B

### H27. Applied 27: Potentiometer
- Question: Practical check: A potentiometer used with analogRead acts as:
- A. Current source
- B. Variable voltage divider
- C. Digital encoder
- D. RF transmitter
- Correct: B

### H28. Applied 28: Serial Monitor
- Question: Practical check: Serial.begin(9600) sets:
- A. ADC resolution
- B. UART baud rate
- C. I2C address
- D. PWM duty cycle
- Correct: B

### H29. Applied 29: Raspberry Pi OS
- Question: Practical check: Raspberry Pi typically runs:
- A. Bare C only
- B. Linux-based OS
- C. Only Arduino sketch format
- D. No operating system support
- Correct: B

### H30. Applied 30: Node-RED
- Question: Practical check: Node-RED is commonly used to:
- A. Solder PCB layers
- B. Create visual IoT workflows
- C. Fabricate sensors
- D. Program FPGA bitstreams only
- Correct: B

### H31. Applied 31: BLE Full Form
- Question: Practical check: BLE stands for:
- A. Binary Logic Engine
- B. Bluetooth Low Energy
- C. Bus Line Encoder
- D. Basic Link Ethernet
- Correct: B

### H32. Applied 32: Actuator Example
- Question: Practical check: Which is an actuator?
- A. LDR
- B. Ultrasonic sensor
- C. Servo motor
- D. Thermistor
- Correct: C

### H33. Applied 33: Sensor Example
- Question: Practical check: Which is a sensor?
- A. Relay
- B. DHT22
- C. Buzzer
- D. LED
- Correct: B

### H34. Applied 34: Digital Read Values
- Question: Practical check: digitalRead() returns:
- A. Only floating values
- B. HIGH or LOW
- C. 0 to 1023
- D. Signed 16-bit value always
- Correct: B

### H35. Applied 35: Loop Function
- Question: Practical check: In Arduino, loop() function:
- A. Runs once after reset
- B. Runs repeatedly after setup()
- C. Only runs on interrupt
- D. Runs only in debug mode
- Correct: B

### H36. Applied 36: Setup Function
- Question: Practical check: In Arduino, setup() is mainly for:
- A. Repeated sensing forever
- B. One-time initialization
- C. Automatic cloud upload
- D. Compiling sketches at runtime
- Correct: B

### H37. Applied 37: I2C Pullups
- Question: Practical check: I2C lines usually require:
- A. Series capacitors only
- B. Pull-up resistors
- C. H-bridge drivers
- D. Optocouplers always
- Correct: B

### H38. Applied 38: GPIO Expander
- Question: Practical check: GPIO expander is used when:
- A. Need more digital pins than MCU has
- B. Need faster ADC conversion
- C. Need camera ISP
- D. Need LTE modem
- Correct: A

### H39. Applied 39: Cloud Dashboard
- Question: Practical check: IoT dashboard mainly helps to:
- A. Manufacture PCBs
- B. Visualize and monitor telemetry
- C. Increase battery voltage
- D. Generate C compiler binaries
- Correct: B

### H40. Applied 40: OTA Meaning
- Question: Practical check: OTA firmware update means:
- A. Over-the-air update
- B. Only terminal access
- C. Offline timing adjustment
- D. Output threshold averaging
- Correct: A

### H41. Applied 41: Ground Reference
- Question: Practical check: In mixed modules, common GND is required to:
- A. Increase Wi-Fi range
- B. Share voltage reference between modules
- C. Reduce flash memory use
- D. Enable PWM on all pins
- Correct: B

### H42. Applied 42: NVIDIA SBC Example
- Question: Practical check: Which board is a GPU-capable SBC often used for edge AI?
- A. Arduino Nano
- B. Jetson Nano
- C. ATmega328P DIP chip
- D. L293D motor driver
- Correct: B

### H43. Applied 43: Edge AI
- Question: Practical check: Edge AI means running inference:
- A. Only in remote cloud
- B. On or near the device
- C. Inside battery charger
- D. Inside USB cable
- Correct: B

### H44. Applied 44: I2C Address
- Question: Practical check: If two I2C devices have same fixed address, common workaround is:
- A. Increase baud rate
- B. Use I2C multiplexer
- C. Switch to pull-down resistors
- D. Disable ACK
- Correct: B

### H45. Applied 45: Sampling Rate
- Question: Practical check: Sampling rate of a sensor defines:
- A. Power supply polarity
- B. How often data is measured
- C. Pin mode direction
- D. Packet encryption key size
- Correct: B

### H46. Applied 46: Latency
- Question: Practical check: In IoT systems, latency refers to:
- A. Battery weight
- B. Delay between event and response
- C. ADC pin count
- D. Wire gauge thickness
- Correct: B

### H47. Applied 47: Threshold Alert
- Question: Practical check: A threshold-based alert triggers when:
- A. Data equals zero always
- B. Measurement crosses configured limit
- C. MCU enters sleep mode
- D. UART parity is odd
- Correct: B

### H48. Applied 48: Raspberry Pi Camera
- Question: Practical check: Raspberry Pi camera module is typically connected through:
- A. CSI interface
- B. PWM pin
- C. I2C only
- D. CAN bus only
- Correct: A

### H49. Applied 49: Basic RTOS Use
- Question: Practical check: A small RTOS helps embedded apps by:
- A. Adding deterministic task scheduling
- B. Increasing analog voltage
- C. Replacing sensors
- D. Disabling interrupts permanently
- Correct: A

### H50. Applied 50: EEPROM Usage
- Question: Practical check: EEPROM is commonly used to store:
- A. Temporary RAM stack
- B. Persistent configuration values
- C. Live camera frames
- D. Analog waveform output
- Correct: B

## Scenario Bank (10 x 5)

### Scenario 1: Smart Greenhouse Control Failure
- Prompt: A greenhouse reports unstable crop environment. Temperature spikes, overwatering, and delayed fan actions are observed during afternoon load.

#### S1Q1
- Question: Which sensor pair should be prioritized for stabilization?
- A. Soil moisture + DHT22
- B. GPS + IMU
- C. LDR + Hall sensor only
- D. Ultrasonic + PIR
- Correct: A

#### S1Q2
- Question: Best control strategy to avoid relay chattering near threshold?
- A. Decrease relay voltage
- B. Add hysteresis and minimum on/off times
- C. Sample once per hour
- D. Disable feedback loop
- Correct: B

#### S1Q3
- Question: If cloud is delayed, what should edge controller do?
- A. Wait for cloud command only
- B. Apply local fallback rules safely
- C. Reset every minute
- D. Ignore sensor events
- Correct: B

#### S1Q4
- Question: Most suitable actuator for airflow regulation?
- A. Servo-driven vent or fan relay
- B. Piezo buzzer
- C. EEPROM
- D. I2C pull-up
- Correct: A

#### S1Q5
- Question: What is the best logging detail for diagnosis?
- A. Only final daily average
- B. Timestamped sensor, setpoint, and actuator state changes
- C. Only relay count
- D. Only manual notes
- Correct: B

### Scenario 2: Campus Smart Parking Congestion
- Prompt: A smart parking system shows wrong occupancy; students complain about false full status and delayed gate actions.

#### S2Q1
- Question: Most likely first technical issue to check?
- A. Sensor alignment/calibration at slots
- B. Wi-Fi SSID spelling
- C. Dashboard font choice
- D. Battery sticker
- Correct: A

#### S2Q2
- Question: Best way to reduce false positives from ultrasonic sensors?
- A. Randomly ignore every third reading
- B. Median filtering with confidence checks
- C. Lower MCU clock
- D. Disable retries
- Correct: B

#### S2Q3
- Question: For entry gate barrier, preferred actuator class is:
- A. Servo motor with limit logic
- B. Thermistor
- C. LDR only
- D. Buzzer only
- Correct: A

#### S2Q4
- Question: When broker disconnects briefly, occupancy events should:
- A. Be dropped permanently
- B. Be queued locally and replayed in order
- C. Overwrite all old slots
- D. Trigger factory reset
- Correct: B

#### S2Q5
- Question: What metric helps detect sensor degradation over weeks?
- A. Average packet color
- B. False detect rate per sensor
- C. Logo size
- D. USB version
- Correct: B

### Scenario 3: Hostel Water Tank Automation
- Prompt: An IoT water-tank system overflows at night and also runs pump dry in morning. Level sensing and control decisions are inconsistent.

#### S3Q1
- Question: Critical safety interlock to prevent dry run?
- A. Pump only with minimum level confirmation
- B. Increase LED brightness
- C. Use faster UART
- D. Disable watchdog
- Correct: A

#### S3Q2
- Question: Best sensor combination for reliability?
- A. Single noisy sensor only
- B. Primary level sensor + timeout/fault logic
- C. Only manual switch
- D. GPS sensor
- Correct: B

#### S3Q3
- Question: Overflow prevention should prioritize:
- A. Cloud approval every cycle
- B. Edge cutoff threshold with hysteresis
- C. Higher tank paint reflectivity
- D. Random delays
- Correct: B

#### S3Q4
- Question: Pump control component typically needs:
- A. Relay/contactor with isolation
- B. ADC only
- C. Capacitive touch only
- D. OLED only
- Correct: A

#### S3Q5
- Question: What event is most useful for audit?
- A. Every loop print only
- B. Pump ON/OFF with level snapshot and reason
- C. Only boot count
- D. Only Wi-Fi RSSI
- Correct: B

### Scenario 4: Medical Cold-Chain Transport
- Prompt: Temperature-sensitive vaccine boxes report random alarm spikes and occasional missed alerts during transport.

#### S4Q1
- Question: Which fault should be ruled out first?
- A. Sensor calibration drift
- B. Display theme mismatch
- C. SD card label
- D. USB cable color
- Correct: A

#### S4Q2
- Question: To avoid alarm storms, use:
- A. No threshold alerts
- B. Hysteresis + debounce windows
- C. Only daily summary
- D. Manual logging only
- Correct: B

#### S4Q3
- Question: If network drops, critical behavior is:
- A. Discard all events
- B. Local alarm + buffered telemetry upload
- C. Disable buzzer
- D. Reboot continuously
- Correct: B

#### S4Q4
- Question: Best payload field for postmortem analysis?
- A. Temperature, timestamp, device id, battery
- B. Only temperature
- C. Only packet id
- D. Only route name
- Correct: A

#### S4Q5
- Question: What can validate alarm reliability?
- A. Single one-time lab check
- B. Replay test traces with expected alert outcomes
- C. Change ringtone
- D. Reduce storage
- Correct: B

### Scenario 5: City Air-Quality Kiosk Drift
- Prompt: Roadside air-quality kiosks show inconsistent PM values between nearby locations and occasional spikes during rain.

#### S5Q1
- Question: Most practical first correction?
- A. Cross-calibrate with reference instrument
- B. Replace all displays
- C. Increase upload interval randomly
- D. Ignore rainy-day data
- Correct: A

#### S5Q2
- Question: Rain-related sudden spikes may suggest:
- A. Sensor chamber contamination/humidity effects
- B. Higher CPU frequency
- C. Correct calibration always
- D. Perfect network stability
- Correct: A

#### S5Q3
- Question: How should edge device report confidence?
- A. No quality metric
- B. Include quality flag and sensor diagnostics
- C. Only binary pass/fail
- D. Hide all metadata
- Correct: B

#### S5Q4
- Question: Best communication fallback?
- A. Delete local data on failure
- B. Store-and-forward with bounded queue
- C. Turn off sensor
- D. Keep retransmitting forever without delay
- Correct: B

#### S5Q5
- Question: Which actuator may be used in kiosk maintenance loop?
- A. Fan/valve for airflow control
- B. EEPROM
- C. Static resistor
- D. Antenna cable only
- Correct: A

### Scenario 6: Smart Classroom Energy Control
- Prompt: A classroom automation setup turns lights/fans on at wrong times. Occupancy and ambient thresholds are not coordinated.

#### S6Q1
- Question: Best occupancy sensor for basic motion detection?
- A. PIR sensor
- B. Potentiometer
- C. EEPROM
- D. Buck converter
- Correct: A

#### S6Q2
- Question: When combining occupancy and light, policy should be:
- A. OR everything blindly
- B. Rule-based state machine with timeout
- C. Only manual switch
- D. Disable sensor fusion
- Correct: B

#### S6Q3
- Question: To avoid rapid toggling due to doorway movement:
- A. Shorter timeout always
- B. Use hold timer and hysteresis
- C. Increase relay count
- D. Turn off logging
- Correct: B

#### S6Q4
- Question: Actuator for switching AC mains load is generally:
- A. Relay/SSR module
- B. ADC channel
- C. GPIO input
- D. Buzzer
- Correct: A

#### S6Q5
- Question: Most useful regression test here?
- A. UI screenshot only
- B. Replay occupancy/light event sequences against expected states
- C. Only power cycle test
- D. Only lint check
- Correct: B

### Scenario 7: Fleet IoT Tracking Delay
- Prompt: Delivery bikes send location and fuel telemetry, but admin maps lag by several minutes during peak hours.

#### S7Q1
- Question: First bottleneck to inspect?
- A. End-to-end queue and processing latency
- B. Bike color
- C. GPS antenna sticker
- D. Dashboard icon style
- Correct: A

#### S7Q2
- Question: To reduce payload overhead, prefer:
- A. Verbose nested logs per packet
- B. Compact schema and batching where safe
- C. Send duplicate copies always
- D. Disable timestamps
- Correct: B

#### S7Q3
- Question: If packets arrive out-of-order, backend should:
- A. Assume latest arrival is latest event
- B. Use event timestamps/sequence handling
- C. Drop all delayed packets blindly
- D. Reset database hourly
- Correct: B

#### S7Q4
- Question: Edge resilience under intermittent network requires:
- A. No cache
- B. Local buffer with retry backoff
- C. Only one retry fixed
- D. Permanent online assumption
- Correct: B

#### S7Q5
- Question: Security must include:
- A. Shared credentials for all bikes
- B. Per-device identity and token/cert rotation
- C. No auth in test mode forever
- D. Only IP filtering
- Correct: B

### Scenario 8: Factory Conveyor Monitoring
- Prompt: A conveyor monitoring system misses jam events and occasionally triggers false emergency stops.

#### S8Q1
- Question: Best sensor strategy for jam detection?
- A. Single threshold only
- B. Combine current + speed/position indicators
- C. Only camera frame count
- D. Only ambient temperature
- Correct: B

#### S8Q2
- Question: False emergency stops can be reduced by:
- A. Ignoring all transient anomalies
- B. Temporal confirmation and multi-signal validation
- C. Disabling emergency state
- D. Increasing motor speed
- Correct: B

#### S8Q3
- Question: What must happen when true jam is detected?
- A. Continue operation and log only
- B. Immediate safe stop with operator alert
- C. Wait for cloud approval first always
- D. Reboot PLC instantly
- Correct: B

#### S8Q4
- Question: For deterministic control timing, preferred base is:
- A. Non-deterministic polling only
- B. Periodic task schedule with bounded latency
- C. Random sleep intervals
- D. UI event loop
- Correct: B

#### S8Q5
- Question: Key audit field for safety compliance?
- A. Emergency stop reason and timestamp
- B. Theme mode
- C. Screen brightness
- D. Keyboard type
- Correct: A

### Scenario 9: Smart Streetlight Fault Isolation
- Prompt: Streetlights should dim at midnight and brighten on motion, but some poles stay bright all night.

#### S9Q1
- Question: First suspected issue for always-bright poles?
- A. Motion threshold misconfiguration/sensor noise
- B. Cloud logo mismatch
- C. Battery chemistry label
- D. UART parity
- Correct: A

#### S9Q2
- Question: Best dimming control output for LED drivers?
- A. PWM/0-10V control path
- B. EEPROM writes
- C. I2C pull-up alone
- D. Piezo frequency
- Correct: A

#### S9Q3
- Question: To verify schedule logic correctness:
- A. Manual one-time check only
- B. Simulate timeline with event playback
- C. Change timezone randomly
- D. Disable RTC
- Correct: B

#### S9Q4
- Question: If RTC drift affects schedule, fix is:
- A. Ignore drift
- B. Periodic time synchronization
- C. Increase LED current
- D. Lower ADC gain
- Correct: B

#### S9Q5
- Question: Power optimization target should prioritize:
- A. Maximum brightness always
- B. Adaptive dimming with occupancy confidence
- C. Disabling sensing
- D. Higher polling frequency only
- Correct: B

### Scenario 10: Wearable Health Monitor Reliability
- Prompt: A wearable sends heart-rate and motion alerts; users report false alerts during exercise and missed alerts at rest.

#### S10Q1
- Question: Most suitable improvement for signal quality?
- A. Increase alert threshold permanently
- B. Apply filtering and activity-aware thresholds
- C. Disable accelerometer
- D. Send no alerts
- Correct: B

#### S10Q2
- Question: Battery life and accuracy tradeoff is controlled by:
- A. Sampling duty cycle and model complexity
- B. LED color
- C. Screen wallpaper
- D. Clock source name
- Correct: A

#### S10Q3
- Question: In safety use-case, missed critical alert should trigger:
- A. No action
- B. Escalation path and fail-safe notification
- C. Only local log
- D. Silent retry for hours
- Correct: B

#### S10Q4
- Question: For edge inference on wearable/SBC companion, key budget is:
- A. Thermal, compute, and memory constraints
- B. Pin silkscreen font
- C. USB connector color
- D. Speaker size
- Correct: A

#### S10Q5
- Question: Validation dataset should include:
- A. Only resting data
- B. Rest, exercise, and noisy real-world sessions
- C. Only synthetic data
- D. Only one user
- Correct: B

## Connection Evaluation (10)

### C1. Connection Task 1: Smart Intrusion Alarm Wiring
- Question: Read the Arduino code and wire each module pin to the correct Arduino pin. This question is evaluated offline by graph-based connection validation.
- Code:
```cpp
#include <Servo.h>

const int PIR_PIN = 2;
const int BUZZER_PIN = 8;
const int LED_PIN = 7;
const int SERVO_PIN = 9;

Servo doorLock;

void setup() {
  pinMode(PIR_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  doorLock.attach(SERVO_PIN);
  doorLock.write(0);
}

void loop() {
  if (digitalRead(PIR_PIN) == HIGH) {
    digitalWrite(LED_PIN, HIGH);
    tone(BUZZER_PIN, 2000);
    doorLock.write(90);
    delay(1000);
  } else {
    noTone(BUZZER_PIN);
    digitalWrite(LED_PIN, LOW);
    doorLock.write(0);
  }
}
```

- Source nodes:
  - pir.out
  - buzzer.signal
  - led.anode
  - servo.signal
  - servo.vcc
  - pir.vcc
  - led.cathode
  - buzzer.gnd
  - pir.gnd
  - servo.gnd
- Target nodes:
  - arduino.d2
  - arduino.d8
  - arduino.d7
  - arduino.d9
  - arduino.5v
  - arduino.gnd
- Expected connections:
  - pir.out -> arduino.d2
  - buzzer.signal -> arduino.d8
  - led.anode -> arduino.d7
  - servo.signal -> arduino.d9
  - servo.vcc -> arduino.5v
  - pir.vcc -> arduino.5v
  - led.cathode -> arduino.gnd
  - buzzer.gnd -> arduino.gnd
  - pir.gnd -> arduino.gnd
  - servo.gnd -> arduino.gnd

### C2. Connection Task 2: Corridor Security Wiring
- Question: Wire the PIR, buzzer, LED, and servo to match the given code constants for this corridor security setup.
- Code:
```cpp
#include <Servo.h>

const int PIR_PIN = 7;
const int BUZZER_PIN = 8;
const int LED_PIN = 2;
const int SERVO_PIN = 9;

Servo doorLock;

void setup() {
  pinMode(PIR_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  doorLock.attach(SERVO_PIN);
  doorLock.write(0);
}

void loop() {
  if (digitalRead(PIR_PIN) == HIGH) {
    digitalWrite(LED_PIN, HIGH);
    tone(BUZZER_PIN, 2000);
    doorLock.write(90);
    delay(1000);
  } else {
    noTone(BUZZER_PIN);
    digitalWrite(LED_PIN, LOW);
    doorLock.write(0);
  }
}
```

- Source nodes:
  - pir.out
  - buzzer.signal
  - led.anode
  - servo.signal
  - servo.vcc
  - pir.vcc
  - led.cathode
  - buzzer.gnd
  - pir.gnd
  - servo.gnd
- Target nodes:
  - arduino.d2
  - arduino.d8
  - arduino.d7
  - arduino.d9
  - arduino.5v
  - arduino.gnd
- Expected connections:
  - pir.out -> arduino.d7
  - buzzer.signal -> arduino.d8
  - led.anode -> arduino.d2
  - servo.signal -> arduino.d9
  - servo.vcc -> arduino.5v
  - pir.vcc -> arduino.5v
  - led.cathode -> arduino.gnd
  - buzzer.gnd -> arduino.gnd
  - pir.gnd -> arduino.gnd
  - servo.gnd -> arduino.gnd

### C3. Connection Task 3: Lab Door Guard Wiring
- Question: Use the code pin assignments to complete the full module-to-Arduino wiring map.
- Code:
```cpp
#include <Servo.h>

const int PIR_PIN = 2;
const int BUZZER_PIN = 7;
const int LED_PIN = 8;
const int SERVO_PIN = 9;

Servo doorLock;

void setup() {
  pinMode(PIR_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  doorLock.attach(SERVO_PIN);
  doorLock.write(0);
}

void loop() {
  if (digitalRead(PIR_PIN) == HIGH) {
    digitalWrite(LED_PIN, HIGH);
    tone(BUZZER_PIN, 2000);
    doorLock.write(90);
    delay(1000);
  } else {
    noTone(BUZZER_PIN);
    digitalWrite(LED_PIN, LOW);
    doorLock.write(0);
  }
}
```

- Source nodes:
  - pir.out
  - buzzer.signal
  - led.anode
  - servo.signal
  - servo.vcc
  - pir.vcc
  - led.cathode
  - buzzer.gnd
  - pir.gnd
  - servo.gnd
- Target nodes:
  - arduino.d2
  - arduino.d8
  - arduino.d7
  - arduino.d9
  - arduino.5v
  - arduino.gnd
- Expected connections:
  - pir.out -> arduino.d2
  - buzzer.signal -> arduino.d7
  - led.anode -> arduino.d8
  - servo.signal -> arduino.d9
  - servo.vcc -> arduino.5v
  - pir.vcc -> arduino.5v
  - led.cathode -> arduino.gnd
  - buzzer.gnd -> arduino.gnd
  - pir.gnd -> arduino.gnd
  - servo.gnd -> arduino.gnd

### C4. Connection Task 4: Parking Gate Alert Wiring
- Question: Connect all signal, power, and ground lines correctly according to the sketch.
- Code:
```cpp
#include <Servo.h>

const int PIR_PIN = 8;
const int BUZZER_PIN = 2;
const int LED_PIN = 7;
const int SERVO_PIN = 9;

Servo doorLock;

void setup() {
  pinMode(PIR_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  doorLock.attach(SERVO_PIN);
  doorLock.write(0);
}

void loop() {
  if (digitalRead(PIR_PIN) == HIGH) {
    digitalWrite(LED_PIN, HIGH);
    tone(BUZZER_PIN, 2000);
    doorLock.write(90);
    delay(1000);
  } else {
    noTone(BUZZER_PIN);
    digitalWrite(LED_PIN, LOW);
    doorLock.write(0);
  }
}
```

- Source nodes:
  - pir.out
  - buzzer.signal
  - led.anode
  - servo.signal
  - servo.vcc
  - pir.vcc
  - led.cathode
  - buzzer.gnd
  - pir.gnd
  - servo.gnd
- Target nodes:
  - arduino.d2
  - arduino.d8
  - arduino.d7
  - arduino.d9
  - arduino.5v
  - arduino.gnd
- Expected connections:
  - pir.out -> arduino.d8
  - buzzer.signal -> arduino.d2
  - led.anode -> arduino.d7
  - servo.signal -> arduino.d9
  - servo.vcc -> arduino.5v
  - pir.vcc -> arduino.5v
  - led.cathode -> arduino.gnd
  - buzzer.gnd -> arduino.gnd
  - pir.gnd -> arduino.gnd
  - servo.gnd -> arduino.gnd

### C5. Connection Task 5: Hostel Entry Alarm Wiring
- Question: Complete the wiring based on this variation of the alarm logic pin constants.
- Code:
```cpp
#include <Servo.h>

const int PIR_PIN = 7;
const int BUZZER_PIN = 2;
const int LED_PIN = 8;
const int SERVO_PIN = 9;

Servo doorLock;

void setup() {
  pinMode(PIR_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  doorLock.attach(SERVO_PIN);
  doorLock.write(0);
}

void loop() {
  if (digitalRead(PIR_PIN) == HIGH) {
    digitalWrite(LED_PIN, HIGH);
    tone(BUZZER_PIN, 2000);
    doorLock.write(90);
    delay(1000);
  } else {
    noTone(BUZZER_PIN);
    digitalWrite(LED_PIN, LOW);
    doorLock.write(0);
  }
}
```

- Source nodes:
  - pir.out
  - buzzer.signal
  - led.anode
  - servo.signal
  - servo.vcc
  - pir.vcc
  - led.cathode
  - buzzer.gnd
  - pir.gnd
  - servo.gnd
- Target nodes:
  - arduino.d2
  - arduino.d8
  - arduino.d7
  - arduino.d9
  - arduino.5v
  - arduino.gnd
- Expected connections:
  - pir.out -> arduino.d7
  - buzzer.signal -> arduino.d2
  - led.anode -> arduino.d8
  - servo.signal -> arduino.d9
  - servo.vcc -> arduino.5v
  - pir.vcc -> arduino.5v
  - led.cathode -> arduino.gnd
  - buzzer.gnd -> arduino.gnd
  - pir.gnd -> arduino.gnd
  - servo.gnd -> arduino.gnd

### C6. Connection Task 6: Storage Room Lock Wiring
- Question: Map each module pin to the expected Arduino endpoint shown by the code.
- Code:
```cpp
#include <Servo.h>

const int PIR_PIN = 8;
const int BUZZER_PIN = 7;
const int LED_PIN = 2;
const int SERVO_PIN = 9;

Servo doorLock;

void setup() {
  pinMode(PIR_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  doorLock.attach(SERVO_PIN);
  doorLock.write(0);
}

void loop() {
  if (digitalRead(PIR_PIN) == HIGH) {
    digitalWrite(LED_PIN, HIGH);
    tone(BUZZER_PIN, 2000);
    doorLock.write(90);
    delay(1000);
  } else {
    noTone(BUZZER_PIN);
    digitalWrite(LED_PIN, LOW);
    doorLock.write(0);
  }
}
```

- Source nodes:
  - pir.out
  - buzzer.signal
  - led.anode
  - servo.signal
  - servo.vcc
  - pir.vcc
  - led.cathode
  - buzzer.gnd
  - pir.gnd
  - servo.gnd
- Target nodes:
  - arduino.d2
  - arduino.d8
  - arduino.d7
  - arduino.d9
  - arduino.5v
  - arduino.gnd
- Expected connections:
  - pir.out -> arduino.d8
  - buzzer.signal -> arduino.d7
  - led.anode -> arduino.d2
  - servo.signal -> arduino.d9
  - servo.vcc -> arduino.5v
  - pir.vcc -> arduino.5v
  - led.cathode -> arduino.gnd
  - buzzer.gnd -> arduino.gnd
  - pir.gnd -> arduino.gnd
  - servo.gnd -> arduino.gnd

### C7. Connection Task 7: Office Alert Wiring
- Question: Follow the pin constants and create a valid one-to-one signal wiring map.
- Code:
```cpp
#include <Servo.h>

const int PIR_PIN = 2;
const int BUZZER_PIN = 9;
const int LED_PIN = 7;
const int SERVO_PIN = 8;

Servo doorLock;

void setup() {
  pinMode(PIR_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  doorLock.attach(SERVO_PIN);
  doorLock.write(0);
}

void loop() {
  if (digitalRead(PIR_PIN) == HIGH) {
    digitalWrite(LED_PIN, HIGH);
    tone(BUZZER_PIN, 2000);
    doorLock.write(90);
    delay(1000);
  } else {
    noTone(BUZZER_PIN);
    digitalWrite(LED_PIN, LOW);
    doorLock.write(0);
  }
}
```

- Source nodes:
  - pir.out
  - buzzer.signal
  - led.anode
  - servo.signal
  - servo.vcc
  - pir.vcc
  - led.cathode
  - buzzer.gnd
  - pir.gnd
  - servo.gnd
- Target nodes:
  - arduino.d2
  - arduino.d8
  - arduino.d7
  - arduino.d9
  - arduino.5v
  - arduino.gnd
- Expected connections:
  - pir.out -> arduino.d2
  - buzzer.signal -> arduino.d9
  - led.anode -> arduino.d7
  - servo.signal -> arduino.d8
  - servo.vcc -> arduino.5v
  - pir.vcc -> arduino.5v
  - led.cathode -> arduino.gnd
  - buzzer.gnd -> arduino.gnd
  - pir.gnd -> arduino.gnd
  - servo.gnd -> arduino.gnd

### C8. Connection Task 8: Night Patrol Alarm Wiring
- Question: Build the complete wiring map for this pin configuration and preserve all grounds.
- Code:
```cpp
#include <Servo.h>

const int PIR_PIN = 7;
const int BUZZER_PIN = 9;
const int LED_PIN = 2;
const int SERVO_PIN = 8;

Servo doorLock;

void setup() {
  pinMode(PIR_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  doorLock.attach(SERVO_PIN);
  doorLock.write(0);
}

void loop() {
  if (digitalRead(PIR_PIN) == HIGH) {
    digitalWrite(LED_PIN, HIGH);
    tone(BUZZER_PIN, 2000);
    doorLock.write(90);
    delay(1000);
  } else {
    noTone(BUZZER_PIN);
    digitalWrite(LED_PIN, LOW);
    doorLock.write(0);
  }
}
```

- Source nodes:
  - pir.out
  - buzzer.signal
  - led.anode
  - servo.signal
  - servo.vcc
  - pir.vcc
  - led.cathode
  - buzzer.gnd
  - pir.gnd
  - servo.gnd
- Target nodes:
  - arduino.d2
  - arduino.d8
  - arduino.d7
  - arduino.d9
  - arduino.5v
  - arduino.gnd
- Expected connections:
  - pir.out -> arduino.d7
  - buzzer.signal -> arduino.d9
  - led.anode -> arduino.d2
  - servo.signal -> arduino.d8
  - servo.vcc -> arduino.5v
  - pir.vcc -> arduino.5v
  - led.cathode -> arduino.gnd
  - buzzer.gnd -> arduino.gnd
  - pir.gnd -> arduino.gnd
  - servo.gnd -> arduino.gnd

### C9. Connection Task 9: Smart Locker Wiring
- Question: Wire the components to match the constants and expected logic behavior.
- Code:
```cpp
#include <Servo.h>

const int PIR_PIN = 8;
const int BUZZER_PIN = 9;
const int LED_PIN = 2;
const int SERVO_PIN = 7;

Servo doorLock;

void setup() {
  pinMode(PIR_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  doorLock.attach(SERVO_PIN);
  doorLock.write(0);
}

void loop() {
  if (digitalRead(PIR_PIN) == HIGH) {
    digitalWrite(LED_PIN, HIGH);
    tone(BUZZER_PIN, 2000);
    doorLock.write(90);
    delay(1000);
  } else {
    noTone(BUZZER_PIN);
    digitalWrite(LED_PIN, LOW);
    doorLock.write(0);
  }
}
```

- Source nodes:
  - pir.out
  - buzzer.signal
  - led.anode
  - servo.signal
  - servo.vcc
  - pir.vcc
  - led.cathode
  - buzzer.gnd
  - pir.gnd
  - servo.gnd
- Target nodes:
  - arduino.d2
  - arduino.d8
  - arduino.d7
  - arduino.d9
  - arduino.5v
  - arduino.gnd
- Expected connections:
  - pir.out -> arduino.d8
  - buzzer.signal -> arduino.d9
  - led.anode -> arduino.d2
  - servo.signal -> arduino.d7
  - servo.vcc -> arduino.5v
  - pir.vcc -> arduino.5v
  - led.cathode -> arduino.gnd
  - buzzer.gnd -> arduino.gnd
  - pir.gnd -> arduino.gnd
  - servo.gnd -> arduino.gnd

### C10. Connection Task 10: Archive Room Alarm Wiring
- Question: Use the provided code to derive and complete all required signal + power connections.
- Code:
```cpp
#include <Servo.h>

const int PIR_PIN = 9;
const int BUZZER_PIN = 2;
const int LED_PIN = 8;
const int SERVO_PIN = 7;

Servo doorLock;

void setup() {
  pinMode(PIR_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  doorLock.attach(SERVO_PIN);
  doorLock.write(0);
}

void loop() {
  if (digitalRead(PIR_PIN) == HIGH) {
    digitalWrite(LED_PIN, HIGH);
    tone(BUZZER_PIN, 2000);
    doorLock.write(90);
    delay(1000);
  } else {
    noTone(BUZZER_PIN);
    digitalWrite(LED_PIN, LOW);
    doorLock.write(0);
  }
}
```

- Source nodes:
  - pir.out
  - buzzer.signal
  - led.anode
  - servo.signal
  - servo.vcc
  - pir.vcc
  - led.cathode
  - buzzer.gnd
  - pir.gnd
  - servo.gnd
- Target nodes:
  - arduino.d2
  - arduino.d8
  - arduino.d7
  - arduino.d9
  - arduino.5v
  - arduino.gnd
- Expected connections:
  - pir.out -> arduino.d9
  - buzzer.signal -> arduino.d2
  - led.anode -> arduino.d8
  - servo.signal -> arduino.d7
  - servo.vcc -> arduino.5v
  - pir.vcc -> arduino.5v
  - led.cathode -> arduino.gnd
  - buzzer.gnd -> arduino.gnd
  - pir.gnd -> arduino.gnd
  - servo.gnd -> arduino.gnd

## Basic Snippet Coding (10)

### D1. Basic Snippet Coding 1: Reverse From Wiring
- Question: Given the wiring map below, write a basic Arduino snippet that reads PIR input and controls LED, buzzer, and servo lock. Keep it simple (setup + loop logic).
- Reference connections:
  - pir.out -> arduino.d2
  - buzzer.signal -> arduino.d8
  - led.anode -> arduino.d7
  - servo.signal -> arduino.d9
  - servo.vcc -> arduino.5v
  - pir.vcc -> arduino.5v
  - led.cathode -> arduino.gnd
  - buzzer.gnd -> arduino.gnd
  - pir.gnd -> arduino.gnd
  - servo.gnd -> arduino.gnd
- Evaluation keywords (basic):
  - pinmode(pir_pin, input)
  - pinmode(led_pin, output)
  - pinmode(buzzer_pin, output)
  - doorlock.attach(servo_pin)
  - digitalread(pir_pin)
  - digitalwrite(led_pin, high)
  - tone(buzzer_pin
  - doorlock.write(90)
  - digitalwrite(led_pin, low)
  - notone(buzzer_pin)
  - doorlock.write(0)

### D2. Basic Snippet Coding 2: Reverse From Wiring
- Question: Given the wiring map below, write a basic Arduino snippet that reads PIR input and controls LED, buzzer, and servo lock. Keep it simple (setup + loop logic).
- Reference connections:
  - pir.out -> arduino.d7
  - buzzer.signal -> arduino.d8
  - led.anode -> arduino.d2
  - servo.signal -> arduino.d9
  - servo.vcc -> arduino.5v
  - pir.vcc -> arduino.5v
  - led.cathode -> arduino.gnd
  - buzzer.gnd -> arduino.gnd
  - pir.gnd -> arduino.gnd
  - servo.gnd -> arduino.gnd
- Evaluation keywords (basic):
  - pinmode(pir_pin, input)
  - pinmode(led_pin, output)
  - pinmode(buzzer_pin, output)
  - doorlock.attach(servo_pin)
  - digitalread(pir_pin)
  - digitalwrite(led_pin, high)
  - tone(buzzer_pin
  - doorlock.write(90)
  - digitalwrite(led_pin, low)
  - notone(buzzer_pin)
  - doorlock.write(0)

### D3. Basic Snippet Coding 3: Reverse From Wiring
- Question: Given the wiring map below, write a basic Arduino snippet that reads PIR input and controls LED, buzzer, and servo lock. Keep it simple (setup + loop logic).
- Reference connections:
  - pir.out -> arduino.d2
  - buzzer.signal -> arduino.d7
  - led.anode -> arduino.d8
  - servo.signal -> arduino.d9
  - servo.vcc -> arduino.5v
  - pir.vcc -> arduino.5v
  - led.cathode -> arduino.gnd
  - buzzer.gnd -> arduino.gnd
  - pir.gnd -> arduino.gnd
  - servo.gnd -> arduino.gnd
- Evaluation keywords (basic):
  - pinmode(pir_pin, input)
  - pinmode(led_pin, output)
  - pinmode(buzzer_pin, output)
  - doorlock.attach(servo_pin)
  - digitalread(pir_pin)
  - digitalwrite(led_pin, high)
  - tone(buzzer_pin
  - doorlock.write(90)
  - digitalwrite(led_pin, low)
  - notone(buzzer_pin)
  - doorlock.write(0)

### D4. Basic Snippet Coding 4: Reverse From Wiring
- Question: Given the wiring map below, write a basic Arduino snippet that reads PIR input and controls LED, buzzer, and servo lock. Keep it simple (setup + loop logic).
- Reference connections:
  - pir.out -> arduino.d8
  - buzzer.signal -> arduino.d2
  - led.anode -> arduino.d7
  - servo.signal -> arduino.d9
  - servo.vcc -> arduino.5v
  - pir.vcc -> arduino.5v
  - led.cathode -> arduino.gnd
  - buzzer.gnd -> arduino.gnd
  - pir.gnd -> arduino.gnd
  - servo.gnd -> arduino.gnd
- Evaluation keywords (basic):
  - pinmode(pir_pin, input)
  - pinmode(led_pin, output)
  - pinmode(buzzer_pin, output)
  - doorlock.attach(servo_pin)
  - digitalread(pir_pin)
  - digitalwrite(led_pin, high)
  - tone(buzzer_pin
  - doorlock.write(90)
  - digitalwrite(led_pin, low)
  - notone(buzzer_pin)
  - doorlock.write(0)

### D5. Basic Snippet Coding 5: Reverse From Wiring
- Question: Given the wiring map below, write a basic Arduino snippet that reads PIR input and controls LED, buzzer, and servo lock. Keep it simple (setup + loop logic).
- Reference connections:
  - pir.out -> arduino.d7
  - buzzer.signal -> arduino.d2
  - led.anode -> arduino.d8
  - servo.signal -> arduino.d9
  - servo.vcc -> arduino.5v
  - pir.vcc -> arduino.5v
  - led.cathode -> arduino.gnd
  - buzzer.gnd -> arduino.gnd
  - pir.gnd -> arduino.gnd
  - servo.gnd -> arduino.gnd
- Evaluation keywords (basic):
  - pinmode(pir_pin, input)
  - pinmode(led_pin, output)
  - pinmode(buzzer_pin, output)
  - doorlock.attach(servo_pin)
  - digitalread(pir_pin)
  - digitalwrite(led_pin, high)
  - tone(buzzer_pin
  - doorlock.write(90)
  - digitalwrite(led_pin, low)
  - notone(buzzer_pin)
  - doorlock.write(0)

### D6. Basic Snippet Coding 6: Reverse From Wiring
- Question: Given the wiring map below, write a basic Arduino snippet that reads PIR input and controls LED, buzzer, and servo lock. Keep it simple (setup + loop logic).
- Reference connections:
  - pir.out -> arduino.d8
  - buzzer.signal -> arduino.d7
  - led.anode -> arduino.d2
  - servo.signal -> arduino.d9
  - servo.vcc -> arduino.5v
  - pir.vcc -> arduino.5v
  - led.cathode -> arduino.gnd
  - buzzer.gnd -> arduino.gnd
  - pir.gnd -> arduino.gnd
  - servo.gnd -> arduino.gnd
- Evaluation keywords (basic):
  - pinmode(pir_pin, input)
  - pinmode(led_pin, output)
  - pinmode(buzzer_pin, output)
  - doorlock.attach(servo_pin)
  - digitalread(pir_pin)
  - digitalwrite(led_pin, high)
  - tone(buzzer_pin
  - doorlock.write(90)
  - digitalwrite(led_pin, low)
  - notone(buzzer_pin)
  - doorlock.write(0)

### D7. Basic Snippet Coding 7: Reverse From Wiring
- Question: Given the wiring map below, write a basic Arduino snippet that reads PIR input and controls LED, buzzer, and servo lock. Keep it simple (setup + loop logic).
- Reference connections:
  - pir.out -> arduino.d2
  - buzzer.signal -> arduino.d9
  - led.anode -> arduino.d7
  - servo.signal -> arduino.d8
  - servo.vcc -> arduino.5v
  - pir.vcc -> arduino.5v
  - led.cathode -> arduino.gnd
  - buzzer.gnd -> arduino.gnd
  - pir.gnd -> arduino.gnd
  - servo.gnd -> arduino.gnd
- Evaluation keywords (basic):
  - pinmode(pir_pin, input)
  - pinmode(led_pin, output)
  - pinmode(buzzer_pin, output)
  - doorlock.attach(servo_pin)
  - digitalread(pir_pin)
  - digitalwrite(led_pin, high)
  - tone(buzzer_pin
  - doorlock.write(90)
  - digitalwrite(led_pin, low)
  - notone(buzzer_pin)
  - doorlock.write(0)

### D8. Basic Snippet Coding 8: Reverse From Wiring
- Question: Given the wiring map below, write a basic Arduino snippet that reads PIR input and controls LED, buzzer, and servo lock. Keep it simple (setup + loop logic).
- Reference connections:
  - pir.out -> arduino.d7
  - buzzer.signal -> arduino.d9
  - led.anode -> arduino.d2
  - servo.signal -> arduino.d8
  - servo.vcc -> arduino.5v
  - pir.vcc -> arduino.5v
  - led.cathode -> arduino.gnd
  - buzzer.gnd -> arduino.gnd
  - pir.gnd -> arduino.gnd
  - servo.gnd -> arduino.gnd
- Evaluation keywords (basic):
  - pinmode(pir_pin, input)
  - pinmode(led_pin, output)
  - pinmode(buzzer_pin, output)
  - doorlock.attach(servo_pin)
  - digitalread(pir_pin)
  - digitalwrite(led_pin, high)
  - tone(buzzer_pin
  - doorlock.write(90)
  - digitalwrite(led_pin, low)
  - notone(buzzer_pin)
  - doorlock.write(0)

### D9. Basic Snippet Coding 9: Reverse From Wiring
- Question: Given the wiring map below, write a basic Arduino snippet that reads PIR input and controls LED, buzzer, and servo lock. Keep it simple (setup + loop logic).
- Reference connections:
  - pir.out -> arduino.d8
  - buzzer.signal -> arduino.d9
  - led.anode -> arduino.d2
  - servo.signal -> arduino.d7
  - servo.vcc -> arduino.5v
  - pir.vcc -> arduino.5v
  - led.cathode -> arduino.gnd
  - buzzer.gnd -> arduino.gnd
  - pir.gnd -> arduino.gnd
  - servo.gnd -> arduino.gnd
- Evaluation keywords (basic):
  - pinmode(pir_pin, input)
  - pinmode(led_pin, output)
  - pinmode(buzzer_pin, output)
  - doorlock.attach(servo_pin)
  - digitalread(pir_pin)
  - digitalwrite(led_pin, high)
  - tone(buzzer_pin
  - doorlock.write(90)
  - digitalwrite(led_pin, low)
  - notone(buzzer_pin)
  - doorlock.write(0)

### D10. Basic Snippet Coding 10: Reverse From Wiring
- Question: Given the wiring map below, write a basic Arduino snippet that reads PIR input and controls LED, buzzer, and servo lock. Keep it simple (setup + loop logic).
- Reference connections:
  - pir.out -> arduino.d9
  - buzzer.signal -> arduino.d2
  - led.anode -> arduino.d8
  - servo.signal -> arduino.d7
  - servo.vcc -> arduino.5v
  - pir.vcc -> arduino.5v
  - led.cathode -> arduino.gnd
  - buzzer.gnd -> arduino.gnd
  - pir.gnd -> arduino.gnd
  - servo.gnd -> arduino.gnd
- Evaluation keywords (basic):
  - pinmode(pir_pin, input)
  - pinmode(led_pin, output)
  - pinmode(buzzer_pin, output)
  - doorlock.attach(servo_pin)
  - digitalread(pir_pin)
  - digitalwrite(led_pin, high)
  - tone(buzzer_pin
  - doorlock.write(90)
  - digitalwrite(led_pin, low)
  - notone(buzzer_pin)
  - doorlock.write(0)

