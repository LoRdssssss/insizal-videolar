// Kullanım: node videos/motor/render.cjs videos/kapsuller/001-naocl.json [çıktı.mp4]
// Playwright (Chromium) her kareyi çizer, FFmpeg H.264 9:16 MP4 yapar. Ağ erişimi gerekmez.
const { chromium } = require("playwright");
const { spawn } = require("node:child_process");
const { readFileSync, renameSync } = require("node:fs");
const { resolve, basename } = require("node:path");
const { pathToFileURL } = require("node:url");
(async () => {

const FPS = 30;
const specPath = resolve(process.argv[2]);
const out = resolve(process.argv[3] || specPath.replace(/\.json$/, ".mp4"));
const spec = JSON.parse(readFileSync(specPath, "utf8"));
const here = __dirname;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.addInitScript((s) => { window.__spec = s; }, spec);
await page.goto(pathToFileURL(`${here}/oynatici.html`).href);
const total = await page.evaluate(() => window.__hazir);
const frames = Math.round(total * FPS);
const tmp = out.replace(/\.mp4$/, ".tmp.mp4");
const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
  "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", "-movflags", "+faststart", tmp], { stdio: ["pipe", "inherit", "inherit"] });
for (let i = 0; i < frames; i++) {
  const jpg = await page.evaluate(async (t) => { window.__seek(t); return document.getElementById("c").toDataURL("image/jpeg", 0.92); }, i / FPS);
  if (!ff.stdin.write(Buffer.from(jpg.split(",")[1], "base64"))) await new Promise((r) => ff.stdin.once("drain", r));
}
ff.stdin.end();
const code = await new Promise((r) => ff.on("close", r));
await browser.close();
if (code !== 0) process.exit(code);
renameSync(tmp, out);
console.log(`${basename(out)}: ${frames} kare, ${total.toFixed(1)} sn`);
})().catch((e) => { console.error(e); process.exit(1); });
