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
});
