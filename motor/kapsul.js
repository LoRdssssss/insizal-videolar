// insizal kapsül motoru: JSON senaryo → 1080x1920 canvas. Zaman t verilince kare deterministik çizilir.
// Sahne türleri: soru, metin, cubuk, liste, not. Codex yalnız JSON yazar; burayı değiştirmez.
const W = 1080, H = 1920;
const C = { bg: "#0d1f1b", ink: "#f0f5f2", mint: "#7ed6b4", mute: "#96aaa3", warn: "#ffc46b", red: "#f27864", card: "#18322c", line: "#284a42" };
const ease = (x) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
const fade = (t, s, d = 0.5) => ease((t - s) / d);
const H1 = (s) => `700 ${s}px Bricolage`, B = (s, w = 500) => `${w} ${s}px Instrument`;

function txt(g, s, x, y, font, color, a = 1, align = "left") {
  g.globalAlpha = a; g.font = font; g.fillStyle = color; g.textAlign = align; g.textBaseline = "top"; g.fillText(s, x, y); g.globalAlpha = 1;
}
function wrap(g, s, x, y, font, color, a, maxW, lh, align = "left") {
  g.font = font; const words = String(s).split(" "); let line = "";
  for (const w of words) {
    if (g.measureText(line ? line + " " + w : w).width > maxW && line) { txt(g, line, x, y, font, color, a, align); y += lh; line = w; }
    else line = line ? line + " " + w : w;
  }
  txt(g, line, x, y, font, color, a, align); return y + lh;
}
const col = (k) => C[k] || C.ink;
function rrect(g, x, y, w, h, r, color, a = 1) { g.globalAlpha = a; g.fillStyle = color; g.beginPath(); g.roundRect(x, y, Math.max(0, w), h, r); g.fill(); g.globalAlpha = 1; }

function chrome(g, spec, idx, p) {
  const n = spec.sahneler.length, seg = (W - 160) / n;
  for (let i = 0; i < n; i++) {
    rrect(g, 80 + i * seg + 4, 70, seg - 8, 8, 4, i < idx ? C.mint : C.line);
    if (i === idx) rrect(g, 80 + i * seg + 4, 70, (seg - 8) * p, 8, 4, C.mint);
  }
  txt(g, `${(spec.brans || "").toLocaleUpperCase("tr")} · ${Math.round(total(spec))} SN`, 80, 110, B(30, 600), C.mute);
}

const SCENES = {
  soru(g, s, t) {
    let y = 330;
    if (s.ust) { txt(g, s.ust, 80, y, H1(150), C.mint, fade(t, 0)); y += 190; }
    (s.satirlar || []).forEach((l, i) => { txt(g, l, 80, y, H1(104), C.ink, fade(t, 0.3 + i * 0.2)); y += 125; });
    if (s.alt) wrap(g, s.alt, 80, y + 60, B(50), C.mute, fade(t, 1.2), 920, 70);
  },
  metin(g, s, t) {
    let y = 300;
    if (s.ust) { txt(g, s.ust, 80, y, B(52, 600), C.mute, fade(t, 0)); y += 90; }
    (s.satirlar || []).forEach((l, i) => { const last = i === s.satirlar.length - 1 && s.vurgu;
      txt(g, l, 80, y, H1(100), last ? C.warn : C.ink, fade(t, 0.2 + i * 0.15)); y += 120; });
    if (s.aciklama) y = wrap(g, s.aciklama, 80, y + 60, B(50), C.mute, fade(t, 1.2), 920, 70);
    (s.cipler || []).forEach((c, i) => { const a = fade(t, 1.8 + i * 0.25), x = 80 + i * 235, yy = y + 80 + (1 - a) * 40;
      rrect(g, x, yy, 215, 120, 28, C.card, a); txt(g, c, x + 107, yy + 40, B(38, 600), C.mint, a, "center"); });
  },
  cubuk(g, s, t) {
    txt(g, (s.ust || "").toLocaleUpperCase("tr"), 80, 280, B(36, 600), C.mute, fade(t, 0));
    wrap(g, s.baslik || "", 80, 340, H1(62), C.ink, fade(t, 0.2), 920, 74);
    const max = Math.max(...s.cubuklar.map((c) => c.deger)), bw = 480;
    s.cubuklar.forEach((c, i) => { const y = 560 + i * 230, st = 0.7 + i * 0.5, a = fade(t, st);
      txt(g, c.etiket, 80, y + 5, H1(64), C.ink, a);
      rrect(g, 330, y + 10, bw, 70, 35, C.card, a);
      rrect(g, 330, y + 10, bw * (c.deger / max) * ease((t - st - 0.3) / 1.5), 70, 35, col(c.renk), a);
      if (c.birim) txt(g, c.birim, 330 + bw + 20, y + 28, B(40, 600), C.mute, a);
      if (c.sonuc) txt(g, c.sonuc, 330, y + 100, B(40, 600), col(c.renk), fade(t, st + 1.8)); });
    if (s.vurgu) wrap(g, s.vurgu, 80, 560 + s.cubuklar.length * 230 + 40, H1(58), C.warn, fade(t, 3.6), 920, 76);
  },
  liste(g, s, t) {
    txt(g, s.baslik || "", 80, 300, H1(110), C.ink, fade(t, 0));
    let y = 520;
    (s.maddeler || []).forEach((m, i) => { const a = fade(t, 0.6 + i * 0.6), uyari = m.startsWith("!");
      g.globalAlpha = a; g.fillStyle = uyari ? C.warn : C.mint; g.beginPath(); g.arc(115, y + 35, 35, 0, Math.PI * 2); g.fill(); g.globalAlpha = 1;
      txt(g, uyari ? "!" : String(i + 1), 115, y + 12, H1(40), C.bg, a, "center");
      const ny = wrap(g, uyari ? m.slice(1).trim() : m, 190, y + 4, B(54, 600), C.ink, a, 810, 70); y = Math.max(y + 230, ny + 80); });
  },
  not(g, s, t) {
    let y = 760;
    if (s.ust) { txt(g, s.ust, W / 2, y - 100, B(48, 600), C.mute, fade(t, 0), "center"); }
    (s.satirlar || []).forEach((l, i) => { txt(g, l, W / 2, y, H1(76), i === s.satirlar.length - 1 ? C.warn : C.ink, fade(t, 0.2 + i * 0.2), "center"); y += 95; });
    txt(g, "insizal", W / 2, 1460, H1(96), C.mint, fade(t, 1.2), "center");
    txt(g, "diş hekimleri için kısa ve seçilmiş", W / 2, 1580, B(38), C.mute, fade(t, 1.4), "center");
  },
};

const total = (spec) => spec.sahneler.reduce((a, s) => a + s.sure, 0);

function draw(g, spec, t) {
  g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
  let start = 0;
  for (let i = 0; i < spec.sahneler.length; i++) {
    const s = spec.sahneler[i], local = t - start;
    if (local < s.sure || i === spec.sahneler.length - 1) {
      chrome(g, spec, i, Math.min(1, local / s.sure));
      (SCENES[s.tur] || SCENES.metin)(g, s, local);
      if (s.kaynak) txt(g, s.kaynak, 80, 1760, B(32), C.mute, fade(local, 1));
      const out = Math.min(1, (s.sure - local) / 0.25, i === 0 ? 1 : local / 0.2);
      if (out < 1) { g.globalAlpha = 1 - Math.max(0, out); g.fillStyle = C.bg; g.fillRect(0, 0, W, H); g.globalAlpha = 1; }
      return;
    }
    start += s.sure;
  }
}

window.kapsul = { W, H, draw, total };
