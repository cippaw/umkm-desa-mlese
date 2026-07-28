const products = [
    {
        id: "umkm-belut",
        title: "UMKM Keripik Belut \"Rejeki\"",
        owner: "Ibu Sri Mulyani",
        kadus: 1,
        category: "Kuliner Tradisional",
        description: "Kerupuk camilan gurih yang diolah dari belut segar pilihan hasil tangkapan sawah Desa Mlese. Menggunakan bumbu rempah alami pilihan tanpa bahan kimia berbahaya, menghasilkan cita rasa yang renyah, gurih, dan lezat cocok sebagai camilan maupun lauk makan.",
        productsList: "Keripik Belut Gurih, Keripik Belut Pedas",
        address: "Dukuh Mlese RT 01 / RW 01, Wilayah Kadus 1, Desa Mlese",
        image: "assets/keripik_belut.jpg",
        links: {
            catalog: "#",
            maps: "#",
            whatsapp: "https://wa.me/6281234567890?text=Halo%20UMKM%20Keripik%20Belut,%20saya%20tertarik%20untuk%20memesan%20produk%20Anda."
        }
    },
    {
        id: "umkm-jenang",
        title: "Jenang Ayu",
        owner: "Ibu Utami",
        kadus: 2,
        category: "Kuliner Tradisional",
        description: "Jenang Ayu merupakan UMKM yang memproduksi jenang tradisional khas Jawa secara turun-temurun dengan mempertahankan cita rasa autentik. Seluruh proses pembuatan dilakukan secara higienis menggunakan bahan-bahan pilihan seperti tepung ketan, santan kelapa, dan gula jawa berkualitas tanpa tambahan bahan pengawet berbahaya. Produk diolah dengan resep tradisional sehingga menghasilkan tekstur lembut, rasa manis yang pas, dan kualitas yang tetap terjaga.",
        productsList: "Jenang Ayu, Dodol Jawa, Wajik Ketan, Trasikan, Kue Tradisional",
        address: "Dusun Birin, Desa Mlese, Kecamatan Gantiwarno, Kabupaten Klaten.",
        image: "assets/jenang_ayu.jpeg",
        links: {
            catalog: "https://s.id/KatalogProdukTokoOlehOlehBuSiswo",
            maps: "https://maps.app.goo.gl/hqvZ7y4yVPvKwQ8B7",
            whatsapp: "https://wa.me/6281584545086?text=Halo%20Toko%20Jenang%20Ayu%20'Bu%20Siswo',%20saya%20tertarik%20untuk%20memesan%20produk%20jenang%20ayu%20Ibu."
        }
    },
    {
        id: "umkm-karak",
        title: "Karak Birin",
        owner: "Ibu Suranti",
        kadus: 2,
        category: "Kuliner Tradisional",
        description: "Karak Birin merupakan UMKM yang memproduksi kerupuk karak tradisional dari beras pilihan dengan proses pembuatan yang masih mempertahankan cara tradisional. Produk ini dibuat tanpa menggunakan boraks maupun bahan pengawet berbahaya, sehingga lebih aman untuk dikonsumsi. Proses penjemuran alami di bawah sinar matahari dan pengolahan yang higienis menghasilkan karak dengan tekstur renyah, cita rasa gurih, serta kualitas yang tetap terjaga.",
        productsList: "Karak Original, Karak Bawang, Karak Mentah, Karak Siap Goreng",
        address: "Dusun Birin, Desa Mlese, Kecamatan Gantiwarno, Kabupaten Klaten.",
        image: "assets/karak_birin.jpeg",
        links: {
            catalog: "https://s.id/KatalogProdukKarakBuSuranti",
            maps: "https://maps.app.goo.gl/9ePvGzjY3xSW3nQVA",
            whatsapp: "https://wa.me/6287827559044?text=Halo%20UMKM%20Karak%20Gurih%20Tanpa%20Boraks%20Bu%20Suranti,%20saya%20tertarik%20untuk%20memesan%20produk%20karak%20Anda."
        }
    },
    {
        id: "umkm-jamu",
        title: "UMKM Jamu Tradisional \"Mlese Segar\"",
        owner: "Ibu Handayani",
        kadus: 3,
        category: "Minuman Kesehatan",
        description: "Olahan minuman kesehatan herbal tradisional berbahan dasar kencur, jahe merah, temulawak, dan kunyit asam segar hasil budidaya kebun toga Desa Mlese. Diproduksi secara tradisional dan higienis tanpa pemanis buatan maupun pengawet kimia, sangat baik untuk menjaga stamina dan kebugaran tubuh.",
        productsList: "Beras Kencur, Kunyit Asam, Jahe Merah Instan",
        address: "Dukuh Mlese RT 02 / RW 02, Wilayah Kadus 3, Desa Mlese",
        image: "assets/jamu_mlese.jpg",
        links: {
            catalog: "#",
            maps: "#",
            whatsapp: "https://wa.me/6283123456789?text=Halo%20UMKM%20Jamu%20Mlese%20Segar,%20saya%20tertarik%20untuk%20memesan%20produk%20jamu%20Anda."
        }
    }
];

// Export for ES modules compatibility or make it globally accessible
if (typeof module !== 'undefined' && module.exports) {
    module.exports = products;
} else {
    window.productsData = products;
}

