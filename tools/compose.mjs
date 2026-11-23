import { execFileSync } from 'node:child_process';

const REPO = '/root/makefun-work/makefun-gta6-meme-x-01/repo';
const OUT = process.argv[2] ?? `${REPO}/meme.png`;
const TMP = `${REPO}/tools/.build`;
execFileSync('mkdir', ['-p', TMP]);

const F = {
  serif: '/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf',
  serifb: '/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf',
  serifi: '/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf',
  sansb: '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf',
  mono: '/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf',
  monob: '/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf',
};
const C = {
  paper: '#FAF8F3',
  ink: '#191419',
  magenta: '#BC0C7C',
  pale: '#FBE9F3',
  red: '#B4132F',
  gray: '#6B6470',
  rule: '#8F8891',
  faint: '#D8D2D6',
  white: '#FFFFFF',
};

function run(args) {
  execFileSync('magick', args, { maxBuffer: 64 * 1024 * 1024 });
}
function info(args) {
  return execFileSync('magick', args, { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 }).trim();
}
function textW(font, size, value) {
  return Number(info(['-font', font, '-pointsize', String(size), `label:${value}`, '-format', '%w', 'info:']));
}
function fit(font, size, value, max, where) {
  const w = textW(font, size, value);
  if (w > max) throw new Error(`${where}: ${w}px > ${max}px :: ${value}`);
  return w;
}

const ops = ['-size', '1200x800', `xc:${C.paper}`, '-gravity', 'NorthWest'];

function draw(shape, fill, stroke = 'none', strokewidth = 1) {
  ops.push('-fill', fill, '-stroke', stroke, '-strokewidth', String(strokewidth), '-draw', shape);
}
function text(font, size, value, x, y, color = C.ink, max = 1200 - x) {
  fit(font, size, value, max, `text ${x},${y}`);
  ops.push('-font', font, '-pointsize', String(size), '-fill', color, '-stroke', 'none', '-annotate', `+${x}+${y}`, value);
}
function centerText(font, size, value, y, color = C.ink) {
  const w = fit(font, size, value, 1128, `center ${y}`);
  text(font, size, value, Math.round((1200 - w) / 2), y, color);
}
function rightText(font, size, value, right, y, color = C.ink) {
  const w = fit(font, size, value, right, `right ${right},${y}`);
  text(font, size, value, right - w, y, color);
}
function composite(file, x, y) {
  ops.push(file, '-geometry', `+${x}+${y}`, '-composite');
}
function leader(x1, x2, y, color = C.rule, size = 18) {
  const dw = textW(F.mono, size, '.');
  const n = Math.floor((x2 - x1) / dw);
  if (n > 0) text(F.mono, size, '.'.repeat(n), x1, y, color);
}
function ledgerRow(description, amount, y, strong = false) {
  const start = 56;
  const amountRight = 920;
  const font = strong ? F.serifb : F.serif;
  const size = 20;
  const dw = text(font, size, description, start, y, C.ink, 440);
  const aw = textW(F.monob, size, amount);
  leader(start + dw + 9, amountRight - aw - 9, y + 1);
  rightText(F.monob, size, amount, amountRight, y, C.ink);
}

// Page frame, engraved double rule.
draw('rectangle 14,14 1186,786', 'none', C.ink, 3);
draw('rectangle 20,20 1180,780', 'none', C.ink, 1);

// Masthead.
text(F.serifb, 26, 'LEONIDA SILVER CIRCUIT COURT', 36, 32, C.ink, 560);
text(F.serif, 15, 'CLAIMS DIVISION — CLASS ACTION SETTLEMENT', 36, 68, C.gray, 560);
rightText(F.serifb, 20, 'STATEMENT OF ACCOUNT', 1164, 30, C.ink);
rightText(F.serif, 15, 'CASE NO. VC-13-4811', 1164, 58, C.gray);
rightText(F.serif, 15, 'FILED: 19 NOV 2026', 1164, 80, C.gray);
draw('line 36,106 1164,106', C.ink, C.ink, 3);
draw('line 36,111 1164,111', C.rule, C.rule, 1);

// Caption and matter heading.
centerText(F.serifb, 44, 'SETTLEMENT RECEIPT', 124, C.ink);
centerText(F.serifi, 24, 'In re: the 4,811-day wait for GTA VI — Jason & Lucia', 182, C.magenta);
draw('line 36,218 1164,218', C.rule, C.rule, 1);

// Parties.
draw('line 600,230 600,300', C.faint, C.faint, 1);
text(F.sansb, 15, 'TO:', 36, 228, C.magenta, 100);
text(F.serifb, 18, 'EVERYONE WHO WAITED 4,811 DAYS', 36, 252, C.ink, 540);
text(F.serif, 15, '(EVERY PERSON · 17 SEP 2013 → 19 NOV 2026)', 36, 278, C.gray, 540);
text(F.sansb, 15, 'RESPONDENT:', 620, 228, C.magenta, 200);
text(F.serifb, 18, 'ROCKSTAR GAMES', 620, 252, C.ink, 520);
text(F.serif, 15, '("Fall 2025", "May 2026", 214 GB download)', 620, 278, C.gray, 520);
draw('line 36,306 1164,306', C.ink, C.ink, 2);

