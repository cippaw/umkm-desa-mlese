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
        title: "UMKM Jenang Ayu \"Bu Siswo\"",
        owner: "Ibu Utami",
        kadus: 2,
        category: "Kuliner Tradisional",
        description: "Olahan dodol tradisional Jenang Ayu legendaris buatan Ibu Utami diproses secara higienis menggunakan resep leluhur. Berbahan dasar tepung ketan murni, santan kelapa tua pilihan, dan gula merah jawa berkualitas tinggi. Rasa legit manis yang pas berpadu sempurna dengan kelembutan tekstur yang tahan lama tanpa campuran bahan pengawet kimia.",
        productsList: "Jenang Ayu, Ketan Wajik, Kue Unthuk Cacing, Kue Mbang Jambu, Trasikan",
        address: "Dusun Birin RT 03 / RW 04, Desa Mlese",
        image: "assets/jenang_ayu.jpeg",
        links: {
            catalog: "https://s.id/KatalogProdukTokoOlehOlehBuSiswo",
            maps: "https://maps.app.goo.gl/ko72HpFB4yZW666m9",
            whatsapp: "https://wa.me/6281584545086?text=Halo%20Toko%20Jenang%20Ayu%20'Bu%20Siswo',%20saya%20tertarik%20untuk%20memesan%20produk%20jenang%20ayu%20Anda."
        }
    },
    {
        id: "umkm-karak",
        title: "UMKM Karak Gurih Tanpa Boraks \"Bu Suranti\"",
        owner: "Ibu Suranti",
        kadus: 2,
        category: "Kuliner Tradisional",
        description: "Memproduksi kerupuk nasi karak tradisional khas Klaten yang renyah dan gurih. Dibuat menggunakan beras lokal pilihan hasil panen sawah Desa Mlese dengan bumbu bawang putih dan garam alami. Karak kami dijamin bebas bahan pengawet boraks/gendar berbahaya sehingga aman dan menyehatkan untuk cemilan harian Anda.",
        productsList: "Karak Mentah Adonan, Karak Matang Siap Saji",
        address: "Dusun Birin RT 02 / RW 04, Desa Mlese",
        image: "assets/karak_birin.jpeg",
        links: {
            catalog: "https://s.id/KatalogProdukKarakBuSuranti",
            maps: "https://maps.app.goo.gl/dyeYj24bDD2ae2GL8",
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
