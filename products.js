const products = [
    {
        id: "11111111-1111-1111-1111-111111111111",
        title: "UMKM Brondong Jagung",
        owner: "Bapak Sukiyanto",
        kadus: 1,
        category: "Kuliner Tradisional",
        description: "Brondong Jagung Mlese merupakan usaha rumahan yang memproduksi camilan tradisional berbahan dasar jagung berkualitas. Setiap proses produksi dilakukan secara higienis dengan memperhatikan kualitas bahan baku dan cita rasa, sehingga menghasilkan brondong yang renyah, ringan, dan nikmat. Dengan berbagai pilihan rasa, produk ini menjadi salah satu camilan khas yang diminati masyarakat serta memiliki potensi sebagai oleh-oleh unggulan Desa Mlese.",
        productsList: "Brondong Jagung Original, Brondong Jagung Manis, Brondong Jagung Gurih, Brondong Jagung Aneka Rasa",
        address: "Dusun Mlese RT 01/RW 02, Desa Mlese, Kecamatan Gantiwarno, Kabupaten Klaten.",
        image: "assets/brondong.png",
        drive_link: "#",
        maps_link: "#",
        wa_link: "https://wa.me/6281234567890?text=Halo%20UMKM%20Brondong%20Jagung,%20saya%20tertarik%20untuk%20memesan%20produk%20Anda."
    },
    {
        id: "22222222-2222-2222-2222-222222222222",
        title: "Jenang Ayu",
        owner: "Ibu Sutami",
        kadus: 2,
        category: "Kuliner Tradisional",
        description: "Jenang Ayu merupakan UMKM yang memproduksi jenang tradisional khas Jawa secara turun-temurun dengan mempertahankan cita rasa autentik. Seluruh proses pembuatan dilakukan secara higienis menggunakan bahan-bahan pilihan seperti tepung ketan, santan kelapa, dan gula jawa berkualitas tanpa tambahan bahan pengawet berbahaya. Produk diolah dengan resep tradisional sehingga menghasilkan tekstur lembut, rasa manis yang pas, dan kualitas yang tetap terjaga.",
        productsList: "Jenang Ayu, Dodol Jawa, Wajik Ketan, Trasikan, Kue Tradisional",
        address: "Dusun Birin, Desa Mlese, Kecamatan Gantiwarno, Kabupaten Klaten.",
        image: "assets/jenang_ayu.jpeg",
        drive_link: "https://s.id/KatalogProdukTokoOlehOlehBuSiswo",
        maps_link: "https://maps.app.goo.gl/hqvZ7y4yVPvKwQ8B7",
        wa_link: "https://wa.me/6281584545086?text=Halo%20Toko%20Jenang%20Ayu%20Bu%20Siswo,%20saya%20tertarik%20untuk%20memesan%20produk%20jenang%20ayu%20Ibu."
    },
    {
        id: "33333333-3333-3333-3333-333333333333",
        title: "Karak Birin",
        owner: "Ibu Suranti",
        kadus: 2,
        category: "Kuliner Tradisional",
        description: "Karak Birin merupakan UMKM yang memproduksi kerupuk karak tradisional dari beras pilihan dengan proses pembuatan yang masih mempertahankan cara tradisional. Produk ini dibuat tanpa menggunakan boraks maupun bahan pengawet berbahaya, sehingga lebih aman untuk dikonsumsi. Proses penjemuran alami di bawah sinar matahari dan pengolahan yang higienis menghasilkan karak dengan tekstur renyah, cita rasa gurih, serta kualitas yang tetap terjaga.",
        productsList: "Karak Original, Karak Bawang, Karak Mentah, Karak Siap Goreng",
        address: "Dusun Birin, Desa Mlese, Kecamatan Gantiwarno, Kabupaten Klaten.",
        image: "assets/karak_birin.jpeg",
        drive_link: "https://s.id/KatalogProdukKarakBuSuranti",
        maps_link: "https://maps.app.goo.gl/9ePvGzjY3xSW3nQVA",
        wa_link: "https://wa.me/6287827559044?text=Halo%20UMKM%20Karak%20Gurih%20Tanpa%20Boraks%20Bu%20Suranti,%20saya%20tertarik%20untuk%20memesan%20produk%20karak%20Anda."
    },
    {
        id: "44444444-4444-4444-4444-444444444444",
        title: "UMKM Rambak",
        owner: "Ibu Sugiyem",
        kadus: 3,
        category: "Kuliner Tradisional",
        description: "Rambak Mlese merupakan usaha rumahan yang menghasilkan kerupuk rambak berkualitas dengan cita rasa gurih dan tekstur renyah. Produk dibuat melalui proses produksi yang higienis dengan tetap mempertahankan cara pengolahan tradisional sehingga menghasilkan kualitas yang konsisten. Rambak ini dapat dinikmati sebagai camilan maupun pelengkap berbagai masakan, serta menjadi salah satu produk olahan yang mendukung potensi UMKM Desa Mlese.",
        productsList: "Rambak Original, Rambak Gurih, Rambak Mentah, Rambak Siap Goreng",
        address: "Dusun Sidomulyo RT 03/RW 07, Desa Mlese, Kecamatan Gantiwarno, Kabupaten Klaten.",
        image: "assets/rambak.png",
        drive_link: "#",
        maps_link: "#",
        wa_link: "https://wa.me/6283123456789?text=Halo%20UMKM%20Rambak,%20saya%20tertarik%20untuk%20memesan%20produk%20rambak%20Anda."
    }
];

// Export for ES modules compatibility or make it globally accessible
if (typeof module !== 'undefined' && module.exports) {
    module.exports = products;
} else {
    window.productsData = products;
}
