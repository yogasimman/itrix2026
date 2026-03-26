import type { QuestionType, Round1Question } from '@/lib/db';

export type Round1BankDifficulty = 'Easy' | 'Hard';

export interface McqSeed {
  title: string;
  stem: string;
  options: [string, string, string, string];
  correctIndex: number;
  difficulty: Round1BankDifficulty;
}

export interface ScenarioSeed {
  id: string;
  title: string;
  prompt: string;
  questions: Array<{
    stem: string;
    options: [string, string, string, string];
    correctIndex: number;
  }>;
}

export interface ConnectionQuestionSeed {
  title: string;
  stem: string;
  codeSnippet: string;
  sourceNodes: string[];
  targetNodes: string[];
  expectedConnections: Array<{ from: string; to: string }>;
}

export interface SnippetCodingSeed {
  title: string;
  stem: string;
  referenceConnections: Array<{ from: string; to: string }>;
  requiredKeywords: string[];
}

interface BuiltQuestion {
  type: QuestionType;
  title: string;
  scenario: string;
  section: 'A' | 'B' | 'C' | 'D';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  score: number;
  timeLimit: number;
  options?: Array<{ id: string; text: string }>;
  correctAnswer?: string | string[];
  scenario_group?: string;
  codeSnippet?: string;
  sourceNodes?: string[];
  targetNodes?: string[];
  expectedConnections?: Array<{ from: string; to: string }>;
}

const OPTION_IDS = ['A', 'B', 'C', 'D'] as const;

