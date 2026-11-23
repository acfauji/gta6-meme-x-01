// gta6-meme-x-01 handoff: drop the repo's POST.json into the grader's output folder.
// No dependencies, no network calls — just a local file copy that exits zero on success.

const { copyFileSync, mkdirSync } = require('node:fs');
const { resolve } = require('node:path');

const sourceRoot = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputRoot = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function publishPostAddress() {
  mkdirSync(outputRoot, { recursive: true });
  const original = resolve(sourceRoot, 'POST.json');
  const delivered = resolve(outputRoot, 'POST.json');

  try {
    copyFileSync(original, delivered);
  } catch (problem) {
    console.error(`Could not deliver ${original}: ${problem.message}`);
    process.exit(1);
  }
}

publishPostAddress();
