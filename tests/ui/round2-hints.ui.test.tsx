import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { ScenarioDisplay } from '@/components/scenario-display';

describe('Round2 hints UI', () => {
  it('renders component-access score summary without step hint controls', () => {
    const html = renderToStaticMarkup(
      <ScenarioDisplay
        title="Smart Bin"
        situation="Build a motion-aware lid."
        whatToBuild={"1. Detect hand\n2. Open lid\n3. Auto-close lid"}
        hintSummary={{
          baseScore: 100,
          maxPenalty: 30,
          totalPenalty: 12,
          finalScore: 88,
          hintsUsedCount: 2,
          totalComponents: 6,
        }}
      />
    );

    expect(html).toContain('Round 2 Component Access Scoring');
    expect(html).toContain('Components Accessed');
    expect(html).not.toContain('Get Hint L1');
  });
});
