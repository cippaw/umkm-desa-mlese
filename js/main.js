// Main Public Page Rendering Logic
// -------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;

    // A. DINAMISASI HALAMAN UTAMA (index.html)
    if (currentPath.includes('index.html') || currentPath.endsWith('umkm-desa-mlese/')) {
        initHomepage();
    }

    // B. DINAMISASI HALAMAN KATALOG (umkm.html)
    if (currentPath.includes('umkm.html')) {
        initCatalogPage();
    }

    // C. DINAMISASI HALAMAN DETAIL (detail.html)
    if (currentPath.includes('detail.html')) {
        initDetailPage();
    }

    // D. DINAMISASI HALAMAN ARTIKEL (artikel.html)
    if (currentPath.includes('artikel.html')) {
        initArticlesPage();
    }
});

// 1. Logika Halaman Utama (index.html)
async function initHomepage() {
    // a. Muat Statistik Dinamis
    const { data: allUMKM } = await window.mleseDB.getUMKMList();
    const approvedUMKM = (allUMKM || []).filter(u => u.status === 'approved' || !u.status);
    const { data: allProducts } = await window.mleseDB.getAllProducts();

    // Hitung NIB, Halal, Aktif (Berdasarkan Mock / Data nyata jika diset)
    const totalUMKM = approvedUMKM.length;
    const totalProducts = (allProducts || []).length;
    
    // Tampilkan data statistik ke elemen HTML
    document.getElementById('stat-total-umkm') && (document.getElementById('stat-total-umkm').textContent = totalUMKM || '4');
    document.getElementById('stat-total-produk') && (document.getElementById('stat-total-produk').textContent = totalProducts || '6');
    document.getElementById('stat-halal') && (document.getElementById('stat-halal').textContent = Math.round(totalUMKM * 0.75) || '3');
    document.getElementById('stat-nib') && (document.getElementById('stat-nib').textContent = Math.round(totalUMKM * 0.90) || '4');
    document.getElementById('stat-aktif') && (document.getElementById('stat-aktif').textContent = totalUMKM || '4');

    // b. Muat UMKM Terbaru (Ambil 4 UMKM terakhir yang ditambahkan)
    const umkmTerbaruList = [...approvedUMKM].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 4);
    const latestGrid = document.getElementById('umkm-terbaru-grid');
    if (latestGrid && umkmTerbaruList.length > 0) {
        latestGrid.innerHTML = '';
        umkmTerbaruList.forEach(item => {
            const card = `
                <div class="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
                    <div class="h-48 overflow-hidden relative">
                        <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.src='assets/profil_dukuh.jpeg'">
                        <span class="absolute top-4 left-4 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">Kadus ${item.kadus}</span>
                    </div>
                    <div class="p-6 flex flex-col flex-grow">
                        <h3 class="font-bold text-lg text-gray-800 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors line-clamp-1">${item.title}</h3>
                        <p class="text-xs text-gray-500 dark:text-gray-450 mt-1">Pemilik: ${item.owner}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-300 mt-3 line-clamp-3 leading-relaxed flex-grow">${item.description}</p>
                        <a href="detail.html?id=${item.id}" class="mt-4 text-red-600 dark:text-red-500 font-semibold text-sm hover:text-red-750 inline-flex items-center gap-1 transition-colors">
                            Lihat Profil Usaha <span>➔</span>
                        </a>
                    </div>
                </div>
            `;
            latestGrid.insertAdjacentHTML('beforeend', card);
        });
    }

    // c. Muat Carousel/Grid Produk Unggulan
    const productGrid = document.getElementById('produk-unggulan-grid');
    if (productGrid && allProducts && allProducts.length > 0) {
        productGrid.innerHTML = '';
        allProducts.slice(0, 6).forEach(product => {
            const card = `
                <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full hover:translate-y-[-4px] transition-transform duration-300">
                    <div class="h-44 overflow-hidden relative">
                        <img src="${product.image_url || product.image || 'assets/profil_dukuh.jpeg'}" alt="${product.name}" class="w-full h-full object-cover" onerror="this.src='assets/profil_dukuh.jpeg'">
                        <span class="absolute top-4 right-4 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">Rp ${product.price || 'Sesuai Katalog'}</span>
                    </div>
                    <div class="p-4 flex flex-col flex-grow">
                        <h4 class="font-bold text-gray-800 dark:text-white line-clamp-1">${product.name}</h4>
                        <p class="text-xs text-gray-500 dark:text-gray-450 mt-1 line-clamp-2">${product.description || 'Kualitas terjamin asli desa.'}</p>
                        <a href="detail.html?id=${product.umkm_id}" class="mt-4 text-xs font-semibold text-red-650 hover:text-red-750 transition-colors">Lihat Penjual ➔</a>
                    </div>
                </div>
            `;
            productGrid.insertAdjacentHTML('beforeend', card);
        });
    }

    // d. Muat Artikel & Berita Terbaru
    const { data: articles } = await window.mleseDB.getArticles();
    const articlesGrid = document.getElementById('artikel-beranda-grid');
    if (articlesGrid && articles && articles.length > 0) {
        articlesGrid.innerHTML = '';
        articles.slice(0, 3).forEach(art => {
            const card = `
                <div class="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                    <div class="h-40 overflow-hidden">
                        <img src="${art.image_url || 'assets/profil_dukuh.jpeg'}" alt="${art.title}" class="w-full h-full object-cover" onerror="this.src='assets/profil_dukuh.jpeg'">
                    </div>
                    <div class="p-5 flex flex-col flex-grow">
                        <h4 class="font-bold text-gray-800 dark:text-white line-clamp-2 hover:text-red-650 transition-colors cursor-pointer">${art.title}</h4>
                        <p class="text-xs text-gray-500 mt-2"><i class="fa-solid fa-user"></i> Oleh: ${art.author} | <i class="fa-solid fa-calendar"></i> ${new Date(art.created_at).toLocaleDateString('id-ID')}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-300 mt-3 line-clamp-3">${art.content}</p>
                        <a href="artikel.html" class="mt-4 text-red-600 dark:text-red-500 text-xs font-bold hover:text-red-750 mt-auto inline-block">Baca Selengkapnya ➔</a>
                    </div>
                </div>
            `;
            articlesGrid.insertAdjacentHTML('beforeend', card);
        });
    }
}

