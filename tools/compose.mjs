import { execFileSync } from 'node:child_process';

const REPO = '/root/makefun-work/makefun-gta6-meme-x-01/repo';
const OUT = process.argv[2] ?? `${REPO}/meme.png`;
const TMP = `${REPO}/tools/.build`;
execFileSync('mkdir', ['-p', TMP]);

const F = {
  serif: '/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf',
  serifb: '/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf',
  serifI: '/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf',
  sans: '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf',
  sansb: '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf',
  mono: '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf',
  monob: '/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf',
};
const C = {
  paper: '#FAF8F3',
  ink: '#191419',
  head: '#5A5359',
  magenta: '#BC0C7C',
  pale: '#FBE9F3',
  red: '#B8102B',
  band: '#F0E7E0',
  rule: '#CDC4BD',
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
function leader(label, amount, size, target) {
  let best = '';
  for (let n = 2; n <= 22; n++) {
    const candidate = `${label} ${'.'.repeat(n)} ${amount}`;
    if (textW(F.serif, size, candidate) <= target) best = candidate;
    else break;
  }
  if (!best) throw new Error(`leader failed: ${label}`);
  return best;
}

const ops = ['-size', '1200x800', `xc:${C.paper}`, '-gravity', 'NorthWest'];

function draw(shape, fill, stroke = 'none', strokewidth = 1) {
  ops.push('-fill', fill, '-stroke', stroke, '-strokewidth', String(strokewidth), '-draw', shape);
}
function text(font, size, value, x, y, color = C.ink, max = 1200 - x) {
  fit(font, size, value, max, `text ${x},${y}`);
  ops.push('-font', font, '-pointsize', String(size), '-fill', color, '-stroke', 'none', '-annotate', `+${x}+${y}`, value);
}
function centered(font, size, value, y, color = C.ink) {
  const w = fit(font, size, value, 1140, `center ${y}`);
  text(font, size, value, Math.round((1200 - w) / 2), y, color);
}
function rightText(font, size, value, right, y, color = C.ink) {
  const w = fit(font, size, value, right, `right ${right},${y}`);
  text(font, size, value, right - w, y, color);
}
function composite(file, x, y) {
  ops.push(file, '-geometry', `+${x}+${y}`, '-composite');
}

draw('rectangle 12,12 1187,787', 'none', C.rule, 1);
draw('rectangle 19,19 1180,780', 'none', C.rule, 1);

centered(F.serifb, 18, 'LEONIDA SILVER CIRCUIT COURT · DIVISION OF LONG-AWAITED RELEASES', 32, C.head);
draw('line 44,62 1156,62', C.ink, C.ink, 2);

centered(F.serifb, 72, 'CLASS ACTION SETTLED', 80);
centered(F.serifb, 34, 'FOR THE 4,811-DAY WAIT', 142, C.magenta);
centered(F.serifI, 26, 'GTA V 17 SEP 2013 → GTA VI 19 NOV 2026 · Jason & Lucia recover the full amount.', 188);
draw('line 44,230 1156,230', C.ink, C.ink, 2);

const items = [
  ['Wait-time interest', '$0.00'],
  ['Sick days drained', '$13.00'],
  ['Trailer replays', '$0.87'],
];
items.forEach(([label, amount], i) => {
  text(F.serif, 24, leader(label, amount, 24, 420), 44, 278 + i * 40);
});
draw('roundrectangle 40,404 492,468 6,6', C.pale, C.magenta, 2);
text(F.serifb, 28, 'TOTAL SETTLEMENT $481.10', 54, 424, C.magenta, 430);
text(F.serif, 14, 'Sick days non-refundable. Leonida law applies. No admission of liability.', 44, 682, C.head);

const cx = 470;
const cr = 930;
const ct = 268;
const cb = 660;
draw(`roundrectangle ${cx},${ct} ${cr},${cb} 10,10`, C.white, C.ink, 3);
draw(`rectangle ${cx + 8},${ct + 8} ${cr - 8},${ct + 52}`, C.band);
text(F.sansb, 21, 'LEONIDA FEDERAL PAYOUT BANK', cx + 18, ct + 20, C.ink, 420);
draw(`line ${cx + 18},${ct + 64} ${cr - 18},${ct + 64}`, C.rule, C.rule, 1);

text(F.serif, 16, 'PAY TO THE ORDER OF', cx + 18, ct + 78, C.head, 240);
text(F.sansb, 32, 'EVERYONE WHO WAITED', cx + 18, ct + 102, C.ink, 420);
draw(`line ${cx + 18},${ct + 136} ${cr - 18},${ct + 136}`, C.ink, C.ink, 2);

draw(`roundrectangle ${cr - 235},${ct + 144} ${cr - 18},${ct + 236} 8,8`, C.pale, C.magenta, 3);
text(F.sansb, 16, 'AMOUNT', cr - 218, ct + 152, C.magenta, 160);
text(F.sansb, 52, '$481.10', cr - 218, ct + 176, C.magenta, 210);

text(F.mono, 15, 'MEMO: PATIENCE 2013-2026', cx + 18, ct + 162, C.ink, 230);
text(F.mono, 14, 'SERIAL 0004811-VC', cx + 18, ct + 190, C.head, 220);

text(F.serif, 16, 'L. Silver, Clerk of Long-Awaited Releases', cx + 18, ct + 230, C.ink, 420);
draw(`line ${cx + 18},${ct + 256} ${cx + 290},${ct + 256}`, C.ink, C.ink, 2);

const stamp = `${TMP}/stamp.png`;
run(['-size', '380x116', `xc:${C.white}`, '-gravity', 'Center',
  '-fill', 'none', '-stroke', C.red, '-strokewidth', 7,
  '-draw', 'roundrectangle 6,6 373,109 10,10',
  '-stroke', 'none', '-font', F.sansb, '-fill', C.red,
  '-pointsize', '42', '-annotate', '+0-22', 'MY AI AGENT',
  '-pointsize', '42', '-annotate', '+0+24', 'ISSUED BY', stamp]);
composite(stamp, 535, 552);

const ghost = `${TMP}/ghost.png`;
run(['assets/ghost-judge-paddle.png', '-trim', '+repage', '-resize', 'x250', ghost]);
composite(ghost, 945, 375);

draw('rectangle 23,710 1176,782', C.magenta);
const mark = `${TMP}/mark.png`;
run(['assets/ghost-mark.png', '-trim', '+repage', '-resize', '46x46!', mark]);
composite(mark, 42, 723);
text(F.sansb, 25, 'PAID BY MY AI AGENT · make.fun bounty winnings', 104, 726, C.white, 760);
const lockup = `${TMP}/lockup.png`;
run(['assets/lockup.png', '-trim', '+repage', '-channel', 'RGB', '-fill', 'white', '-colorize', '100', '+channel', '-resize', 'x52', lockup]);
const lockW = Number(info([lockup, '-format', '%w', 'info:']));
composite(lockup, 1160 - lockW, 720);

ops.push(OUT);
run(ops);
console.log(`wrote ${OUT} ${info([OUT, '-format', '%wx%h %b', 'info:'])}`);
