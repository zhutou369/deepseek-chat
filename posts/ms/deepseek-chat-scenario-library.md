---
title: "Perpustakaan Senario Sembang DeepSeek: Penulisan, Pengekodan & Pembelajaran"
description: "Templat prompt sedia salin untuk sembang web DeepSeek — penyuntingan salinan, penjelasan kod, nota bacaan, dan latihan temu duga."
date: 2026-07-02
updated: 2026-07-02
featured: true
locale: ms
translationKey: deepseek-chat-scenario-library
tags: ["templat"]
layout: "post.njk"
permalink: "/ms/posts/deepseek-chat-scenario-library/index.html"
---

Laman ini fokus pada **senario sembang**, bukan integrasi API. Tampal templat di bawah ke sembang web DeepSeek dan ubah tempat letak dalam kurungan.

## Penulisan & kandungan

**Ubah pembukaan artikel**

```
Anda editor berpengalaman. Ubah draf di bawah menjadi pembukaan menarik, maksimum 150 patah. Jangan hiperbola.
---
[tampal draf]
```

**Ekstrak nota mesyuarat**

```
Transkrip mesyuarat di bawah. Output:
1. Keputusan (jadual: item / pemilik / tarikh akhir)
2. Soalan terbuka (maks 5)
---
[tampal]
```

## Pengekodan

**Terangkan ralat**

```
Saya pemaju Python junior. Berdasarkan ralat dan kod:
1. Terangkan punca secara ringkas
2. Cadangan pembetulan minimum
3. Jangan tulis semula seluruh fail
```

## Pembelajaran

**Nota bacaan**

```
Saya habis bab [N] [tajuk buku]. Berikan 3 idea utama, 1 tindakan, 1 kemungkinan salah faham. Maks 300 patah.
```

**Latihan temu duga**

```
Anda penemuduga untuk [jawatan]. Satu soalan setiap giliran; maklum balas ringkas selepas jawapan saya.
```

## Cara guna

1. Salin templat terdekat
2. Ubah kurungan sahaja
3. Iterasi dengan [tip berbilang giliran](/ms/posts/deepseek-multi-turn-memory/)

Untuk API dan had kadar, rujuk dokumentasi API berasingan.

## Tutorial berkaitan

- [Asas sembang web](/ms/posts/deepseek-chat-web-basics/)
- [Konteks berbilang giliran](/ms/posts/deepseek-multi-turn-memory/)
- [Tip mudah alih](/ms/posts/deepseek-mobile-app-chat/)
