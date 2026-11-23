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
  ink: '#17121A',
  paper: '#F7F3E8',
  band: '#EFE8D8',
  magenta: '#C41C83',
  deep: '#BC0C7C',
  pale: '#FCE9F4',
  red: '#C0102B',
  rule: '#CBBFA9',
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
function wrap(font, size, value, max) {
  const lines = [];
  let line = '';
  for (const word of value.split(/\s+/)) {
    const trial = line ? `${line} ${word}` : word;
    if (line && textW(font, size, trial) > max) {
      fit(font, size, line, max, 'wrap');
      lines.push(line);
      line = word;
    } else {
      line = trial;
    }
  }
  if (line) lines.push(line);
  lines.forEach((l, i) => fit(font, size, l, max, `wrap line ${i}`));
  return lines;
}
function leader(label, amount, size, target) {
  let best = '';
  for (let n = 2; n <= 26; n++) {
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
  const w = fit(font, size, value, 1160, `center ${y}`);
  text(font, size, value, Math.round((1200 - w) / 2), y, color);
}
function rightText(font, size, value, right, y, color = C.ink) {
  const w = fit(font, size, value, right, `right ${right},${y}`);
  text(font, size, value, right - w, y, color);
}
function composite(file, x, y) {
  ops.push(file, '-geometry', `+${x}+${y}`, '-composite');
}

draw('rectangle 0,0 1199,15', C.ink);
draw('rectangle 0,785 1199,799', C.ink);
draw('rectangle 16,16 1183,783', C.paper, C.ink, 3);
draw('rectangle 23,23 1176,776', C.paper, C.rule, 1);

centered(F.serifb, 28, 'LEONIDA SILVER CIRCUIT COURT', 34);
centered(F.sans, 13, 'D I V I S I O N   O F   L O N G - A W A I T E D   R E L E A S E S', 70);
draw('line 44,94 1156,94', C.ink, C.ink, 2);
text(F.mono, 14, 'CASE NO. VC-13-4811', 44, 106, C.ink, 300);
rightText(F.mono, 14, 'FILED: 19 NOV 2026', 1156, 106);

centered(F.serifb, 44, 'NOTICE OF CLASS ACTION SETTLEMENT', 132);
centered(F.serifI, 21, 'In re: the 13-year wait for Grand Theft Auto VI', 184, C.magenta);
draw('line 44,214 1156,214', C.ink, C.ink, 2);

const noticeX = 44;
const noticeMax = 386;
const intro = wrap(F.serif, 19,
  'TO: EVERY PERSON who waited 4,811 days from GTA V (17 SEP 2013) to GTA VI (19 NOV 2026). The Court finds the delays — Fall 2025, May 2026, a 214 GB download and 87 trailer replays — unreasonable, and orders the following relief:',
  noticeMax);
intro.forEach((line, i) => text(F.serif, 19, line, noticeX, 228 + i * 24, C.ink, noticeMax));

const headingY = 228 + intro.length * 24 + 12;
text(F.sansb, 18, 'FINDINGS & DAMAGES', noticeX, headingY, C.ink, noticeMax);
draw(`line ${noticeX},${headingY + 17} ${noticeX + noticeMax},${headingY + 17}`, C.rule, C.rule, 1);

const findings = [
  ['Childhood spent on COMING SOON', '$13.00'],
  ['214 GB download anxiety', '$69.69'],
  ['Console held hostage during install', '$4.81'],
  ['87 trailer replays', '$0.87'],
  ['Therapy for the Fall 2025 era', '$13.00'],
  ['Interest on 4,811 days @ 0.00%', '$0.00'],
];
findings.forEach(([label, amount], i) => {
  const line = leader(label, amount, 20, noticeMax);
  text(F.serif, 20, line, noticeX, headingY + 34 + i * 26, C.ink, noticeMax);
});

const totalY = headingY + 34 + findings.length * 26 + 10;
draw(`roundrectangle ${noticeX - 4},${totalY} ${noticeX + noticeMax + 4},${totalY + 54} 7,7`, C.pale, C.magenta, 2);
text(F.monob, 24, 'TOTAL SETTLEMENT  $481.10', noticeX + 12, totalY + 15, C.deep, noticeMax - 16);

text(F.serif, 15, 'No admission of liability. Leonida law applies.', noticeX, totalY + 66, C.ink, noticeMax);
text(F.serif, 15, 'Processing time: 4,811 days.', noticeX, totalY + 88, C.ink, noticeMax);

draw('line 448,228 448,690', C.rule, C.rule, 1);

const cx = 460;
const cr = 984;
const ct = 232;
const cb = 650;
draw(`roundrectangle ${cx},${ct} ${cr},${cb} 14,14`, 'white', C.ink, 3);
draw(`roundrectangle ${cx + 7},${ct + 7} ${cr - 7},${cb - 7} 10,10`, 'none', '#E8C9DC', 1);
draw(`rectangle ${cx + 8},${ct + 8} ${cr - 8},${ct + 42}`, C.band);
text(F.sansb, 16, 'LEONIDA FEDERAL PAYOUT BANK', cx + 18, ct + 18, C.ink, 360);
rightText(F.mono, 12, 'NO. VC-4811', cr - 18, ct + 20);
draw(`line ${cx + 18},${ct + 52} ${cr - 18},${ct + 52}`, C.rule, C.rule, 1);

const payLine = 'PAY TO THE ORDER OF EVERYONE WHO WAITED';
text(F.sansb, 20, payLine, cx + 18, ct + 64, C.ink, cr - cx - 36);
draw(`line ${cx + 18},${ct + 96} ${cr - 18},${ct + 96}`, C.ink, C.ink, 2);

draw(`roundrectangle ${cr - 186},${ct + 102} ${cr - 18},${ct + 168} 6,6`, C.pale, C.magenta, 2);
text(F.sansb, 12, 'AMOUNT', cr - 176, ct + 110, C.deep, 150);
text(F.monob, 30, '$481.10', cr - 176, ct + 128, C.deep, 156);
text(F.serifI, 19, 'Payable on release day.', cx + 18, ct + 122, C.ink, 290);

text(F.mono, 16, 'MEMO: PATIENCE · 2013–2026', cx + 18, ct + 190, C.ink, 320);
rightText(F.monob, 15, 'SERIAL 0004811-VC', cr - 18, ct + 191);

text(F.serif, 21, 'L. Silver, Clerk of Long-Awaited Releases', cx + 18, ct + 257, C.ink, 440);
draw(`line ${cx + 18},${ct + 286} ${cx + 282},${ct + 286}`, C.ink, C.ink, 2);
text(F.sans, 13, 'AUTHORIZED SIGNATURE', cx + 18, ct + 294, C.ink, 240);

draw(`rectangle ${cx + 8},${cb - 34} ${cr - 8},${cb - 8}`, C.band);
text(F.monob, 14, 'VOID AFTER 4,811 DAYS', cx + 18, cb - 27, C.ink, 300);

const stampBase = `${TMP}/stamp-base.png`;
run(['-size', '168x60', 'xc:none', '-gravity', 'Center',
  '-fill', 'none', '-stroke', C.red, '-strokewidth', 3,
  '-draw', 'roundrectangle 3,3 164,56 8,8',
  '-stroke', 'none', '-font', F.sansb, '-fill', C.red,
  '-pointsize', '17', '-annotate', '+0-8', 'MY AI AGENT',
  '-pointsize', '15', '-annotate', '+0+13', 'ISSUED BY', stampBase]);
const stampRot = `${TMP}/stamp-rot.png`;
run([stampBase, '-background', 'none', '-rotate', '-10', stampRot]);
const stampW = Number(info([stampRot, '-format', '%w', 'info:']));
composite(stampRot, cr - stampW - 12, ct + 288);

const clerk = `${TMP}/clerk.png`;
run(['assets/ghost-judge-paddle.png', '-trim', '+repage', '-flop', '-resize', '184x218!', clerk]);
composite(clerk, 994, 328);

draw('rectangle 23,700 1176,782', C.magenta);
const mark = `${TMP}/mark.png`;
run(['assets/ghost-mark.png', '-trim', '+repage', '-resize', '52x52!', mark]);
composite(mark, 44, 715);
text(F.sansb, 26, 'PAID BY MY AI AGENT · make.fun bounty winnings', 110, 721, 'white', 770);
const lockup = `${TMP}/lockup.png`;
run(['assets/lockup.png', '-trim', '+repage', '-channel', 'RGB', '-fill', 'white', '-colorize', '100', '+channel', '-resize', '250x', lockup]);
const lockH = Number(info([lockup, '-format', '%h', 'info:']));
composite(lockup, 900, 700 + Math.round((82 - lockH) / 2));

ops.push(OUT);
run(ops);
console.log(`wrote ${OUT} ${info([OUT, '-format', '%wx%h %b', 'info:'])}`);
