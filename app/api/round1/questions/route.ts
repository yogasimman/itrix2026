import { NextRequest, NextResponse } from 'next/server';
import {
  getRound1Questions,
  getRound1Question,
  createRound1Question,
  clearRound1Questions,
  deleteRound1Question,
  startOrGetRound1Session,
  getRound1AssignedQuestions,
  getRound1Responses,
} from '@/lib/db';

type IoTDifficulty = "Easy" | "Medium" | "Hard";
type IoTType = "mcq" | "matching" | "component-matching" | "simulation";

function buildGeneratedPool() {
  const sectionFor = (idx: number): "A" | "B" | "C" | "D" => (["A", "B", "C", "D"] as const)[idx % 4];
  const optionIds = ["A", "B", "C", "D"];
  const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

  const generated: Array<{
    title: string;
    scenario: string;
    section: "A" | "B" | "C" | "D";
    difficulty: IoTDifficulty;
    type: IoTType;
    score: number;
    options?: Array<{ id: string; text: string }>;
    matchingPairs?: Array<{ id: string; left: string; right: string }>;
    correctAnswer?: string | string[];
    explanation: string;
    timeLimit: number;
  }> = [];

  const mcqTemplates = [
    {
      title: "MQTT QoS Strategy",
      scenario: "500 smart meters send readings every minute on unstable cellular links. Which QoS policy is most practical?",
      correct: "Use QoS 1 for meter telemetry and QoS 0 for non-critical heartbeat packets.",
      distractors: [
        "Use QoS 2 for all messages because it is always fastest and cheapest.",
        "Use QoS 0 for billing data because occasional loss does not matter.",
        "Disable retained messages and retries to reduce broker load.",
      ],
      explanation: "QoS 1 gives delivery assurance for important readings while QoS 0 minimizes overhead for non-critical messages.",
    },
    {
      title: "Edge Filtering Decision",
      scenario: "A vibration sensor floods the cloud with noisy spikes. What should be done first?",
      correct: "Apply edge-side smoothing and thresholding before publishing events.",
      distractors: [
        "Increase cloud polling frequency so noise averages out automatically.",
        "Store all raw spikes forever and only filter in dashboards.",
        "Lower sampling precision to one decimal place without filtering.",
      ],
      explanation: "Noise is cheapest to handle near the source and reduces bandwidth and false alerts.",
    },
    {
      title: "LoRaWAN Throughput Planning",
      scenario: "An agriculture deployment has 120 nodes on one gateway. Which change improves reliability most?",
      correct: "Stagger uplink intervals and use adaptive data rate to reduce collisions.",
      distractors: [
        "Force all nodes to SF12 and transmit every 10 seconds.",
        "Send larger payloads less often without duty-cycle checks.",
        "Disable confirmed uplinks for all safety-critical sensors.",
      ],
      explanation: "Staggered transmission and ADR are standard ways to avoid channel congestion in LoRaWAN.",
    },
    {
      title: "Gateway Outage Handling",
      scenario: "A remote gateway goes offline for 20 minutes daily due to power issues. What is best practice?",
      correct: "Buffer measurements locally and forward in batches after reconnect.",
      distractors: [
        "Discard data during outages and recalculate values in cloud analytics.",
        "Restart all sensors every minute until the gateway returns.",
        "Duplicate every packet three times before each outage window.",
      ],
      explanation: "Store-and-forward maintains continuity and avoids unnecessary network storms.",
    },
    {
      title: "Battery Optimization",
      scenario: "Soil sensors must run 18 months on battery. Which action has the biggest impact?",
      correct: "Increase sleep duration and transmit only on meaningful value change.",
      distractors: [
        "Keep Wi-Fi always on and optimize only JSON payload field names.",
        "Raise sensor sample rate and compress data in cloud later.",
        "Use frequent status pings to guarantee low latency.",
      ],
      explanation: "Radio duty cycle dominates power usage; sleep and event-based transmit are key.",
    },
    {
      title: "Secure Provisioning",
      scenario: "A factory is onboarding 2,000 devices. Which onboarding flow is safest and scalable?",
      correct: "Issue per-device certificates and validate mutual TLS during registration.",
      distractors: [
        "Use one shared API key across all devices for easier support.",
        "Allow open provisioning for first 24 hours, then lock endpoint.",
        "Store plaintext credentials in firmware and rotate annually.",
      ],
      explanation: "Per-device identity limits blast radius and enables secure revocation.",
    },
    {
      title: "Telemetry Schema Evolution",
      scenario: "Firmware v2 adds new fields while v1 devices remain active. What should backend do?",
      correct: "Support backward-compatible schema parsing with version-tagged payloads.",
      distractors: [
        "Reject all v1 payloads immediately to simplify storage.",
        "Overwrite old fields at ingestion and guess missing values.",
        "Use separate databases per firmware minor version.",
      ],
      explanation: "Version-aware ingestion avoids service disruption during staged rollout.",
    },
    {
      title: "Alert Fatigue Reduction",
      scenario: "Ops team receives too many repetitive temperature alerts. What is the best fix?",
      correct: "Add alert suppression windows and hysteresis around thresholds.",
      distractors: [
        "Raise all thresholds by 10 degrees permanently.",
        "Send alerts only once per day regardless of severity.",
        "Disable alerts for sensors with frequent spikes.",
      ],
      explanation: "Hysteresis and suppression reduce noisy repeats while keeping critical alerts.",
    },
    {
      title: "OTA Safety Rollout",
      scenario: "A firmware update caused failures in the last deployment. What should be changed now?",
      correct: "Roll out in canary batches with health checks and rollback criteria.",
      distractors: [
        "Push to all devices at once to finish faster.",
        "Skip signature verification to reduce update time.",
        "Update only when battery is below 20% to test resilience.",
      ],
      explanation: "Canary rollout with rollback is standard for minimizing OTA blast radius.",
    },
    {
      title: "Data Retention Policy",
      scenario: "Storage cost is rising due to high-frequency telemetry. Which strategy is most balanced?",
      correct: "Retain raw data short-term and store long-term aggregates by interval.",
      distractors: [
        "Delete all historical telemetry older than 24 hours.",
        "Archive only alert events and ignore trend data.",
        "Keep everything raw indefinitely and buy more storage yearly.",
      ],
      explanation: "Tiered retention controls cost while preserving analytics value.",
    },
  ];

  mcqTemplates.forEach((item, idx) => {
    const shuffledOptions = shuffle([item.correct, ...item.distractors]);
    const options = shuffledOptions.map((text, i) => ({ id: optionIds[i], text }));
    const correctAnswer = options.find((o) => o.text === item.correct)?.id || "A";
    generated.push({
      title: item.title,
      scenario: item.scenario,
      section: sectionFor(idx),
      difficulty: "Medium",
      type: "mcq",
      score: 10,
      options,
      correctAnswer,
      explanation: item.explanation,
      timeLimit: 60,
    });
  });

  const matchingSets = [
    {
      title: "Protocol vs Use Case Mapping",
      scenario: "Match each protocol with the most suitable IoT communication pattern.",
      pairs: [
        ["MQTT", "Lightweight pub/sub telemetry messaging"],
        ["CoAP", "REST-like constrained device communication"],
        ["HTTP", "High-overhead web API integration"],
        ["LoRaWAN", "Long-range low-power field telemetry"],
      ],
    },
    {
      title: "Architecture Concept Mapping",
      scenario: "Match each architecture term with its operational meaning.",
      pairs: [
        ["Edge Computing", "Processing data near the sensor source"],
        ["Digital Twin", "Virtual representation of physical asset state"],
        ["Broker", "Intermediary routing messages between publishers and subscribers"],
        ["Time-series DB", "Optimized storage for timestamped measurements"],
      ],
    },
    {
      title: "Reliability Term Mapping",
      scenario: "Match each reliability practice with the correct definition.",
      pairs: [
        ["Retry Backoff", "Increasing delay between repeated attempts"],
        ["Idempotency", "Repeated requests produce same final state"],
        ["Dead Letter Queue", "Store failed messages for later inspection"],
        ["Health Check", "Periodic probe to validate service availability"],
      ],
    },
    {
      title: "Security Term Mapping",
      scenario: "Match each security mechanism with what it protects.",
      pairs: [
        ["Mutual TLS", "Authenticates both device and server"],
        ["Certificate Rotation", "Replaces credentials before expiration"],
        ["Secure Boot", "Prevents unauthorized firmware from running"],
        ["Signed OTA", "Verifies firmware integrity and publisher authenticity"],
      ],
    },
    {
      title: "Monitoring Metric Mapping",
      scenario: "Match each metric with the issue it helps detect.",
      pairs: [
        ["Packet Loss", "Unreliable network delivery"],
        ["Message Latency", "Slow end-to-end data propagation"],
        ["Battery Voltage Trend", "Impending power depletion"],
        ["Reconnect Count", "Link instability or broker reachability issues"],
      ],
    },
  ];

  matchingSets.forEach((set, idx) => {
    const pairs = set.pairs.map((p, i) => ({ id: String(i + 1), left: p[0], right: p[1] }));
    const answerMap: Record<string, string> = {};
    pairs.forEach((pair) => {
      answerMap[pair.id] = pair.id;
    });
    generated.push({
      title: `Match the Following: ${set.title}`,
      scenario: set.scenario,
      section: sectionFor(10 + idx),
      difficulty: "Medium",
      type: "matching",
      score: 10,
      matchingPairs: pairs,
      correctAnswer: JSON.stringify(answerMap),
      explanation: "A strong IoT engineer maps concepts to practical behavior quickly and accurately.",
      timeLimit: 75,
    });
  });

  const componentSets = [
    [
      ["DHT22", "Measures ambient temperature and humidity"],
      ["MQ-2", "Detects LPG/smoke concentration"],
      ["HC-SR04", "Measures distance using ultrasonic pulse timing"],
      ["ESP32", "Runs firmware and provides Wi-Fi/BLE connectivity"],
      ["Node-RED", "Creates visual data flows for processing and integration"],
    ],
    [
      ["BMP280", "Measures barometric pressure and temperature"],
      ["PIR Sensor", "Detects motion using infrared changes"],
      ["Soil Moisture Probe", "Measures water content in soil"],
      ["Relay Module", "Switches higher-power external loads"],
      ["OLED Display", "Shows local status or diagnostics"],
    ],
    [
      ["NTP Client", "Synchronizes device clock with reference time"],
      ["Watchdog Timer", "Resets firmware when it hangs"],
      ["EEPROM/Flash", "Persists settings across reboots"],
      ["ADC", "Converts analog sensor voltage to digital values"],
      ["PWM Output", "Controls actuators via duty-cycle modulation"],
    ],
    [
      ["RS-485 Transceiver", "Enables robust long-distance differential communication"],
      ["Current Sensor", "Measures current draw for load diagnostics"],
      ["Hall Sensor", "Detects magnetic field events and rotation"],
      ["Buck Converter", "Steps down voltage efficiently"],
      ["TVS Diode", "Protects inputs from voltage transients"],
    ],
    [
      ["Gateway", "Aggregates local node traffic to cloud/backhaul"],
      ["Message Queue", "Buffers asynchronous events between services"],
      ["Rules Engine", "Applies conditional logic to incoming telemetry"],
      ["Dashboard Widget", "Visualizes live and historical metrics"],
      ["Alert Webhook", "Pushes incident notifications to external systems"],
    ],
  ];

  componentSets.forEach((set, idx) => {
    const pairs = set.map((row, i) => ({ id: String(i + 1), left: row[0], right: row[1] }));
    const answerMap: Record<string, string> = {};
    pairs.forEach((pair) => {
      answerMap[pair.id] = pair.id;
    });
    generated.push({
      title: `Component Matching: Practical IoT Stack ${idx + 1}`,
      scenario: "Match each component/module with its primary role in an IoT deployment.",
      section: sectionFor(15 + idx),
      difficulty: "Medium",
      type: "component-matching",
      score: 10,
      matchingPairs: pairs,
      correctAnswer: JSON.stringify(answerMap),
      explanation: "Component-role alignment is fundamental for system design and troubleshooting.",
      timeLimit: 90,
    });
  });

  const simulationTemplates = [
    {
      title: "Cold-chain Alert Storm",
      scenario: "A logistics fleet reports 4x increase in temperature alerts after a firmware update. What should be first?",
      correct: "Validate sensor calibration offsets and compare pre/post firmware thresholds.",
      distractors: [
        "Silence all alerts until trucks return to depot.",
        "Increase alert frequency to catch more anomalies.",
        "Replace cloud database because alerts are high.",
      ],
      explanation: "Regression investigation starts with changed firmware behavior and threshold logic.",
    },
    {
      title: "Factory Packet Drops",
      scenario: "On a factory floor, packet loss peaks during shift changes. Which first step is best?",
      correct: "Correlate RF channel utilization and gateway CPU/network metrics by time window.",
      distractors: [
        "Move all sensors to max transmit power immediately.",
        "Switch every device to a different protocol overnight.",
        "Clear all retained messages on the broker.",
      ],
      explanation: "Time-correlated telemetry narrows whether the bottleneck is RF contention or gateway saturation.",
    },
    {
      title: "Smart Irrigation Misfire",
      scenario: "Valves trigger even when moisture is adequate. What should be checked first?",
      correct: "Audit rule-engine condition logic and moisture sensor calibration drift.",
      distractors: [
        "Increase pump motor voltage to stabilize valve operation.",
        "Disable telemetry uploads while irrigation is active.",
        "Reduce valve open duration to hide the issue.",
      ],
      explanation: "False actuations usually come from bad thresholds or drifting sensor inputs.",
    },
    {
      title: "Gateway Memory Leak",
      scenario: "Gateway restarts every few hours under peak load. What is the best immediate mitigation?",
      correct: "Enable circuit breakers and cap in-memory queue size while collecting heap diagnostics.",
      distractors: [
        "Disable logging permanently to free memory.",
        "Restart all field nodes whenever gateway restarts.",
        "Double message payload size to reduce packet count.",
      ],
      explanation: "Controlled backpressure plus diagnostics stabilizes service while root cause is investigated.",
    },
    {
      title: "Campus Occupancy Delay",
      scenario: "Occupancy dashboards show 7-minute delay during exams. Which action is most effective?",
      correct: "Trace end-to-end latency across ingestion, queue depth, and dashboard query intervals.",
      distractors: [
        "Reboot all occupancy sensors every hour.",
        "Disable historical storage to speed live tiles.",
        "Turn off deduplication to process duplicates faster.",
      ],
      explanation: "Only full-path latency tracing can locate the dominant delay stage.",
    },
    {
      title: "Device Clone Incident",
      scenario: "Security team detects cloned device IDs publishing abnormal traffic. What must happen first?",
      correct: "Revoke affected credentials and enforce per-device certificate validation.",
      distractors: [
        "Block all traffic from the same city IP range.",
        "Pause all telemetry ingestion until morning.",
        "Lower broker authentication timeout.",
      ],
      explanation: "Identity compromise is contained by credential revocation and stronger auth controls.",
    },
    {
      title: "Utility Meter Drift",
      scenario: "A subset of meters drift 3% from verified manual readings. What is the right first response?",
      correct: "Compare meter firmware version, calibration constants, and ADC reference stability.",
      distractors: [
        "Round all readings to nearest integer for consistency.",
        "Average each meter with nearby meters to reduce error.",
        "Change billing formula to tolerate drift.",
      ],
      explanation: "Measurement drift should be traced through firmware and calibration path before business-layer changes.",
    },
    {
      title: "Hospital BLE Interference",
      scenario: "Patient-tag BLE packets are intermittently missing near imaging rooms. Best first investigation?",
      correct: "Map packet loss heat zones and compare against known RF interference sources.",
      distractors: [
        "Increase tag transmission interval to every second globally.",
        "Disable encryption for BLE advertisements.",
        "Rebuild dashboards to improve packet visibility.",
      ],
      explanation: "Location-based interference analysis is the fastest path to targeted remediation.",
    },
    {
      title: "Energy Dashboard Mismatch",
      scenario: "Dashboard totals differ from billing export by 6%. What should be done first?",
      correct: "Verify aggregation window boundaries, timezone handling, and duplicate event suppression.",
      distractors: [
        "Reset all counters at midnight UTC regardless of site timezone.",
        "Delete outlier records before aggregation.",
        "Increase chart refresh rate to 1 second.",
      ],
      explanation: "Aggregation semantics and duplicate handling are common causes of reporting mismatch.",
    },
    {
      title: "Flood Sensor Offline Cluster",
      scenario: "All riverside nodes in one zone go offline after rain. What is the best first troubleshooting action?",
      correct: "Check zone power integrity, enclosure ingress logs, and gateway backhaul status.",
      distractors: [
        "Replace all batteries across the city immediately.",
        "Reduce sampling rate on unaffected zones.",
        "Disable offline alerts to avoid noise.",
      ],
      explanation: "Clustered outage indicates shared infrastructure or environmental failure in that zone.",
    },
  ];

  simulationTemplates.forEach((item, idx) => {
    const shuffledOptions = shuffle([item.correct, ...item.distractors]);
    const options = shuffledOptions.map((text, i) => ({ id: optionIds[i], text }));
    const correctAnswer = options.find((o) => o.text === item.correct)?.id || "A";
    generated.push({
      title: `Simulation: ${item.title}`,
      scenario: item.scenario,
      section: sectionFor(20 + idx),
      difficulty: "Medium",
      type: "simulation",
      score: 10,
      options,
      correctAnswer,
      explanation: item.explanation,
      timeLimit: 75,
    });
  });

  return generated;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');
    const questionId = searchParams.get('id');
    const participantId = searchParams.get('participantId');
    const action = searchParams.get('action');

    if (questionId) {
      const question = getRound1Question(parseInt(questionId));
      if (!question) {
        return NextResponse.json({ error: 'Question not found' }, { status: 404 });
      }
      return NextResponse.json({ question });
    }

    if (participantId && action === "start") {
      const session = startOrGetRound1Session(participantId, 30);
      const assignedQuestions = getRound1AssignedQuestions(participantId);
      const responses = getRound1Responses(participantId);

      return NextResponse.json({
        session,
        questions: assignedQuestions,
        responses,
      });
    }

    const questions = getRound1Questions(section || undefined);
    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error fetching Round 1 questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.action !== "generate_iot_pool") {
      return NextResponse.json(
        { error: "Manual Round 1 question entry is disabled. Use AI generation." },
        { status: 400 }
      );
    }

    const generated = buildGeneratedPool();
    clearRound1Questions();
    const inserted = generated.map((q) => createRound1Question(q));

    return NextResponse.json(
      {
        success: true,
        message: "AI question pool generated",
        questions: inserted,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating Round 1 question:', error);
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  return NextResponse.json(
    { error: "Manual Round 1 question editing is disabled. Regenerate AI pool instead." },
    { status: 400 }
  );
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Question ID is required' },
        { status: 400 }
      );
    }

    const success = deleteRound1Question(parseInt(id));
    if (!success) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting Round 1 question:', error);
    return NextResponse.json(
      { error: 'Failed to delete question' },
      { status: 500 }
    );
  }
}
