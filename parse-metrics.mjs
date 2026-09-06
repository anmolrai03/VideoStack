// Usage: docker-compose logs worker | node parse-metrics.mjs
// Reads worker log lines from stdin, extracts [METRIC] completed events,
// and prints count/min/max/avg processing duration + peak queue depth.

import readline from 'readline';

const rl = readline.createInterface({ input: process.stdin });

const durations = [];
let peakQueueDepth = 0;

rl.on('line', (line) => {
  const completedMatch = line.match(/event=completed.*durationMs=(\d+)/);
  if (completedMatch) {
    durations.push(Number(completedMatch[1]));
  }

  const depthMatch = line.match(/queueDepth=(\d+)/);
  if (depthMatch) {
    const depth = Number(depthMatch[1]);
    if (depth > peakQueueDepth) peakQueueDepth = depth;
  }
});

rl.on('close', () => {
  if (durations.length === 0) {
    console.log('No completed job metrics found in input.');
    return;
  }
  const sum = durations.reduce((a, b) => a + b, 0);
  const avg = sum / durations.length;
  const min = Math.min(...durations);
  const max = Math.max(...durations);

  console.log(`Completed Count: ${durations.length}`);
  console.log(`Min durationMs: ${min}`);
  console.log(`Max durationMs: ${max}`);
  console.log(`Avg durationMs: ${avg.toFixed(2)}`);
  console.log(`Peak queueDepth: ${peakQueueDepth}`);
});