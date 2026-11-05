# Wira Grafika — Digital Printing & Percetakan

Website katalog dan pemesanan berbasis WhatsApp untuk demo Wira Grafika Digital Printing Gresik. Project dibuat statis menggunakan HTML, CSS, dan JavaScript sehingga dapat langsung dipublikasikan melalui GitHub Pages tanpa backend atau proses build.

## Struktur project

```text
/
├── index.html
├── README.md
├── assets/
│   └── images/
├── css/
│   └── style.css
└── js/
    ├── products.js
    └── script.js
```

## Menjalankan secara lokal

Buka `index.html` di browser. Untuk pengalaman yang lebih konsisten, jalankan melalui extension Live Server di VS Code atau server statis lokal.

## Deploy ke GitHub Pages

1. Buat repository baru, misalnya `wiragrafika`.
2. Upload **seluruh isi folder project ini** ke root repository. Pastikan `index.html` berada langsung di root, bukan di dalam folder tambahan.
3. Buka **Settings → Pages**.
4. Pada bagian Build and deployment, pilih **Deploy from a branch**.
5. Pilih branch `main` dan folder `/(root)`, lalu klik **Save**.
6. Tunggu proses deploy GitHub Pages selesai. Alamat default untuk repository bernama `wiragrafika` adalah `https://USERNAME.github.io/wiragrafika/`.

Semua tautan aset menggunakan relative path supaya dapat berjalan di root domain maupun project path GitHub Pages.

## Mengubah katalog produk

Edit file `js/products.js`. Setiap produk mempunyai properti:

- `id`: identitas unik produk.
- `name`: nama produk.
- `category`: kategori internal (`digital`, `banner`, `promosi`, `stempel`).
- `categoryLabel`: nama kategori yang tampil.
- `image`: lokasi foto relatif dari root project.
- `description`: deskripsi singkat.
- `tag`: label produk.

Untuk menambah produk, salin satu objek produk lalu ubah propertinya. Pastikan file gambar diletakkan di `assets/images/` dan nama/path-nya sesuai.

## Mengubah nomor WhatsApp

Buka `js/script.js`, lalu ubah konstanta `WHATSAPP` di bagian atas menjadi nomor tujuan format internasional tanpa tanda `+` atau spasi. Saat ini diatur ke `6282230589294`.

Nomor pada tautan WhatsApp di `index.html` juga perlu diperbarui bila nomor berubah.

## Mengubah sosial media, email, dan lokasi

Cari tautan berikut di `index.html`, lalu ubah bila pemilik memberikan URL baru:

- Instagram: `https://www.instagram.com/wiragrafika_gresik/`
- Facebook: `https://www.facebook.com/share/14vV1EyJMFd/`
- Email: `mailto:wiragrafika@gmail.com`
- Google Maps: `https://maps.app.goo.gl/cawLU8xrbTvQUFq18`

Lokasi peta tertanam memakai pencarian alamat. Jika pemilik memiliki URL embed lokasi yang presisi, ganti URL `src` pada elemen iframe peta.

## Mengubah foto dan logo

Ganti file di `assets/images/` dengan file baru, pertahankan nama file yang sama agar semua bagian website langsung menggunakan gambar pengganti. Logo utama adalah `logo-wira-grafika.png`.

## Catatan katalog dan harga

Harga belum ditampilkan sebagai angka tetap. Harga produk perlu dikonfirmasi admin karena bisa bergantung pada ukuran, bahan, jumlah, dan spesifikasi. Checkout menyusun pesan WhatsApp berisi daftar produk, jumlah, spesifikasi, dan catatan. Pesanan baru berlaku setelah dikonfirmasi admin.

## Catatan demo

Footer mencantumkan bahwa ini merupakan konsep demo website oleh SynergyDev. Pastikan seluruh informasi, foto, produk, dan kontak mendapatkan persetujuan pemilik sebelum website dipublikasikan sebagai website resmi.