// 2. Logika Halaman Katalog (umkm.html)
async function initCatalogPage() {
    const listGrid = document.getElementById('umkm-catalog-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Fungsi muat & render dengan filter Kadus
    const loadAndRender = async (kadus = null) => {
        if (listGrid) {
            listGrid.innerHTML = `
                <div class="col-span-full text-center py-12 text-gray-400">
                    <i class="fa-solid fa-spinner animate-spin text-3xl mb-3 block text-red-600"></i>
                    Memuat daftar UMKM Desa Mlese...
                </div>
            `;
            const { data, error } = await window.mleseDB.getApprovedUMKMList(kadus);
            
            if (error || !data || data.length === 0) {
                listGrid.innerHTML = `
                    <div class="col-span-full text-center py-12 text-gray-400">
                        <i class="fa-solid fa-store-slash text-4xl mb-3 block"></i>
                        Belum ada UMKM disetujui untuk wilayah ini.
                    </div>
                `;
                return;
            }

            listGrid.innerHTML = '';
            data.forEach(item => {
                const card = `
                    <div class="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row h-full">
                        <div class="w-full md:w-64 h-48 md:h-auto overflow-hidden relative flex-shrink-0">
                            <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover" onerror="this.src='assets/profil_dukuh.jpeg'">
                            <span class="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Kadus ${item.kadus}</span>
                        </div>
                        <div class="p-6 flex flex-col flex-grow">
                            <h3 class="font-bold text-xl text-gray-800 dark:text-white hover:text-red-650 transition-colors">${item.title}</h3>
                            <p class="text-xs text-gray-500 mt-1"><i class="fa-solid fa-user"></i> Pemilik: ${item.owner}</p>
                            <p class="text-sm text-gray-600 dark:text-gray-300 mt-3 line-clamp-3 leading-relaxed flex-grow">${item.description}</p>
                            
                            <ul class="text-xs text-gray-500 mt-4 space-y-1 bg-gray-50 dark:bg-slate-950 p-3 rounded-lg border border-gray-100 dark:border-slate-850">
                                <li><strong>Produk:</strong> ${item.productsList || 'Aneka olahan mandiri'}</li>
                                <li class="truncate"><strong>Alamat:</strong> ${item.address}</li>
                            </ul>

                            <div class="mt-5 flex flex-wrap gap-2 justify-between items-center border-t border-gray-50 dark:border-slate-850 pt-4">
                                <a href="detail.html?id=${item.id}" class="px-5 py-2.5 bg-red-600 hover:bg-red-750 text-white font-semibold text-xs rounded-lg transition-colors">
                                    Detail Profil Usaha ➔
                                </a>
                                <div class="flex gap-2">
                                    <a href="${item.wa_link}" target="_blank" class="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors" title="Hubungi WhatsApp">
                                        <i class="fa-brands fa-whatsapp"></i>
                                    </a>
                                    <a href="${item.maps_link}" target="_blank" class="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors" title="Buka Google Maps">
                                        <i class="fa-solid fa-map-location-dot"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                listGrid.insertAdjacentHTML('beforeend', card);
            });
        }
    };

    // Filter event listeners
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active', 'bg-red-600', 'text-white'));
            btn.classList.add('active', 'bg-red-600', 'text-white');
            const kadus = btn.getAttribute('data-kadus');
            loadAndRender(kadus === 'all' ? null : parseInt(kadus));
        });
    });

    // Inisialisasi awal
    loadAndRender();
}

// 3. Logika Halaman Detail (detail.html)
async function initDetailPage() {
    const params = new URLSearchParams(window.location.search);
    const umkmId = params.get('id');
    
    if (!umkmId) {
        window.location.href = 'umkm.html';
        return;
    }

    const { data: item, error } = await window.mleseDB.getUMKMDetail(umkmId);
    if (error || !item) {
        alert('Data UMKM tidak ditemukan.');
        window.location.href = 'umkm.html';
        return;
    }

    // Render Data Profil Utama
    document.title = `${item.title} - Profil UMKM Desa Mlese`;
    document.getElementById('detail-title') && (document.getElementById('detail-title').textContent = item.title);
    document.getElementById('detail-owner') && (document.getElementById('detail-owner').textContent = item.owner);
    document.getElementById('detail-kadus-badge') && (document.getElementById('detail-kadus-badge').textContent = `Wilayah Kadus ${item.kadus}`);
    document.getElementById('detail-desc') && (document.getElementById('detail-desc').textContent = item.description);
    document.getElementById('detail-address') && (document.getElementById('detail-address').textContent = item.address);
    document.getElementById('detail-products-list') && (document.getElementById('detail-products-list').textContent = item.productsList || '-');

    const mainImg = document.getElementById('detail-main-img');
    if (mainImg) mainImg.src = item.image || 'assets/profil_dukuh.jpeg';

    // Sambungkan Link Tombol
    document.getElementById('btn-catalog-drive') && (document.getElementById('btn-catalog-drive').href = item.drive_link || '#');
    if (item.drive_link === '#' || !item.drive_link) {
        document.getElementById('btn-catalog-drive') && (document.getElementById('btn-catalog-drive').style.opacity = '0.5');
    }
    
    document.getElementById('btn-location-maps') && (document.getElementById('btn-location-maps').href = item.maps_link || '#');
    if (item.maps_link === '#' || !item.maps_link) {
        document.getElementById('btn-location-maps') && (document.getElementById('btn-location-maps').style.opacity = '0.5');
    }

    document.getElementById('btn-wa-order') && (document.getElementById('btn-wa-order').href = item.wa_link || '#');

    // Muat dan Render Daftar Produk UMKM Terkait
    const productsGrid = document.getElementById('detail-products-grid');
    if (productsGrid) {
        productsGrid.innerHTML = `
            <div class="col-span-full text-center text-gray-400 py-6">
                <i class="fa-solid fa-spinner animate-spin mb-2 block text-red-600"></i> Memuat galeri produk...
            </div>
        `;
        const { data: products } = await window.mleseDB.getProductsByUMKM(umkmId);
        
        if (!products || products.length === 0) {
            productsGrid.innerHTML = `
                <div class="col-span-full text-center text-gray-400 py-6">
                    <i class="fa-solid fa-images text-3xl mb-2 block opacity-50"></i> Belum ada katalog foto produk khusus yang diunggah.
                </div>
            `;
        } else {
            productsGrid.innerHTML = '';
            products.forEach(p => {
                const pCard = `
                    <div class="bg-gray-50 dark:bg-slate-950 rounded-xl overflow-hidden border border-gray-100 dark:border-slate-850 shadow-sm flex flex-col">
                        <div class="h-40 overflow-hidden">
                            <img src="${p.image_url || p.image || 'assets/profil_dukuh.jpeg'}" alt="${p.name}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" onerror="this.src='assets/profil_dukuh.jpeg'">
                        </div>
                        <div class="p-4 flex flex-col flex-grow">
                            <h4 class="font-bold text-gray-800 dark:text-white line-clamp-1">${p.name}</h4>
                            <p class="text-xs text-gray-500 dark:text-gray-450 mt-1 line-clamp-2">${p.description || 'Kualitas lokal terbaik'}</p>
                            <span class="text-sm font-semibold text-red-650 mt-3 block">Rp ${p.price || 'Sesuai Katalog'}</span>
                        </div>
                    </div>
                `;
                productsGrid.insertAdjacentHTML('beforeend', pCard);
            });
        }
    }
}

// 4. Logika Halaman Berita & Artikel (artikel.html)
async function initArticlesPage() {
    const artGrid = document.getElementById('articles-feed-grid');
    if (artGrid) {
        artGrid.innerHTML = `
            <div class="col-span-full text-center text-gray-400 py-12">
                <i class="fa-solid fa-spinner animate-spin text-3xl mb-2 block text-red-600"></i> Memuat artikel kegiatan...
            </div>
        `;
        const { data, error } = await window.mleseDB.getArticles();

        if (error || !data || data.length === 0) {
            artGrid.innerHTML = `
                <div class="col-span-full text-center text-gray-400 py-12">
                    <i class="fa-solid fa-newspaper text-4xl mb-2 block opacity-50"></i> Belum ada artikel atau pelatihan desa diterbitkan.
                </div>
            `;
            return;
        }

        artGrid.innerHTML = '';
        data.forEach(art => {
            const card = `
                <article class="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 p-5">
                    <div class="w-full md:w-64 h-48 md:h-auto overflow-hidden rounded-xl flex-shrink-0">
                        <img src="${art.image_url || 'assets/profil_dukuh.jpeg'}" alt="${art.title}" class="w-full h-full object-cover" onerror="this.src='assets/profil_dukuh.jpeg'">
                    </div>
                    <div class="flex flex-col flex-grow justify-between py-2">
                        <div>
                            <h3 class="font-extrabold text-xl text-gray-800 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors cursor-pointer line-clamp-2">${art.title}</h3>
                            <p class="text-xs text-gray-500 dark:text-gray-450 mt-2 flex items-center gap-2">
                                <span><i class="fa-solid fa-user"></i> Penulis: <strong>${art.author}</strong></span>
                                <span>•</span>
                                <span><i class="fa-solid fa-calendar"></i> ${new Date(art.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </p>
                            <p class="text-sm text-gray-650 dark:text-gray-300 mt-4 leading-relaxed line-clamp-4">${art.content}</p>
                        </div>
                        <div class="mt-4 border-t border-gray-50 dark:border-slate-850 pt-4 flex justify-between items-center">
                            <span class="text-xs px-3 py-1 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 font-semibold rounded-full">Berita Desa Mlese</span>
                            <button onclick="alert('Membaca detail artikel lengkap secara interaktif segera hadir di platform!');" class="text-red-650 dark:text-red-400 font-bold text-xs hover:text-red-750 flex items-center gap-1 transition-colors">
                                Baca Selengkapnya ➔
                            </button>
                        </div>
                    </div>
                </article>
            `;
            artGrid.insertAdjacentHTML('beforeend', card);
        });
    }
}