// Schedule heading.
draw('rectangle 36,314 1164,344', C.pale);
draw('rectangle 36,314 1164,344', 'none', C.magenta, 1);
text(F.serifb, 16, 'SCHEDULE A — ITEMIZED CLAIM ALLOWANCES', 48, 321, C.magenta, 700);
rightText(F.serif, 14, 'EXHIBIT A · PAGE 1 OF 1', 1152, 322, C.gray);

// Itemized ledger.
ledgerRow('Waiting time · 4,811 days @ $0.01/day', '$48.11', 356);
ledgerRow('Emotional support, "Fall 2025" delay', '$13.00', 383);
ledgerRow('Therapy, "May 2026" delay', '$69.69', 410);
ledgerRow('Trailer replays · 87 × $0.01', '$0.87', 437);
ledgerRow('Controller damage · thrown 17 SEP 2013', '$69.99', 464);
ledgerRow('Lost wages · sick day on launch week', '$250.00', 491);
ledgerRow('Cleaning · 13 years of pizza boxes', '$13.00', 518);
ledgerRow('Alligator removal · Vice City pool', '$25.00', 545);
draw('line 36,568 920,568', C.rule, C.rule, 1);
ledgerRow('SUBTOTAL', '$489.66', 575, true);
ledgerRow('Less: paid by my AI agent (make.fun bounties)', '−$489.66', 602);

// Total due panel.
draw('rectangle 36,626 920,686', C.pale, C.magenta, 2);
draw('rectangle 36,626 44,686', C.magenta);
text(F.serifb, 34, 'TOTAL DUE', 60, 632, C.magenta, 300);
leader(266, 760, 652, C.magenta, 20);
rightText(F.serifb, 40, '$0.00', 900, 630, C.magenta);
text(F.sansb, 14, 'STATUS: PAID IN FULL', 764, 664, C.magenta, 156);

// Clerk's column and desk line, drawn behind the mascot.
draw('line 940,352 940,700', C.faint, C.faint, 1);
text(F.sansb, 13, 'CLERK OF COURT', 950, 356, C.gray, 200);
draw('line 950,652 1170,652', C.rule, C.rule, 2);
const ghost = `${TMP}/clerk.png`;
run(['assets/ghost-judge-paddle.png', '-trim', '+repage', '-resize', 'x232', ghost]);
const ghostW = Number(info([ghost, '-format', '%w', 'info:']));
const ghostX = 1164 - ghostW;
composite(ghost, ghostX, 424);
draw(`roundrectangle ${ghostX + 12},660 ${1164 - 12},688 4,4`, C.white, C.rule, 1);
const tagW = textW(F.sansb, 15, 'G. CLERK');
text(F.sansb, 15, 'G. CLERK', Math.round((ghostX + 1164 - tagW) / 2), 665, C.ink);

// Rotated rubber stamp, centered over the total panel's dotted leader.
const stamp = `${TMP}/stamp.png`;
run(['-size', '296x76', 'xc:none', '-gravity', 'Center',
  '-fill', 'none', '-stroke', C.red, '-strokewidth', '5',
  '-draw', 'roundrectangle 5,5 290,70 8,8',
  '-strokewidth', '2', '-draw', 'roundrectangle 12,12 283,63 5,5',
  '-stroke', 'none', '-font', F.serifb, '-fill', C.red,
  '-pointsize', '30', '-annotate', '+0+0', 'PAID IN FULL', stamp]);
const stampRot = `${TMP}/stamp-rot.png`;
run([stamp, '-background', 'none', '-rotate', '-8', stampRot]);
const stampW = Number(info([stampRot, '-format', '%w', 'info:']));
const stampH = Number(info([stampRot, '-format', '%h', 'info:']));
composite(stampRot, Math.round(620 - stampW / 2), Math.round(646 - stampH / 2));

// Fine print and postage bar.
text(F.serif, 14, 'No admission of liability. Processing time: 4,811 days. Sick days non-refundable. Leonida law applies.', 36, 702, C.gray, 700);
draw('rectangle 24,724 1176,776', C.magenta);
const mark = `${TMP}/mark.png`;
run(['assets/ghost-mark.png', '-trim', '+repage', '-resize', '38x38!', mark]);
composite(mark, 36, 733);
text(F.serifb, 24, 'PAID BY MY AI AGENT · make.fun bounty winnings', 84, 737, C.white, 900);
const lockup = `${TMP}/lockup.png`;
run(['assets/lockup.png', '-trim', '+repage', '-channel', 'RGB', '-fill', 'white', '-colorize', '100', '+channel', '-resize', 'x44', lockup]);
const lockW = Number(info([lockup, '-format', '%w', 'info:']));
composite(lockup, 1140 - lockW, 731);

ops.push(OUT);
run(ops);
execFileSync('rm', ['-rf', TMP]);
console.log(`wrote ${OUT} ${info([OUT, '-format', '%wx%h %b', 'info:'])}`);
