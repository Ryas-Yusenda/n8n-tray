# n8n Tray

Aplikasi tray untuk n8n — helper/utility untuk menjalankan n8n dari system tray di Windows.

## 📋 Prasyarat

- **Node.js** (>=18.x) dan **npm** atau **yarn**
- **Windows** 10/11 (untuk build eksekutabel)
- **Git** (untuk version control dan release)

## 🚀 Setup & Development

### 1. Clone Repository

```bash
git clone https://github.com/your-username/n8n-tray.git
cd n8n-tray
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Menjalankan di Development Mode

```bash
npm start
```

Aplikasi Electron akan terbuka di jendela baru.

## 📦 Build & Packaging

### Build Windows Installer (NSIS)

Buat installer `.exe` untuk distribusi:

```bash
npm run dist
```

Hasil installer akan ada di folder `dist/`:

- `n8n-tray Setup x.y.z.exe` — Windows installer NSIS

### Output Artifacts

Setelah build selesai, cek folder `dist/`:

```bash
dist/
├── n8n-tray Setup x.y.z.exe    # Installer NSIS
├── n8n-tray x.y.z.exe.blockmap # Block map untuk update
└── builder-effective-config.yaml
```

## 🔧 Struktur Project

```
n8n-tray/
├── main.js                  # Entry point Electron
├── package.json             # Konfigurasi project & build
├── icon.ico                 # Icon aplikasi (Windows)
├── README.md                # Dokumentasi
├── dist/                    # Output build (gitignore)
└── .github/workflows/       # GitHub Actions CI/CD
```

## 📝 Configuration

### Build Configuration (package.json)

Semua konfigurasi build ada di `package.json` di bawah key `"build"`:

```json
{
  "build": {
    "appId": "com.example.n8ntray",
    "productName": "n8n Tray",
    "win": {
      "target": "nsis",
      "icon": "icon.ico"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true
    }
  }
}
```

### Ubah Icon Aplikasi

Ganti file `icon.ico` dengan icon Anda sendiri (256x256 atau lebih tinggi).

## 🔐 Release ke GitHub

### Manual Release

1. **Update versi** di `package.json`:

```bash
npm version patch  # atau minor/major
```

2. **Push ke repository**:

```bash
git push origin main --follow-tags
```

3. **Buat Release di GitHub** → **Releases** → **Draft a new release**
   - Tag: `vX.Y.Z` (misalnya `v1.0.1`)
   - Title: `Release vX.Y.Z`
   - Upload file installer dari folder `dist/`

### Automated Release dengan GitHub Actions

Dengan GitHub Actions workflow, release otomatis saat push tag:

1. Push tag dengan format `v*.*.*`:

```bash
git tag -a v1.0.1 -m "Release v1.0.1"
git push origin v1.0.1
```

2. GitHub Actions akan:
   - ✅ Build installer NSIS secara otomatis
   - ✅ Upload ke GitHub Releases
   - ✅ Attach file installer

Tidak perlu build manual lagi!

## 📋 Checklist Release

Sebelum release:

- [ ] Update `version` di `package.json`
- [ ] Update `CHANGELOG.md` (opsional, untuk mencatat perubahan)
- [ ] Test app di development: `npm start`
- [ ] Commit perubahan: `git commit -m "Release vX.Y.Z"`
- [ ] Tag rilis: `git tag -a vX.Y.Z -m "Release vX.Y.Z"`
- [ ] Push tags: `git push origin main --follow-tags`
- [ ] Tunggu GitHub Actions selesai build → release otomatis muncul di GitHub

## 🐛 Troubleshooting

### Build gagal karena missing `icon.ico`

Pastikan file `icon.ico` ada di root folder. Jika tidak:

1. Generate icon dari PNG:
   - Gunakan tools online seperti `icoconvert.com`
   - Atau gunakan `png-to-ico` npm package

2. Atau disable icon di `package.json`:

```json
{
  "win": {
    "target": "nsis"
    // hapus "icon": "icon.ico"
  }
}
```

### NSIS tidak terinstall

electron-builder akan auto-download NSIS saat pertama kali build. Jika ada masalah:

```bash
npm install -g nsis
```

### Clean build cache

Hapus folder `dist/` dan `.cache/` sebelum build ulang:

```bash
rm -r dist/ dist_files/ .cache/
npm run dist
```

## 📚 Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [electron-builder](https://www.electron.build/)
- [NSIS Installer](https://nsis.sourceforge.io/)

## 📄 License

MIT License — Lihat [LICENSE](./LICENSE) untuk detail.

## 👤 Author

**Ryas-Yusenda**

---

Untuk pertanyaan atau issue, buka GitHub Issues di repo ini.
