import { execFileSync } from 'node:child_process';

const REPO = '/root/makefun-work/makefun-gta6-meme-x-01/repo';
const OUT = process.argv[2] ?? `${REPO}/meme.png`;
const TMP = `${REPO}/tools/.build`;
execFileSync('mkdir', ['-p', TMP]);

const F = {
  sans: '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf',
  sansb: '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf',
  serifb: '/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf',
  mono: '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf',
};
const C = {
  body: '#EEF1F5',
  navy: '#11141B',
  ink: '#191419',
  white: '#FFFFFF',
  magenta: '#BC0C7C',
  pale: '#FBE9F3',
  red: '#C21030',
  green: '#2FBF71',
  gray: '#667085',
  border: '#D3DAE4',
  panel: '#E6EBF2',
  desk: '#C9D2DF',
  deskEdge: '#AAB6C6',
  deskFront: '#DAE1EB',
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

const ops = ['-size', '1200x800', `xc:${C.body}`, '-gravity', 'NorthWest'];

function draw(shape, fill, stroke = 'none', strokewidth = 1) {
  ops.push('-fill', fill, '-stroke', stroke, '-strokewidth', String(strokewidth), '-draw', shape);
}
function text(font, size, value, x, y, color = C.ink, max = 1200 - x) {
  fit(font, size, value, max, `text ${x},${y}`);
  ops.push('-font', font, '-pointsize', String(size), '-fill', color, '-stroke', 'none', '-annotate', `+${x}+${y}`, value);
}
function rightText(font, size, value, right, y, color = C.ink) {
  const w = fit(font, size, value, right, `right ${right},${y}`);
  text(font, size, value, right - w, y, color);
}
function composite(file, x, y) {
  ops.push(file, '-geometry', `+${x}+${y}`, '-composite');
}

draw('rectangle 0,0 1200,84', C.navy);
text(F.sansb, 28, 'LEONIDA HELP DESK · TICKET #GTA-VI-4811', 28, 28, C.white, 800);
draw(`circle 875,45 883,45`, C.green, C.green, 1);
rightText(F.sansb, 28, 'STATUS: RESOLVED', 1172, 28, C.white);

draw('roundrectangle 24,100 1176,268 16,16', C.magenta);
draw('roundrectangle 32,108 1168,260 12,12', 'none', '#D6419B', 1);
text(F.sansb, 76, 'PAID — $481.10', 52, 190, C.white, 600);

const stamp = `${TMP}/stamp.png`;
run(['-size', '470x132', `xc:${C.white}`, '-gravity', 'Center',
  '-fill', 'none', '-stroke', C.red, '-strokewidth', '8',
  '-draw', 'roundrectangle 5,5 464,126 10,10',
  '-strokewidth', '2', '-draw', 'roundrectangle 13,13 456,118 7,7',
  '-stroke', 'none', '-font', F.serifb, '-fill', C.red,
  '-pointsize', '26', '-annotate', '+0-36', 'SETTLED —',
  '-pointsize', '38', '-annotate', '+0+6', 'MY AI AGENT',
  '-pointsize', '22', '-annotate', '+0+38', 'ISSUED BY', stamp]);
const stampRot = `${TMP}/stamp-rot.png`;
run([stamp, '-background', 'none', '-rotate', '-3', stampRot]);
composite(stampRot, 652, 110);

draw('roundrectangle 24,284 900,676 14,14', C.white, C.border, 2);
draw('roundrectangle 912,284 1176,676 14,14', C.panel, C.border, 2);

const rows = [
  ['SUBJECT', 'Your 13-year wait for GTA VI (2013 → 2026)'],
  ['CLASS', 'Everyone who waited 4,811 days · Jason & Lucia included'],
  ['RESOLUTION', 'Settlement check issued · $481.10 · to EVERYONE WHO WAITED'],
];
rows.forEach(([label, value], i) => {
  const y = 344 + i * 100;
  text(F.sansb, 18, label, 48, y, C.magenta, 300);
  text(F.sansb, 26, value, 48, y + 34, C.ink, 828);
  if (i === 0) draw('line 48,410 876,410', C.border, C.border, 1);
  if (i === 1) draw('line 48,510 876,510', C.border, C.border, 1);
});
text(F.serifb, 26, 'ISSUED BY MY AI AGENT · make.fun', 48, 614, C.ink, 828);

draw('roundrectangle 920,584 1168,668 6,6', C.deskFront, C.border, 1);
const ghost = `${TMP}/ghost.png`;
run(['assets/ghost-judge-paddle.png', '-trim', '+repage', '-resize', 'x250', ghost]);
composite(ghost, 938, 318);
draw('roundrectangle 916,560 1172,586 6,6', C.desk, C.deskEdge, 1);
draw('roundrectangle 972,600 1116,640 6,6', C.white, C.border, 1);
text(F.sansb, 20, 'G. CLERK', 994, 628, C.ink, 110);

text(F.sans, 18, 'Delays "Fall 2025" and "May 2026" considered · no admission of liability · Leonida law applies.', 28, 704, C.gray, 1140);

draw('rectangle 0,730 1200,800', C.magenta);
const mark = `${TMP}/mark.png`;
run(['assets/ghost-mark.png', '-trim', '+repage', '-resize', '48x48!', mark]);
composite(mark, 32, 741);
text(F.serifb, 28, 'PAID BY MY AI AGENT · make.fun bounty winnings', 96, 772, C.white, 880);
const lockup = `${TMP}/lockup.png`;
run(['assets/lockup.png', '-trim', '+repage', '-channel', 'RGB', '-fill', 'white', '-colorize', '100', '+channel', '-resize', 'x52', lockup]);
const lockW = Number(info([lockup, '-format', '%w', 'info:']));
composite(lockup, 1160 - lockW, 739);

ops.push(OUT);
run(ops);
console.log(`wrote ${OUT} ${info([OUT, '-format', '%wx%h %b', 'info:'])}`);
