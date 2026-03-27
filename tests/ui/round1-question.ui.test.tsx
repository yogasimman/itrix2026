import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { Round1Question } from '@/components/round1-question';

describe('Round1Question UI', () => {
  it('renders mcq layout and options', () => {
    const onAnswerChange = vi.fn();

    const html = renderToStaticMarkup(
      <Round1Question
        question={{
          id: 1,
          type: 'mcq',
          title: 'GPIO Direction',
          scenario: 'What does OUTPUT mode do?',
          section: 'A',
          difficulty: 'Easy',
          score: 5,
          timeLimit: 60,
          options: [
            { id: 'A', text: 'Reads analog voltage' },
            { id: 'B', text: 'Produces digital signal' },
          ],
        }}
        questionNumber={1}
        totalQuestions={20}
        onAnswerChange={onAnswerChange}
        showNavigation={false}
      />
    );

    expect(html).toContain('GPIO Direction');
    expect(html).toContain('Produces digital signal');
    expect(html).toContain('Question 1 of 20');
  });

  it('renders connection segment with wiring guidance', () => {
    const onAnswerChange = vi.fn();

    const html = renderToStaticMarkup(
      <Round1Question
        question={{
          id: 31,
          type: 'connection-evaluation',
          title: 'Arduino Soil Sensor Wiring',
          scenario: 'Connect the sensor to Arduino pins.',
          section: 'C',
          difficulty: 'Hard',
          score: 10,
          timeLimit: 180,
          sourceNodes: ['SIG', 'VCC', 'GND'],
          targetNodes: ['A0', '5V', 'GND'],
          codeSnippet: 'const int SENSOR_PIN = A0;',
        }}
        questionNumber={1}
        totalQuestions={1}
        onAnswerChange={onAnswerChange}
        showNavigation={false}
      />
    );

    expect(html).toContain('Wokwi Components + Arduino Canvas');
    expect(html).toContain('Interactive drag-wiring view loads in browser runtime.');
    expect(html).toContain('Connect sensor pins to Arduino pins just like a wiring lab.');
  });

  it('renders snippet coding section with code input and execute control', () => {
    const onAnswerChange = vi.fn();

    const html = renderToStaticMarkup(
      <Round1Question
        question={{
          id: 41,
          type: 'snippet-coding',
          title: 'Basic Snippet Coding 1: Reverse From Wiring',
          scenario: 'Write a basic Arduino sketch using the given wiring map.',
          section: 'D',
          difficulty: 'Medium',
          score: 20,
          timeLimit: 300,
          sourceNodes: ['pir.out', 'buzzer.signal', 'led.anode', 'servo.signal'],
          targetNodes: ['arduino.d2', 'arduino.d8', 'arduino.d7', 'arduino.d9'],
          expectedConnections: [
            { from: 'pir.out', to: 'arduino.d2' },
            { from: 'buzzer.signal', to: 'arduino.d8' },
            { from: 'led.anode', to: 'arduino.d7' },
            { from: 'servo.signal', to: 'arduino.d9' },
          ],
          codeSnippet: 'const int PIR_PIN = 2;\nconst int BUZZER_PIN = 8;\nconst int LED_PIN = 7;\nconst int SERVO_PIN = 9;',
        }}
        questionNumber={1}
        totalQuestions={2}
        currentAnswer={'void setup() {}\nvoid loop() {}'}
        onAnswerChange={onAnswerChange}
        showNavigation={false}
      />
    );

    expect(html).toContain('Write Arduino snippet');
    expect(html).toContain('Execute Check');
    expect(html).toContain('Reference Wiring (read-only)');
  });
});
