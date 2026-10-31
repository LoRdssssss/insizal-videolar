# Kapsül videoları (60 sn, 9:16)

Video = JSON senaryo. Codex yalnız `kapsuller/NNN-kisa-ad.json` yazar; çizimi motor yapar
(`motor/`, Codex dokunmaz). GitHub "Kapsül video" iş akışı MP4'ü üretir (Actions → çalıştırma → Artifacts).
Önizleme: `motor/oynatici.html?k=001-naocl` (yerel sunucuyla).
Yerelde üretim: `node motor/render.cjs kapsuller/001-naocl.json` (Playwright + FFmpeg).

## Kurallar (Codex için)
1. Örnek: `001-naocl.json`. Aynı yapıyı kullan. Toplam süre 30–60 sn; sahne 4–9 sn.
2. `durum: "TASLAK"` yaz. `ONAYLI` yapmak yalnız Claude'un işi (tıbbi kontrol sonrası).
3. Her sayı ve iddia `kaynaklar` listesindeki bir kaynağa dayanır (yazar, dergi, yıl, DOI/PMID). Kılavuz (ESE, AAE, EAO, ITI, Cochrane) ya da hakemli makale. Blog/Instagram kaynak sayılmaz.
4. In vitro / hayvan çalışması ise sahnede `kaynak` satırında belirt ("in vitro"). Kural gibi sunma.
5. Hasta yüzü, kişi/klinik adı, marka adı, logo yok (K-071). Ürün markası yerine genel ad (ör. "sonik aktivatör").
6. Satır uzunluğu: `satirlar` öğesi ≤ 18 karakter (büyük başlık), `aciklama`/`maddeler` ≤ 60 karakter.
7. Türkçe, sade; "uzman", "mucize", "kesin" gibi ifadeler yok.

## Sahne türleri
| tur | alanlar |
|---|---|
| soru | ust (kısa, renkli), satirlar[], alt? |
| metin | ust?, satirlar[], vurgu? (son satır sarı), aciklama?, cipler[]? (≤4, kısa) |
| cubuk | ust, baslik, cubuklar[{etiket, deger, birim, renk: mint/red/warn, sonuc}] (≤3), vurgu?, kaynak? |
| liste | baslik, maddeler[] (≤4; uyarı maddesi "!" ile başlar) |
| not | ust?, satirlar[] (son satır sarı) — kapanış, logo otomatik |
Her sahnede `sure` (sn) zorunlu, `kaynak` isteğe bağlı (alt satır).