const EASY_MCQ_SEEDS: McqSeed[] = [
  { title: 'GPIO Direction', stem: 'In Arduino, what does pinMode(pin, OUTPUT) do?', options: ['Sets the pin to read analog voltage', 'Sets the pin to produce a digital signal', 'Disables interrupts globally', 'Configures UART baud rate'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'ADC Width', stem: 'On Arduino Uno, analogRead() usually returns values in which range?', options: ['0 to 255', '0 to 1023', '0 to 2047', '0 to 4095'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'PWM Meaning', stem: 'PWM is mainly used in embedded systems to:', options: ['Encrypt serial traffic', 'Approximate analog output using duty cycle', 'Increase CPU clock speed', 'Store data in EEPROM'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Pull-up Resistor', stem: 'INPUT_PULLUP on Arduino is commonly used to:', options: ['Increase ADC precision', 'Keep a digital input from floating', 'Improve Wi-Fi range', 'Enable hardware PWM'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'I2C Wires', stem: 'The two primary I2C signal lines are:', options: ['TX and RX', 'MOSI and MISO', 'SDA and SCL', 'CS and CLK'], correctIndex: 2, difficulty: 'Easy' },
  { title: 'SPI Role', stem: 'In SPI communication, CS pin is used to:', options: ['Control ADC reference level', 'Select which slave device is active', 'Reset the microcontroller', 'Switch from 3.3V to 5V'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'UART Basics', stem: 'UART communication typically uses which pair?', options: ['SDA/SCL', 'TX/RX', 'MISO/MOSI', 'AIN+/AIN-'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'LDR Behavior', stem: 'For a typical LDR, resistance generally:', options: ['Increases when light increases', 'Decreases when light increases', 'Stays constant with light changes', 'Becomes negative in darkness'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'DHT Sensor', stem: 'DHT11/DHT22 sensors are used to measure:', options: ['Distance and velocity', 'Temperature and humidity', 'Voltage and current', 'Pressure and altitude only'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Ultrasonic Timing', stem: 'HC-SR04 distance is computed from:', options: ['Current consumption of trigger pin', 'Echo pulse duration', 'Ambient light level', 'CPU clock cycles only'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Servo Control', stem: 'Standard hobby servo position is commonly controlled using:', options: ['I2C packet count', 'PWM pulse width', 'ADC resolution bits', 'CAN arbitration ID'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Relay Purpose', stem: 'A relay module in IoT prototypes is mainly used to:', options: ['Amplify analog sensor voltage', 'Switch higher-voltage/current loads', 'Convert AC to DC automatically', 'Measure humidity'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Debounce', stem: 'Button debounce is required because mechanical switches:', options: ['Have floating-point rounding errors', 'Create rapid transient toggles when pressed', 'Need analog calibration daily', 'Lose EEPROM content'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Watchdog', stem: 'A watchdog timer helps by:', options: ['Generating PWM on extra channels', 'Resetting the MCU if firmware hangs', 'Increasing RAM size', 'Encrypting BLE packets'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Raspberry Pi Type', stem: 'Raspberry Pi is best described as a:', options: ['Bare-metal sensor only', 'Single board computer', 'Only a bootloader chip', 'Simple analog comparator'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'GPIO Voltage', stem: 'Most Raspberry Pi GPIO pins are logic-level:', options: ['1.8V', '3.3V', '5V tolerant always', '12V industrial'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'MQTT Pattern', stem: 'MQTT primarily follows which communication model?', options: ['Peer-to-peer block exchange', 'Publish/Subscribe through broker', 'Master-only serial polling', 'Token ring bus'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Topic in MQTT', stem: 'In MQTT, a topic is:', options: ['A battery chemistry type', 'A routing string for messages', 'A firmware checksum', 'An analog pin alias'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'QoS 0', stem: 'MQTT QoS 0 means:', options: ['Exactly once delivery', 'At least once delivery', 'Best effort delivery', 'Encrypted delivery'], correctIndex: 2, difficulty: 'Easy' },
  { title: 'Wi-Fi Module', stem: 'ESP32 is popular in IoT because it has built-in:', options: ['GPU tensor cores', 'Wi-Fi and Bluetooth', '48V PoE injector', 'Industrial PLC ladder runtime'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'HTTP Method', stem: 'To send sensor data to REST API, the common method is:', options: ['TRACE', 'POST', 'OPTIONS only', 'HEAD only'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'JSON Role', stem: 'JSON in IoT cloud communication is typically used for:', options: ['Power conversion', 'Data serialization', 'Noise filtering', 'PWM generation'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Breadboard Rails', stem: 'On a standard breadboard, side rails are usually for:', options: ['Clock synthesis', 'Power distribution', 'SPI framing', 'EEPROM addressing'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Diode Protection', stem: 'A flyback diode is used with DC motors to:', options: ['Increase rotation speed', 'Suppress back EMF spikes', 'Reduce UART latency', 'Boost battery capacity'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Buzzer Use', stem: 'Piezo buzzer in embedded projects is generally an:', options: ['Input sensor', 'Audio output actuator', 'Protocol converter', 'Storage element'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Temperature Sensor', stem: 'LM35 output is generally proportional to:', options: ['Humidity', 'Temperature', 'Distance', 'Pressure'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Potentiometer', stem: 'A potentiometer used with analogRead acts as:', options: ['Current source', 'Variable voltage divider', 'Digital encoder', 'RF transmitter'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Serial Monitor', stem: 'Serial.begin(9600) sets:', options: ['ADC resolution', 'UART baud rate', 'I2C address', 'PWM duty cycle'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Raspberry Pi OS', stem: 'Raspberry Pi typically runs:', options: ['Bare C only', 'Linux-based OS', 'Only Arduino sketch format', 'No operating system support'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Node-RED', stem: 'Node-RED is commonly used to:', options: ['Solder PCB layers', 'Create visual IoT workflows', 'Fabricate sensors', 'Program FPGA bitstreams only'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'BLE Full Form', stem: 'BLE stands for:', options: ['Binary Logic Engine', 'Bluetooth Low Energy', 'Bus Line Encoder', 'Basic Link Ethernet'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Actuator Example', stem: 'Which is an actuator?', options: ['LDR', 'Ultrasonic sensor', 'Servo motor', 'Thermistor'], correctIndex: 2, difficulty: 'Easy' },
  { title: 'Sensor Example', stem: 'Which is a sensor?', options: ['Relay', 'DHT22', 'Buzzer', 'LED'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Digital Read Values', stem: 'digitalRead() returns:', options: ['Only floating values', 'HIGH or LOW', '0 to 1023', 'Signed 16-bit value always'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Loop Function', stem: 'In Arduino, loop() function:', options: ['Runs once after reset', 'Runs repeatedly after setup()', 'Only runs on interrupt', 'Runs only in debug mode'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Setup Function', stem: 'In Arduino, setup() is mainly for:', options: ['Repeated sensing forever', 'One-time initialization', 'Automatic cloud upload', 'Compiling sketches at runtime'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'I2C Pullups', stem: 'I2C lines usually require:', options: ['Series capacitors only', 'Pull-up resistors', 'H-bridge drivers', 'Optocouplers always'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'GPIO Expander', stem: 'GPIO expander is used when:', options: ['Need more digital pins than MCU has', 'Need faster ADC conversion', 'Need camera ISP', 'Need LTE modem'], correctIndex: 0, difficulty: 'Easy' },
  { title: 'Cloud Dashboard', stem: 'IoT dashboard mainly helps to:', options: ['Manufacture PCBs', 'Visualize and monitor telemetry', 'Increase battery voltage', 'Generate C compiler binaries'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'OTA Meaning', stem: 'OTA firmware update means:', options: ['Over-the-air update', 'Only terminal access', 'Offline timing adjustment', 'Output threshold averaging'], correctIndex: 0, difficulty: 'Easy' },
  { title: 'Ground Reference', stem: 'In mixed modules, common GND is required to:', options: ['Increase Wi-Fi range', 'Share voltage reference between modules', 'Reduce flash memory use', 'Enable PWM on all pins'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'NVIDIA SBC Example', stem: 'Which board is a GPU-capable SBC often used for edge AI?', options: ['Arduino Nano', 'Jetson Nano', 'ATmega328P DIP chip', 'L293D motor driver'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Edge AI', stem: 'Edge AI means running inference:', options: ['Only in remote cloud', 'On or near the device', 'Inside battery charger', 'Inside USB cable'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'I2C Address', stem: 'If two I2C devices have same fixed address, common workaround is:', options: ['Increase baud rate', 'Use I2C multiplexer', 'Switch to pull-down resistors', 'Disable ACK'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Sampling Rate', stem: 'Sampling rate of a sensor defines:', options: ['Power supply polarity', 'How often data is measured', 'Pin mode direction', 'Packet encryption key size'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Latency', stem: 'In IoT systems, latency refers to:', options: ['Battery weight', 'Delay between event and response', 'ADC pin count', 'Wire gauge thickness'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Threshold Alert', stem: 'A threshold-based alert triggers when:', options: ['Data equals zero always', 'Measurement crosses configured limit', 'MCU enters sleep mode', 'UART parity is odd'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Raspberry Pi Camera', stem: 'Raspberry Pi camera module is typically connected through:', options: ['CSI interface', 'PWM pin', 'I2C only', 'CAN bus only'], correctIndex: 0, difficulty: 'Easy' },
  { title: 'Basic RTOS Use', stem: 'A small RTOS helps embedded apps by:', options: ['Adding deterministic task scheduling', 'Increasing analog voltage', 'Replacing sensors', 'Disabling interrupts permanently'], correctIndex: 0, difficulty: 'Easy' },
  { title: 'EEPROM Usage', stem: 'EEPROM is commonly used to store:', options: ['Temporary RAM stack', 'Persistent configuration values', 'Live camera frames', 'Analog waveform output'], correctIndex: 1, difficulty: 'Easy' },
];

const HARD_MCQ_SEEDS: McqSeed[] = [
  { title: 'Nyquist Criterion', stem: 'To avoid aliasing, minimum sample rate should be:', options: ['Equal to highest signal frequency', 'At least twice the highest signal frequency', 'Half the highest signal frequency', 'Unrelated to input frequency'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Interrupt Jitter', stem: 'High interrupt jitter most directly affects:', options: ['Deterministic control loop timing', 'EEPROM capacity', 'I2C addressing', 'GPIO voltage level'], correctIndex: 0, difficulty: 'Hard' },
  { title: 'I2C Clock Stretching', stem: 'Clock stretching in I2C allows a slave to:', options: ['Boost bus voltage', 'Hold SCL low to delay master', 'Change its own address dynamically', 'Bypass ACK/NACK'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'CAN Arbitration', stem: 'CAN bus arbitration is based on:', options: ['Random backoff', 'Priority by identifier bits', 'Master token polling', 'Physical port number'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Debounce Strategy', stem: 'For robust debounce in noisy systems, best approach is:', options: ['Single immediate read only', 'State machine with time threshold', 'Increase supply voltage', 'Disable pull-ups'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'EMI Mitigation', stem: 'For long sensor wires in industrial environment, preferred approach is:', options: ['Use only higher ADC reference', 'Use differential signaling and shielding', 'Increase PWM frequency blindly', 'Disable grounding'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Kalman Use', stem: 'Kalman filtering in embedded sensing is primarily for:', options: ['Bootloader encryption', 'State estimation under noisy measurements', 'I2C arbitration', 'GPIO remapping'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Edge Inference Budget', stem: 'On GPU SBC deployment, first sizing constraint is often:', options: ['LED brightness', 'Memory and thermal envelope', 'I2C pull-up value', 'Buzzer volume'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Duty-Cycle Compliance', stem: 'In LPWAN planning, duty-cycle restrictions mainly limit:', options: ['Sensor resolution bits', 'Allowed airtime per period', 'Flash wear cycles', 'ADC offset'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'MQTT Retained Message', stem: 'Retained MQTT message is best described as:', options: ['A packet with CRC failure', 'Last known value stored by broker for topic', 'A duplicated QoS2 frame', 'A TLS handshake artifact'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Idempotent Command', stem: 'Idempotent device command means:', options: ['Command cannot fail', 'Repeated execution leaves same final state', 'Command uses UDP', 'Command uses binary payload'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Backpressure', stem: 'Backpressure in telemetry pipelines prevents:', options: ['ADC conversion', 'Unbounded queue growth during bursts', 'Clock synchronization', 'Sensor calibration'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Secure Boot Chain', stem: 'Secure boot primarily validates:', options: ['Sensor cable length', 'Firmware authenticity before execution', 'UART packet length', 'Cloud dashboard latency'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'OTA Rollback Trigger', stem: 'A robust OTA rollback policy should be based on:', options: ['Color of status LED', 'Health metrics and boot success criteria', 'Battery label', 'Clock source only'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Time Sync Drift', stem: 'In distributed IoT logs, unsynchronized clocks primarily break:', options: ['GPIO pull-ups', 'Event ordering and correlation', 'PWM output', 'I2C voltage'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Sensor Fusion', stem: 'Combining IMU and GPS with complementary strengths is called:', options: ['Link aggregation', 'Sensor fusion', 'Thread starvation', 'Heap compaction'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'ADC Input Impedance', stem: 'If ADC source impedance is too high, a common issue is:', options: ['Better linearity automatically', 'Sampling capacitor not settling properly', 'Infinite resolution', 'No need for anti-alias filter'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'RTOS Priority Inversion', stem: 'Priority inversion can be mitigated with:', options: ['Bigger LEDs', 'Priority inheritance mutex', 'Lower UART baud', 'Disabling interrupts always'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Edge Model Quantization', stem: 'INT8 quantization usually targets:', options: ['Larger model size', 'Lower memory/latency tradeoff', 'Higher supply voltage', 'More GPIO pins'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'SBC Thermal Throttling', stem: 'When Jetson inference FPS drops after few minutes, likely cause is:', options: ['EEPROM corruption', 'Thermal throttling', 'I2C clock stretching', 'Pin mislabeling'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'TLS Mutual Auth', stem: 'Mutual TLS in IoT ensures:', options: ['Only server authenticates client', 'Both client and server authenticate each other', 'No certificate management needed', 'Only symmetric keys allowed'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Replay Protection', stem: 'Nonce/timestamp in command channel is used to prevent:', options: ['Packet compression', 'Replay attacks', 'UART framing error', 'Sensor drift'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Battery SOC Estimation', stem: 'Coulomb counting alone can drift due to:', options: ['Perfect integration always', 'Current sensor offset accumulation', 'More PWM channels', 'Lower voltage ripple'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Ground Loop', stem: 'A ground loop problem often manifests as:', options: ['Stable zero-noise ADC', 'Measurement noise/hum and offset issues', 'Faster Wi-Fi throughput', 'Lower flash wear'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Hysteresis Threshold', stem: 'Hysteresis in control logic mainly reduces:', options: ['EEPROM writes', 'Rapid toggling near threshold', 'I2C address conflicts', 'Kernel panics'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'LoRa Spreading Factor', stem: 'Higher LoRa spreading factor generally gives:', options: ['Higher throughput and lower range', 'Lower throughput and higher range sensitivity', 'No effect on airtime', 'Always lower power consumption'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Message Ordering', stem: 'To maintain order in distributed ingestion, common approach is:', options: ['Ignore timestamps', 'Partition keys and sequence numbers', 'Use random topic names', 'Disable retries'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Fail-safe Design', stem: 'In safety-critical actuator control, fail-safe default should be:', options: ['Maximum power output', 'Known safe state on fault', 'Undefined output', 'Last random output'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Brownout Detection', stem: 'Brownout reset circuitry protects MCU from:', options: ['Excessive Wi-Fi packets', 'Operating at unsafe low voltage', 'Overclocking by compiler', 'I2C NACK'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Watchdog Window', stem: 'Windowed watchdog catches both:', options: ['Only late refresh', 'Too-early and too-late refreshes', 'ADC overflow', 'SPI bus conflicts only'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'DMA Benefit', stem: 'DMA is useful in embedded streaming because it:', options: ['Increases GPIO count', 'Moves data without heavy CPU intervention', 'Encrypts sensor values', 'Raises supply voltage'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Heap Fragmentation', stem: 'Long-running IoT firmware often avoids dynamic allocation because of:', options: ['Mandatory CAN rule', 'Heap fragmentation risk', 'Lack of interrupts', 'ADC mismatch'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'CAN Termination', stem: 'Typical CAN bus requires 120 ohm termination at:', options: ['Every node', 'Both ends of the bus', 'Only master node', 'Only sensor node'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'OTA Delta Update', stem: 'Delta OTA update mainly reduces:', options: ['CPU instruction set', 'Data transfer size', 'I2C clock speed', 'GPIO voltage'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Edge/Cloud Split', stem: 'A good edge-cloud partition keeps on edge:', options: ['Only dashboard rendering', 'Low-latency filtering and local actuation logic', 'Long-term archival only', 'Certificate authority only'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Digital Twin Sync', stem: 'Digital twin value depends on:', options: ['Manual once-a-day update', 'Reliable state synchronization with physical asset', 'High LED brightness', 'Disabling telemetry retries'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Sensor Calibration Drift', stem: 'Drift compensation generally needs:', options: ['No reference ever', 'Periodic reference checks and recalibration model', 'Higher UART baud only', 'Extra pull-up resistors'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Outlier Rejection', stem: 'Median filter is strong against:', options: ['Constant bias only', 'Impulse outliers', 'Clock skew', 'PWM dead time'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'State Machine Design', stem: 'Explicit finite state machines are preferred in firmware because they:', options: ['Reduce readability', 'Make transitions deterministic and testable', 'Require internet access', 'Disable interrupts'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Raspberry Pi Real-time', stem: 'When strict deterministic timing is needed, common strategy is:', options: ['Only user-space Python loops', 'Offload hard real-time tasks to MCU', 'Increase HDMI resolution', 'Disable all interrupts'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'GPU SBC Pipeline', stem: 'For camera AI on GPU SBC, preprocessing bottleneck often occurs at:', options: ['GPIO initialization', 'Frame decode/resize pipeline', 'I2C addressing', 'EEPROM reads'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Telemetry Compression', stem: 'When compressing telemetry, best candidate is:', options: ['Short random strings', 'Structured repetitive payload batches', 'Single-bit GPIO values only', 'TLS handshake packets'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Data Integrity', stem: 'CRC in embedded links is used for:', options: ['Confidentiality', 'Error detection', 'Authentication only', 'Power management'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Clock Domain Crossing', stem: 'Unsafe clock-domain crossing can cause:', options: ['Guaranteed deterministic behavior', 'Metastability issues', 'Higher battery life', 'Lower thermal output'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Slew Rate', stem: 'High dV/dt switching near analog front-end can:', options: ['Reduce noise automatically', 'Inject EMI/noise into measurements', 'Increase ADC bits', 'Improve calibration'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Power Budget', stem: 'In battery IoT design, average current should be estimated using:', options: ['Only active mode current', 'Duty-cycle weighted current profile', 'Only sleep current', 'Only peak current'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Firmware Logging', stem: 'On constrained devices, robust logging strategy is to:', options: ['Print every loop forever', 'Use leveled ring-buffered logs', 'Store stack dumps in RAM only', 'Disable all error logs'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Provisioning Security', stem: 'Factory provisioning should avoid:', options: ['Per-device keys', 'Shared default credentials across fleet', 'Hardware root of trust', 'Certificate rotation plans'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Anomaly Baseline', stem: 'IoT anomaly detection quality improves with:', options: ['No baseline data', 'Representative baseline and seasonal context', 'Only one threshold forever', 'Ignoring sensor metadata'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Regression Containment', stem: 'Best OTA regression containment is:', options: ['Global rollout first', 'Canary stages with automatic rollback', 'Manual reboot only', 'Skip health checks'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Edge Cache Strategy', stem: 'Intermittent connectivity is best handled with:', options: ['Discard data while offline', 'Store-and-forward local buffering', 'Disable timestamps', 'Reduce sampling to zero'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Safety Interlock', stem: 'Actuator safety interlock should be implemented as:', options: ['UI-only warning popup', 'Hardware/software enforced guard condition', 'Occasional manual reminder', 'Cloud-only check after actuation'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Formal Verification Fit', stem: 'Which component most benefits from formal checks in embedded systems?', options: ['Color theme CSS', 'State transition and safety logic', 'Board silkscreen text', 'USB cable brand'], correctIndex: 1, difficulty: 'Hard' },
];

const SCENARIO_SEEDS: ScenarioSeed[] = [
  {
    id: 'smart_greenhouse',
    title: 'Smart Greenhouse Control Failure',
    prompt: 'A greenhouse reports unstable crop environment. Temperature spikes, overwatering, and delayed fan actions are observed during afternoon load.',
    questions: [
      { stem: 'Which sensor pair should be prioritized for stabilization?', options: ['Soil moisture + DHT22', 'GPS + IMU', 'LDR + Hall sensor only', 'Ultrasonic + PIR'], correctIndex: 0 },
      { stem: 'Best control strategy to avoid relay chattering near threshold?', options: ['Decrease relay voltage', 'Add hysteresis and minimum on/off times', 'Sample once per hour', 'Disable feedback loop'], correctIndex: 1 },
      { stem: 'If cloud is delayed, what should edge controller do?', options: ['Wait for cloud command only', 'Apply local fallback rules safely', 'Reset every minute', 'Ignore sensor events'], correctIndex: 1 },
      { stem: 'Most suitable actuator for airflow regulation?', options: ['Servo-driven vent or fan relay', 'Piezo buzzer', 'EEPROM', 'I2C pull-up'], correctIndex: 0 },
      { stem: 'What is the best logging detail for diagnosis?', options: ['Only final daily average', 'Timestamped sensor, setpoint, and actuator state changes', 'Only relay count', 'Only manual notes'], correctIndex: 1 },
    ],
  },
  {
    id: 'smart_parking',
    title: 'Campus Smart Parking Congestion',
    prompt: 'A smart parking system shows wrong occupancy; students complain about false full status and delayed gate actions.',
    questions: [
      { stem: 'Most likely first technical issue to check?', options: ['Sensor alignment/calibration at slots', 'Wi-Fi SSID spelling', 'Dashboard font choice', 'Battery sticker'], correctIndex: 0 },
      { stem: 'Best way to reduce false positives from ultrasonic sensors?', options: ['Randomly ignore every third reading', 'Median filtering with confidence checks', 'Lower MCU clock', 'Disable retries'], correctIndex: 1 },
      { stem: 'For entry gate barrier, preferred actuator class is:', options: ['Servo motor with limit logic', 'Thermistor', 'LDR only', 'Buzzer only'], correctIndex: 0 },
      { stem: 'When broker disconnects briefly, occupancy events should:', options: ['Be dropped permanently', 'Be queued locally and replayed in order', 'Overwrite all old slots', 'Trigger factory reset'], correctIndex: 1 },
      { stem: 'What metric helps detect sensor degradation over weeks?', options: ['Average packet color', 'False detect rate per sensor', 'Logo size', 'USB version'], correctIndex: 1 },
    ],
  },
  {
    id: 'water_tank',
    title: 'Hostel Water Tank Automation',
    prompt: 'An IoT water-tank system overflows at night and also runs pump dry in morning. Level sensing and control decisions are inconsistent.',
    questions: [
      { stem: 'Critical safety interlock to prevent dry run?', options: ['Pump only with minimum level confirmation', 'Increase LED brightness', 'Use faster UART', 'Disable watchdog'], correctIndex: 0 },
      { stem: 'Best sensor combination for reliability?', options: ['Single noisy sensor only', 'Primary level sensor + timeout/fault logic', 'Only manual switch', 'GPS sensor'], correctIndex: 1 },
      { stem: 'Overflow prevention should prioritize:', options: ['Cloud approval every cycle', 'Edge cutoff threshold with hysteresis', 'Higher tank paint reflectivity', 'Random delays'], correctIndex: 1 },
      { stem: 'Pump control component typically needs:', options: ['Relay/contactor with isolation', 'ADC only', 'Capacitive touch only', 'OLED only'], correctIndex: 0 },
      { stem: 'What event is most useful for audit?', options: ['Every loop print only', 'Pump ON/OFF with level snapshot and reason', 'Only boot count', 'Only Wi-Fi RSSI'], correctIndex: 1 },
    ],
  },
  {
    id: 'cold_chain',
    title: 'Medical Cold-Chain Transport',
    prompt: 'Temperature-sensitive vaccine boxes report random alarm spikes and occasional missed alerts during transport.',
    questions: [
      { stem: 'Which fault should be ruled out first?', options: ['Sensor calibration drift', 'Display theme mismatch', 'SD card label', 'USB cable color'], correctIndex: 0 },
      { stem: 'To avoid alarm storms, use:', options: ['No threshold alerts', 'Hysteresis + debounce windows', 'Only daily summary', 'Manual logging only'], correctIndex: 1 },
      { stem: 'If network drops, critical behavior is:', options: ['Discard all events', 'Local alarm + buffered telemetry upload', 'Disable buzzer', 'Reboot continuously'], correctIndex: 1 },
      { stem: 'Best payload field for postmortem analysis?', options: ['Temperature, timestamp, device id, battery', 'Only temperature', 'Only packet id', 'Only route name'], correctIndex: 0 },
      { stem: 'What can validate alarm reliability?', options: ['Single one-time lab check', 'Replay test traces with expected alert outcomes', 'Change ringtone', 'Reduce storage'], correctIndex: 1 },
    ],
  },
  {
    id: 'air_quality',
    title: 'City Air-Quality Kiosk Drift',
    prompt: 'Roadside air-quality kiosks show inconsistent PM values between nearby locations and occasional spikes during rain.',
    questions: [
      { stem: 'Most practical first correction?', options: ['Cross-calibrate with reference instrument', 'Replace all displays', 'Increase upload interval randomly', 'Ignore rainy-day data'], correctIndex: 0 },
      { stem: 'Rain-related sudden spikes may suggest:', options: ['Sensor chamber contamination/humidity effects', 'Higher CPU frequency', 'Correct calibration always', 'Perfect network stability'], correctIndex: 0 },
      { stem: 'How should edge device report confidence?', options: ['No quality metric', 'Include quality flag and sensor diagnostics', 'Only binary pass/fail', 'Hide all metadata'], correctIndex: 1 },
      { stem: 'Best communication fallback?', options: ['Delete local data on failure', 'Store-and-forward with bounded queue', 'Turn off sensor', 'Keep retransmitting forever without delay'], correctIndex: 1 },
      { stem: 'Which actuator may be used in kiosk maintenance loop?', options: ['Fan/valve for airflow control', 'EEPROM', 'Static resistor', 'Antenna cable only'], correctIndex: 0 },
    ],
  },
  {
    id: 'smart_classroom',
    title: 'Smart Classroom Energy Control',
    prompt: 'A classroom automation setup turns lights/fans on at wrong times. Occupancy and ambient thresholds are not coordinated.',
    questions: [
      { stem: 'Best occupancy sensor for basic motion detection?', options: ['PIR sensor', 'Potentiometer', 'EEPROM', 'Buck converter'], correctIndex: 0 },
      { stem: 'When combining occupancy and light, policy should be:', options: ['OR everything blindly', 'Rule-based state machine with timeout', 'Only manual switch', 'Disable sensor fusion'], correctIndex: 1 },
      { stem: 'To avoid rapid toggling due to doorway movement:', options: ['Shorter timeout always', 'Use hold timer and hysteresis', 'Increase relay count', 'Turn off logging'], correctIndex: 1 },
      { stem: 'Actuator for switching AC mains load is generally:', options: ['Relay/SSR module', 'ADC channel', 'GPIO input', 'Buzzer'], correctIndex: 0 },
      { stem: 'Most useful regression test here?', options: ['UI screenshot only', 'Replay occupancy/light event sequences against expected states', 'Only power cycle test', 'Only lint check'], correctIndex: 1 },
    ],
  },
  {
    id: 'fleet_tracking',
    title: 'Fleet IoT Tracking Delay',
    prompt: 'Delivery bikes send location and fuel telemetry, but admin maps lag by several minutes during peak hours.',
    questions: [
      { stem: 'First bottleneck to inspect?', options: ['End-to-end queue and processing latency', 'Bike color', 'GPS antenna sticker', 'Dashboard icon style'], correctIndex: 0 },
      { stem: 'To reduce payload overhead, prefer:', options: ['Verbose nested logs per packet', 'Compact schema and batching where safe', 'Send duplicate copies always', 'Disable timestamps'], correctIndex: 1 },
      { stem: 'If packets arrive out-of-order, backend should:', options: ['Assume latest arrival is latest event', 'Use event timestamps/sequence handling', 'Drop all delayed packets blindly', 'Reset database hourly'], correctIndex: 1 },
      { stem: 'Edge resilience under intermittent network requires:', options: ['No cache', 'Local buffer with retry backoff', 'Only one retry fixed', 'Permanent online assumption'], correctIndex: 1 },
      { stem: 'Security must include:', options: ['Shared credentials for all bikes', 'Per-device identity and token/cert rotation', 'No auth in test mode forever', 'Only IP filtering'], correctIndex: 1 },
    ],
  },
  {
    id: 'factory_line',
    title: 'Factory Conveyor Monitoring',
    prompt: 'A conveyor monitoring system misses jam events and occasionally triggers false emergency stops.',
    questions: [
      { stem: 'Best sensor strategy for jam detection?', options: ['Single threshold only', 'Combine current + speed/position indicators', 'Only camera frame count', 'Only ambient temperature'], correctIndex: 1 },
      { stem: 'False emergency stops can be reduced by:', options: ['Ignoring all transient anomalies', 'Temporal confirmation and multi-signal validation', 'Disabling emergency state', 'Increasing motor speed'], correctIndex: 1 },
      { stem: 'What must happen when true jam is detected?', options: ['Continue operation and log only', 'Immediate safe stop with operator alert', 'Wait for cloud approval first always', 'Reboot PLC instantly'], correctIndex: 1 },
      { stem: 'For deterministic control timing, preferred base is:', options: ['Non-deterministic polling only', 'Periodic task schedule with bounded latency', 'Random sleep intervals', 'UI event loop'], correctIndex: 1 },
      { stem: 'Key audit field for safety compliance?', options: ['Emergency stop reason and timestamp', 'Theme mode', 'Screen brightness', 'Keyboard type'], correctIndex: 0 },
    ],
  },
  {
    id: 'smart_streetlight',
    title: 'Smart Streetlight Fault Isolation',
    prompt: 'Streetlights should dim at midnight and brighten on motion, but some poles stay bright all night.',
    questions: [
      { stem: 'First suspected issue for always-bright poles?', options: ['Motion threshold misconfiguration/sensor noise', 'Cloud logo mismatch', 'Battery chemistry label', 'UART parity'], correctIndex: 0 },
      { stem: 'Best dimming control output for LED drivers?', options: ['PWM/0-10V control path', 'EEPROM writes', 'I2C pull-up alone', 'Piezo frequency'], correctIndex: 0 },
      { stem: 'To verify schedule logic correctness:', options: ['Manual one-time check only', 'Simulate timeline with event playback', 'Change timezone randomly', 'Disable RTC'], correctIndex: 1 },
      { stem: 'If RTC drift affects schedule, fix is:', options: ['Ignore drift', 'Periodic time synchronization', 'Increase LED current', 'Lower ADC gain'], correctIndex: 1 },
      { stem: 'Power optimization target should prioritize:', options: ['Maximum brightness always', 'Adaptive dimming with occupancy confidence', 'Disabling sensing', 'Higher polling frequency only'], correctIndex: 1 },
    ],
  },
  {
    id: 'health_monitor',
    title: 'Wearable Health Monitor Reliability',
    prompt: 'A wearable sends heart-rate and motion alerts; users report false alerts during exercise and missed alerts at rest.',
    questions: [
      { stem: 'Most suitable improvement for signal quality?', options: ['Increase alert threshold permanently', 'Apply filtering and activity-aware thresholds', 'Disable accelerometer', 'Send no alerts'], correctIndex: 1 },
      { stem: 'Battery life and accuracy tradeoff is controlled by:', options: ['Sampling duty cycle and model complexity', 'LED color', 'Screen wallpaper', 'Clock source name'], correctIndex: 0 },
      { stem: 'In safety use-case, missed critical alert should trigger:', options: ['No action', 'Escalation path and fail-safe notification', 'Only local log', 'Silent retry for hours'], correctIndex: 1 },
      { stem: 'For edge inference on wearable/SBC companion, key budget is:', options: ['Thermal, compute, and memory constraints', 'Pin silkscreen font', 'USB connector color', 'Speaker size'], correctIndex: 0 },
      { stem: 'Validation dataset should include:', options: ['Only resting data', 'Rest, exercise, and noisy real-world sessions', 'Only synthetic data', 'Only one user'], correctIndex: 1 },
    ],
  },
];

const COMMON_SOURCE_NODES = [
  'pir.out',
  'buzzer.signal',
  'led.anode',
  'servo.signal',
  'servo.vcc',
  'pir.vcc',
  'led.cathode',
  'buzzer.gnd',
  'pir.gnd',
  'servo.gnd',
];

const COMMON_TARGET_NODES = ['arduino.d2', 'arduino.d8', 'arduino.d7', 'arduino.d9', 'arduino.5v', 'arduino.gnd'];

interface SignalPinMap {
  pir: string;
  buzzer: string;
  led: string;
  servo: string;
}

function pinNumber(pin: string): string {
  return pin.replace('arduino.d', '');
}

function basicSnippetKeywords(): string[] {
  return [
    'pinmode(pir_pin, input)',
    'pinmode(led_pin, output)',
    'pinmode(buzzer_pin, output)',
    'doorlock.attach(servo_pin)',
    'digitalread(pir_pin)',
    'digitalwrite(led_pin, high)',
    'tone(buzzer_pin',
    'doorlock.write(90)',
    'digitalwrite(led_pin, low)',
    'notone(buzzer_pin)',
    'doorlock.write(0)',
  ];
}

function buildConnectionSeed(title: string, stem: string, pins: SignalPinMap): ConnectionQuestionSeed {
  return {
    title,
    stem,
    codeSnippet: `#include <Servo.h>\n\nconst int PIR_PIN = ${pinNumber(pins.pir)};\nconst int BUZZER_PIN = ${pinNumber(pins.buzzer)};\nconst int LED_PIN = ${pinNumber(pins.led)};\nconst int SERVO_PIN = ${pinNumber(pins.servo)};\n\nServo doorLock;\n\nvoid setup() {\n  pinMode(PIR_PIN, INPUT);\n  pinMode(BUZZER_PIN, OUTPUT);\n  pinMode(LED_PIN, OUTPUT);\n  doorLock.attach(SERVO_PIN);\n  doorLock.write(0);\n}\n\nvoid loop() {\n  if (digitalRead(PIR_PIN) == HIGH) {\n    digitalWrite(LED_PIN, HIGH);\n    tone(BUZZER_PIN, 2000);\n    doorLock.write(90);\n    delay(1000);\n  } else {\n    noTone(BUZZER_PIN);\n    digitalWrite(LED_PIN, LOW);\n    doorLock.write(0);\n  }\n}`,
    sourceNodes: COMMON_SOURCE_NODES,
    targetNodes: COMMON_TARGET_NODES,
    expectedConnections: [
      { from: 'pir.out', to: pins.pir },
      { from: 'buzzer.signal', to: pins.buzzer },
      { from: 'led.anode', to: pins.led },
      { from: 'servo.signal', to: pins.servo },
      { from: 'servo.vcc', to: 'arduino.5v' },
      { from: 'pir.vcc', to: 'arduino.5v' },
      { from: 'led.cathode', to: 'arduino.gnd' },
      { from: 'buzzer.gnd', to: 'arduino.gnd' },
      { from: 'pir.gnd', to: 'arduino.gnd' },
      { from: 'servo.gnd', to: 'arduino.gnd' },
    ],
  };
}

const CONNECTION_QUESTION_SEEDS: ConnectionQuestionSeed[] = [
  buildConnectionSeed(
    'Connection Task 1: Smart Intrusion Alarm Wiring',
    'Read the Arduino code and wire each module pin to the correct Arduino pin. This question is evaluated offline by graph-based connection validation.',
    { pir: 'arduino.d2', buzzer: 'arduino.d8', led: 'arduino.d7', servo: 'arduino.d9' }
  ),
  buildConnectionSeed(
    'Connection Task 2: Corridor Security Wiring',
    'Wire the PIR, buzzer, LED, and servo to match the given code constants for this corridor security setup.',
    { pir: 'arduino.d7', buzzer: 'arduino.d8', led: 'arduino.d2', servo: 'arduino.d9' }
  ),
  buildConnectionSeed(
    'Connection Task 3: Lab Door Guard Wiring',
    'Use the code pin assignments to complete the full module-to-Arduino wiring map.',
    { pir: 'arduino.d2', buzzer: 'arduino.d7', led: 'arduino.d8', servo: 'arduino.d9' }
  ),
  buildConnectionSeed(
    'Connection Task 4: Parking Gate Alert Wiring',
    'Connect all signal, power, and ground lines correctly according to the sketch.',
    { pir: 'arduino.d8', buzzer: 'arduino.d2', led: 'arduino.d7', servo: 'arduino.d9' }
  ),
  buildConnectionSeed(
    'Connection Task 5: Hostel Entry Alarm Wiring',
    'Complete the wiring based on this variation of the alarm logic pin constants.',
    { pir: 'arduino.d7', buzzer: 'arduino.d2', led: 'arduino.d8', servo: 'arduino.d9' }
  ),
  buildConnectionSeed(
    'Connection Task 6: Storage Room Lock Wiring',
    'Map each module pin to the expected Arduino endpoint shown by the code.',
    { pir: 'arduino.d8', buzzer: 'arduino.d7', led: 'arduino.d2', servo: 'arduino.d9' }
  ),
  buildConnectionSeed(
    'Connection Task 7: Office Alert Wiring',
    'Follow the pin constants and create a valid one-to-one signal wiring map.',
    { pir: 'arduino.d2', buzzer: 'arduino.d9', led: 'arduino.d7', servo: 'arduino.d8' }
  ),
  buildConnectionSeed(
    'Connection Task 8: Night Patrol Alarm Wiring',
    'Build the complete wiring map for this pin configuration and preserve all grounds.',
    { pir: 'arduino.d7', buzzer: 'arduino.d9', led: 'arduino.d2', servo: 'arduino.d8' }
  ),
  buildConnectionSeed(
    'Connection Task 9: Smart Locker Wiring',
    'Wire the components to match the constants and expected logic behavior.',
    { pir: 'arduino.d8', buzzer: 'arduino.d9', led: 'arduino.d2', servo: 'arduino.d7' }
  ),
  buildConnectionSeed(
    'Connection Task 10: Archive Room Alarm Wiring',
    'Use the provided code to derive and complete all required signal + power connections.',
    { pir: 'arduino.d9', buzzer: 'arduino.d2', led: 'arduino.d8', servo: 'arduino.d7' }
  ),
];

const SNIPPET_CODING_QUESTION_SEEDS: SnippetCodingSeed[] = CONNECTION_QUESTION_SEEDS.map((connection, index) => ({
  title: `Basic Snippet Coding ${index + 1}: Reverse From Wiring`,
  stem:
    'Given the wiring map below, write a basic Arduino snippet that reads PIR input and controls LED, buzzer, and servo lock. Keep it simple (setup + loop logic).',
  referenceConnections: connection.expectedConnections,
  requiredKeywords: basicSnippetKeywords(),
}));

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function toOptions(seed: { options: [string, string, string, string] }) {
  return seed.options.map((text, index) => ({ id: OPTION_IDS[index], text }));
}

function toMcqQuestion(seed: McqSeed, idx: number): BuiltQuestion {
  return {
    type: 'mcq',
    title: seed.title,
    scenario: seed.stem,
    section: 'A',
    difficulty: seed.difficulty === 'Easy' ? 'Easy' : 'Hard',
    score: 5,
    timeLimit: 60,
    options: toOptions(seed),
    correctAnswer: OPTION_IDS[seed.correctIndex],
  };
}

function ensureMixedDifficulty(mcqs: BuiltQuestion[]): BuiltQuestion[] {
  if (mcqs.length < 2) {
    return mcqs;
  }

  const firstTen = mcqs.slice(0, Math.min(10, mcqs.length));
  const allFirstTenEasy = firstTen.every((q) => q.difficulty === 'Easy');
  const allFirstTenHard = firstTen.every((q) => q.difficulty === 'Hard');

  if (!allFirstTenEasy && !allFirstTenHard) {
    return mcqs;
  }

  const oppositeDifficulty = allFirstTenEasy ? 'Hard' : 'Easy';
  const swapIndex = mcqs.findIndex((q, index) => index >= 10 && q.difficulty === oppositeDifficulty);
  if (swapIndex === -1) {
    return mcqs;
  }

  const updated = [...mcqs];
  const firstIndex = firstTen.findIndex((q) => q.difficulty !== oppositeDifficulty);
  const sourceIndex = firstIndex === -1 ? 0 : firstIndex;
  const temp = updated[sourceIndex];
  updated[sourceIndex] = updated[swapIndex];
  updated[swapIndex] = temp;
  return updated;
}

function toScenarioQuestions(scenarioSeed: ScenarioSeed): BuiltQuestion[] {
  return scenarioSeed.questions.map((q, index) => ({
    type: 'scenario-mcq',
    title: `${scenarioSeed.title} - Q${index + 1}`,
    scenario: `Story and Problem Statement:\n${scenarioSeed.prompt}\n\nQuestion:\n${q.stem}`,
    section: 'B',
    difficulty: 'Medium',
    score: 8,
    timeLimit: 90,
    options: toOptions(q),
    correctAnswer: OPTION_IDS[q.correctIndex],
    scenario_group: scenarioSeed.id,
  }));
}

function toConnectionQuestion(seed: ConnectionQuestionSeed): BuiltQuestion {
  return {
    type: 'connection-evaluation',
    title: seed.title,
    scenario: seed.stem,
    section: 'C',
    difficulty: 'Hard',
    score: 20,
    timeLimit: 240,
    codeSnippet: seed.codeSnippet,
    sourceNodes: seed.sourceNodes,
    targetNodes: seed.targetNodes,
    expectedConnections: seed.expectedConnections,
    correctAnswer: JSON.stringify(
      seed.expectedConnections.reduce<Record<string, string>>((acc, edge) => {
        acc[edge.from] = edge.to;
        return acc;
      }, {})
    ),
  };
}

function toSnippetCodingQuestion(seed: SnippetCodingSeed): BuiltQuestion {
  const connectionLines = seed.referenceConnections
    .map((edge) => `- ${edge.from} -> ${edge.to}`)
    .join('\n');

  const findPin = (source: string, fallback: number) => {
    const target = seed.referenceConnections.find((edge) => edge.from === source)?.to;
    if (!target || !target.startsWith('arduino.d')) return String(fallback);
    return pinNumber(target);
  };

  return {
    type: 'snippet-coding',
    title: seed.title,
    scenario: `${seed.stem}\n\nReference connections:\n${connectionLines}`,
    section: 'D',
    difficulty: 'Medium',
    score: 20,
    timeLimit: 300,
    codeSnippet: `// Write your code here\nconst int PIR_PIN = ${findPin('pir.out', 2)};\nconst int BUZZER_PIN = ${findPin('buzzer.signal', 8)};\nconst int LED_PIN = ${findPin('led.anode', 7)};\nconst int SERVO_PIN = ${findPin('servo.signal', 9)};\n`,
    sourceNodes: COMMON_SOURCE_NODES,
    targetNodes: COMMON_TARGET_NODES,
    expectedConnections: seed.referenceConnections,
    correctAnswer: JSON.stringify(seed.requiredKeywords),
  };
}

export function getEasyMcqBank(): McqSeed[] {
  return EASY_MCQ_SEEDS.slice(0, 50);
}

export function getHardMcqBank(): McqSeed[] {
  return getEasyMcqBank().map((seed, index) => ({
    ...seed,
    title: `Applied ${index + 1}: ${seed.title}`,
    stem: `Practical check: ${seed.stem}`,
    difficulty: 'Hard',
  }));
}

export function getScenarioBank(): ScenarioSeed[] {
  return SCENARIO_SEEDS;
}

export function getConnectionQuestionBank(): ConnectionQuestionSeed[] {
  return CONNECTION_QUESTION_SEEDS;
}

export function getSnippetCodingQuestionBank(): SnippetCodingSeed[] {
  return SNIPPET_CODING_QUESTION_SEEDS;
}

export function buildRound1QuestionSet(): Omit<Round1Question, 'id' | 'created_at'>[] {
  const easyChosen = shuffle(getEasyMcqBank()).slice(0, 10).map(toMcqQuestion);
  const hardChosen = shuffle(getHardMcqBank()).slice(0, 10).map(toMcqQuestion);

  const mixedMcq = ensureMixedDifficulty(shuffle([...easyChosen, ...hardChosen]));

  const selectedScenarios = shuffle(SCENARIO_SEEDS).slice(0, 2);
  const scenarioQuestions = selectedScenarios.flatMap((s) => toScenarioQuestions(s));

  const connectionQuestions = shuffle(getConnectionQuestionBank()).slice(0, 2).map((seed) => toConnectionQuestion(seed));
  const snippetCodingQuestions = shuffle(getSnippetCodingQuestionBank()).slice(0, 2).map((seed) => toSnippetCodingQuestion(seed));

  const questionSet = [...mixedMcq, ...scenarioQuestions, ...connectionQuestions, ...snippetCodingQuestions];

  return questionSet.map((q, index) => ({
    ...q,
    section: index < 20 ? 'A' : index < 30 ? 'B' : index < 32 ? 'C' : 'D',
  }));
}

export function buildRound1QuestionBankForSqlite(): Omit<Round1Question, 'id' | 'created_at'>[] {
  const mcqAll = [
    ...getEasyMcqBank().map((q) => toMcqQuestion(q, 0)),
    ...getHardMcqBank().map((q) => toMcqQuestion(q, 0)),
  ];

  const scenarioAll = SCENARIO_SEEDS.flatMap((s) => toScenarioQuestions(s));
  const connection = getConnectionQuestionBank().map((seed) => toConnectionQuestion(seed));
  const snippetCoding = getSnippetCodingQuestionBank().map((seed) => toSnippetCodingQuestion(seed));

  return [...mcqAll, ...scenarioAll, ...connection, ...snippetCoding];
}
