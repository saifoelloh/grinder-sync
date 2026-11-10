# GrindSync

**GrindSync** adalah web-app kalkulator dan translator ukuran gilingan kopi (*cross-grinder click & micron translator*) dengan desain monokrom dan ergonomi *Mobile Thumb-Zone*.

## Fitur Utama
- **Cross-Grinder Translation:** Menerjemahkan setelan klik dari satu grinder referensi ke grinder tujuan menggunakan jembatan ukuran partikel mikron ($\mu\text{m}$)[cite: 1].
- **Mechanical Step-Snapping:** Mendukung berbagai format skala klik fisik:
  - *3-Part (`Rotation.Number.Tick`)* — contoh: **1Zpresso K-Ultra** (`0 – 760 μm`)[cite: 1]
  - *2-Part (`Number.Click`)* — contoh: **1Zpresso ZP6 Special** (`240 – 1050 μm`)[cite: 1]
  - *Half-Step Dial (`0.5`)* — contoh: **Timemore Sculptor 078** (`370 – 1270 μm`)[cite: 1]
  - *Decimal Sub-Clicks (`0 – 16`)* — contoh: **Timemore C5 Pro** (`0 – 950 μm`)[cite: 1]
  - *Standard Clicks from Zero* — contoh: **Comandante C40 MK4** (`0 – 1090 μm`)[cite: 1]
- **Brew Method Sweet-Spot Indicator:** Memvalidasi apakah ukuran gilingan masuk ke dalam rentang metode seduh (*V60, Espresso, Pour Over, Aeropress, French Press*, dll.)[cite: 1].
- **Thumb-Zone Mobile Architecture (`100dvh`):** Hasil konversi ditempatkan di bagian atas layar (*Eye Zone*) agar tidak tertutup jempol saat menggeser *slider* atau menekan tombol stepper di bagian bawah (*Thumb Zone*).

## Arsitektur Kode (Atomic Design)
- `src/types/` — Definisi tipe data TypeScript.
- `src/constants/` — Dataset statis grinder dan daftar metode seduh[cite: 1].
- `src/utils/` — Logika konversi mikron dan *formatter* skala klik.
- `src/hooks/` — *Custom hooks* (`useGrindSync`, `useHaptic`).
- `src/components/atoms/` — Komponen UI dasar (`StatusBadge`, `StepperButton`, `TactileSlider`).
- `src/components/molecules/` — Komponen gabungan (`BrewMethodSelector`, `MicronBridge`).
- `src/components/organisms/` — Blok seksi halaman (`HeaderBar`, `TargetGrinderCard`, `SourceGrinderCard`, `GrinderPickerSheet`).

## Cara Menjalankan di Lokal

1. Instal seluruh dependensi:
```bash
npm install
```

2. Jalankan *development server*:
```bash
npm run dev
```


3. Buka `http://localhost:3000` di browser (disarankan menggunakan mode *Responsive / Mobile Viewport* di DevTools untuk merasakan ergonomi *Thumb-Zone*).

## Deployment

Aplikasi ini di-build di atas **Next.js App Router** dan dapat di-deploy secara instan ke platform seperti **Vercel** atau **Cloudflare Pages** tanpa memerlukan *database* eksternal karena berjalan secara *client-side*.
