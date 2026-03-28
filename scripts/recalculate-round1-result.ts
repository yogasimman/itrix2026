import { createRound1Result, getAllParticipants } from "../lib/db";

const query = process.argv.slice(2).join(" ").trim().toLowerCase();
if (!query) {
  console.error("Usage: tsx scripts/recalculate-round1-result.ts <team-or-name>");
  process.exit(1);
}

const participants = getAllParticipants();
const targets = participants.filter((participant) => {
  const name = (participant.name || "").toLowerCase();
  const team = (participant.team_name || "").toLowerCase();
  return name.includes(query) || team.includes(query);
});

if (targets.length === 0) {
  console.error(`No participants found matching "${query}".`);
  process.exit(1);
}

console.log(`Recalculating Round 1 results for ${targets.length} participant(s)...`);

for (const participant of targets) {
  try {
    const result = createRound1Result(participant.id);
    console.log(
      `${participant.id} (${participant.name}) -> score ${result.total_score}, correct ${result.correct_answers}`
    );
  } catch (error) {
    console.error(`Failed to recalculate ${participant.id}:`, error);
  }
}
