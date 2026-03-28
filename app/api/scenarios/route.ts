import { NextResponse } from 'next/server';
import { getAllScenarios, getScenarioComponents, initializeDatabase, isInitialized } from '@/lib/db';
import { seedDatabase } from '@/lib/seed-data';

function ensureInitialized() {
  if (!isInitialized()) {
    initializeDatabase();
    seedDatabase();
  }
}

export async function GET() {
  try {
    ensureInitialized();
    const scenarios = getAllScenarios().map((scenario) => ({
      ...scenario,
      components: getScenarioComponents(scenario.id).map((component) => ({
        id: component.id,
        name: component.name,
        description: component.description,
        pinout: component.pinout,
        category: component.category,
      })),
    }));
    return NextResponse.json({ scenarios });
  } catch (error) {
    console.error('Error fetching scenarios:', error);
    return NextResponse.json({ error: 'Failed to fetch scenarios' }, { status: 500 });
  }
}
