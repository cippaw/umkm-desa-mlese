// Seller Dashboard Management Logic
// -------------------------------------------------------------

async function initDashboard() {
    const user = await window.mleseDB.getUser();
    if (!user) return; // auth.js will handle redirect

    const currentPath = window.location.pathname;
    const cleanPath = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;
    const page = cleanPath.split('/').pop().replace('.html', '');

    // Load common header / user details
    const sellerHeaderName = document.getElementById('seller-header-name');
    if (sellerHeaderName) {
        sellerHeaderName.textContent = user.profile.username || user.email;
    }

    // A. LOGIKA UTAMA DASBOR (dashboard/index.html)
    if ((page === 'index' || page === '' || page === 'dashboard') && currentPath.includes('/dashboard')) {
        initDashboardHome(user);
    }

    // B. LOGIKA KELOLA PROFIL (dashboard/profil.html)
    if (page === 'profil' && currentPath.includes('/dashboard')) {
        initDashboardProfile(user);
    }

    // C. LOGIKA KELOLA PRODUK (dashboard/produk.html)
    if (page === 'produk' && currentPath.includes('/dashboard')) {
        initDashboardProducts(user);
    }

    // D. LOGIKA TAMBAH PRODUK (dashboard/tambah-produk.html)
    if (page === 'tambah-produk' && currentPath.includes('/dashboard')) {
        initDashboardAddProduct(user);
    }

    // E. LOGIKA KELOLA ARTIKEL (dashboard/artikel.html))
    if (page === 'artikel' && currentPath.includes('/dashboard')) {
        initDashboardArticles(user);
    }

    // F. LOGIKA TAMBAH ARTIKEL (dashboard/tambah-artikel.html)
    if (page === 'tambah-artikel' && currentPath.includes('/dashboard')) {
        initDashboardAddArticle(user);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
} else {
    initDashboard();
}

// 1. Inisialisasi Halaman Utama Dasbor
async function initDashboardHome(user) {
    const statusContainer = document.getElementById('umkm-status-container');
    const uDetailCard = document.getElementById('umkm-detail-card');
    const noUmkmAlert = document.getElementById('no-umkm-alert');

    // Ambil UMKM milik user
    const { data: list, error } = await window.mleseDB.getUMKMByUser(user.id);
    const userUMKM = list && list.length > 0 ? list[0] : null;

    if (!userUMKM) {
        // Tampilkan peringatan belum ada UMKM
        if (noUmkmAlert) noUmkmAlert.style.display = 'block';
        if (uDetailCard) uDetailCard.style.display = 'none';
        if (statusContainer) {
            statusContainer.innerHTML = `
                <div class="px-4 py-2 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-full text-xs font-semibold inline-block">
                    Belum Mengajukan UMKM
                </div>
            `;
        }
    } else {
        // Tampilkan profil UMKM yang diajukan
        if (noUmkmAlert) noUmkmAlert.style.display = 'none';
        if (uDetailCard) {
            uDetailCard.style.display = 'block';
            document.getElementById('dash-umkm-title').textContent = userUMKM.title;
            document.getElementById('dash-umkm-owner').textContent = userUMKM.owner;
            document.getElementById('dash-umkm-kadus').textContent = `Kadus ${userUMKM.kadus}`;
            document.getElementById('dash-umkm-address').textContent = userUMKM.address;
            document.getElementById('dash-umkm-img').src = userUMKM.image || '../assets/profil_dukuh.jpeg';
        }

        // Tampilkan status verifikasi
        if (statusContainer) {
            let badgeClass = 'bg-yellow-50 text-yellow-800 border-yellow-200';
            let label = 'Menunggu Persetujuan Admin';
            
            if (userUMKM.status === 'approved') {
                badgeClass = 'bg-red-50 text-red-800 border-red-200';
                label = 'Telah Disetujui (Aktif)';
            } else if (userUMKM.status === 'rejected') {
                badgeClass = 'bg-red-50 text-red-800 border-red-200';
                label = 'Ditolak Perangkat Desa';
            }

            statusContainer.innerHTML = `
                <div class="px-4 py-2 border rounded-full text-xs font-semibold inline-block ${badgeClass}">
                    ${label}
                </div>
            `;
        }
    }
}

// 2. Inisialisasi Pengajuan / Edit Profil UMKM
async function initDashboardProfile(user) {
    const profileForm = document.getElementById('dashboard-profile-form');
    if (!profileForm) return;

    const { data: list } = await window.mleseDB.getUMKMByUser(user.id);
    const userUMKM = list && list.length > 0 ? list[0] : null;

    // Jika sudah ada data, isi ke form
    if (userUMKM) {
        document.getElementById('umkm-title').value = userUMKM.title || '';
        document.getElementById('umkm-owner').value = userUMKM.owner || '';
        document.getElementById('umkm-description').value = userUMKM.description || '';
        document.getElementById('umkm-address').value = userUMKM.address || '';
        document.getElementById('umkm-kadus').value = userUMKM.kadus || '1';
        document.getElementById('umkm-drive').value = userUMKM.drive_link || '';
        document.getElementById('umkm-maps').value = userUMKM.maps_link || '';
        document.getElementById('umkm-wa').value = userUMKM.wa_link || '';
        
        // Ganti teks tombol
        const submitBtn = profileForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.textContent = 'Perbarui Profil UMKM';
    }

    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('umkm-title').value.trim();
        const owner = document.getElementById('umkm-owner').value.trim();
        const description = document.getElementById('umkm-description').value.trim();
        const address = document.getElementById('umkm-address').value.trim();
        const kadus = parseInt(document.getElementById('umkm-kadus').value);
        const drive_link = document.getElementById('umkm-drive').value.trim();
        const maps_link = document.getElementById('umkm-maps').value.trim();
        const wa_link = document.getElementById('umkm-wa').value.trim();
        
        // Unggah Foto (Base64 untuk LocalDB / Storage URL untuk Supabase)
        const photoFile = document.getElementById('umkm-photo').files[0];
        let image = userUMKM ? userUMKM.image : '../assets/profil_dukuh.jpeg';

        if (photoFile) {
            // Konversi file ke base64
            image = await convertFileToBase64(photoFile);
        }

        const umkmData = {
            user_id: user.id,
            title,
            owner,
            description,
            address,
            kadus,
            drive_link: drive_link || '#',
            maps_link: maps_link || '#',
            wa_link: wa_link.startsWith('http') ? wa_link : `https://wa.me/${wa_link}`,
            image,
            status: 'pending' // mengajukan ulang/baru memerlukan verifikasi
        };

        let result;
        if (userUMKM) {
            // Update data lama
            result = await window.mleseDB.updateUMKMStatus(userUMKM.id, 'pending');
            // update field manual
            await window.mleseDB.updateUMKM(userUMKM.id, umkmData);
            alert('Profil UMKM berhasil diperbarui! Silakan tunggu persetujuan admin kembali.');
        } else {
            // Tambah pengajuan baru
            result = await window.mleseDB.addUMKM(umkmData);
            alert('Pengajuan UMKM baru berhasil dikirim! Silakan tunggu konfirmasi perangkat desa.');
        }

        window.location.href = '/dashboard/index.html';
    });
}

// Helper konversi file gambar
function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// 3. Inisialisasi Kelola Produk
async function initDashboardProducts(user) {
    const productsTableBody = document.getElementById('dashboard-products-table-body');
    if (!productsTableBody) return;

    const { data: list } = await window.mleseDB.getUMKMByUser(user.id);
    const userUMKM = list && list.length > 0 ? list[0] : null;

    if (!userUMKM) {
        productsTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-8 text-gray-400">
                    Silakan ajukan profil UMKM Anda terlebih dahulu sebelum mengelola produk.
                </td>
            </tr>
        `;
        return;
    }

    const { data: products } = await window.mleseDB.getProductsByUMKM(userUMKM.id);

    if (!products || products.length === 0) {
        productsTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-8 text-gray-400">
                    Belum ada produk jualan yang ditambahkan.
                </td>
            </tr>
        `;
        return;
    }

    productsTableBody.innerHTML = '';
    products.forEach((p, idx) => {
        const row = `
            <tr class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                <td class="px-6 py-4 font-bold text-gray-500">${idx + 1}</td>
                <td class="px-6 py-4">
                    <img src="${p.image_url || p.image || '../assets/profil_dukuh.jpeg'}" alt="${p.name}" class="w-12 h-12 object-cover rounded-lg border border-gray-100">
                </td>
                <td class="px-6 py-4 font-bold text-gray-800">${p.name}</td>
                <td class="px-6 py-4 text-red-600 font-semibold">Rp ${p.price || 'Katalog'}</td>
                <td class="px-6 py-4">
                    <button onclick="handleDeleteProduct('${p.id}')" class="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors">
                        <i class="fa-solid fa-trash"></i> Hapus
                    </td>
            </tr>
        `;
        productsTableBody.insertAdjacentHTML('beforeend', row);
    });
}

// Window handler delete
window.handleDeleteProduct = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini dari katalog?')) {
        await window.mleseDB.deleteProduct(id);
        alert('Produk berhasil dihapus!');
        window.location.reload();
    }
};

// 4. Inisialisasi Tambah Produk
async function initDashboardAddProduct(user) {
    const addProductForm = document.getElementById('dashboard-add-product-form');
    if (!addProductForm) return;

    const { data: list } = await window.mleseDB.getUMKMByUser(user.id);
    const userUMKM = list && list.length > 0 ? list[0] : null;

    if (!userUMKM) {
        alert('Anda harus memiliki UMKM terdaftar sebelum bisa menambah produk.');
        window.location.href = '/dashboard/produk.html';
        return;
    }

    addProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('product-name').value.trim();
        const description = document.getElementById('product-desc').value.trim();
        const price = document.getElementById('product-price').value.trim();
        
        const photoFile = document.getElementById('product-photo').files[0];
        let image = '../assets/profil_dukuh.jpeg';
        
        if (photoFile) {
            image = await convertFileToBase64(photoFile);
        }

        const productData = {
            umkm_id: userUMKM.id,
            name,
            description,
            price: price ? parseFloat(price) : null,
            image_url: image
        };

        const { error } = await window.mleseDB.addProduct(productData);

        if (error) {
            alert('Gagal menambah produk: ' + error.message);
        } else {
            alert('Produk berhasil ditambahkan ke katalog!');
            window.location.href = '/dashboard/produk.html';
        }
    });
}

// 5. Kelola Artikel
async function initDashboardArticles(user) {
    const articlesTableBody = document.getElementById('dashboard-articles-table-body');
    if (!articlesTableBody) return;

    const { data: articles } = await window.mleseDB.getArticles();
    // Filter artikel milik user saja
    const userArticles = (articles || []).filter(a => a.user_id === user.id);

    if (userArticles.length === 0) {
        articlesTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-8 text-gray-400">
                    Belum ada artikel kegiatan yang Anda tulis.
                </td>
            </tr>
        `;
        return;
    }

    articlesTableBody.innerHTML = '';
    userArticles.forEach((art, idx) => {
        const row = `
            <tr class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                <td class="px-6 py-4 font-bold text-gray-500">${idx + 1}</td>
                <td class="px-6 py-4">
                    <img src="${art.image_url || '../assets/profil_dukuh.jpeg'}" alt="${art.title}" class="w-12 h-8 object-cover rounded border border-gray-100">
                </td>
                <td class="px-6 py-4 font-bold text-gray-800 line-clamp-1">${art.title}</td>
                <td class="px-6 py-4 text-xs text-gray-500">${new Date(art.created_at).toLocaleDateString('id-ID')}</td>
                <td class="px-6 py-4">
                    <button onclick="handleDeleteArticle('${art.id}')" class="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors">
                        <i class="fa-solid fa-trash"></i> Hapus
                    </button>
                </td>
            </tr>
        `;
        articlesTableBody.insertAdjacentHTML('beforeend', row);
    });
}

window.handleDeleteArticle = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
        await window.mleseDB.deleteArticle(id);
        alert('Artikel berhasil dihapus!');
        window.location.reload();
    }
};

// 6. Tambah Artikel
async function initDashboardAddArticle(user) {
    const addArticleForm = document.getElementById('dashboard-add-article-form');
    if (!addArticleForm) return;

    addArticleForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('article-title').value.trim();
        const content = document.getElementById('article-content').value.trim();
        const author = document.getElementById('article-author').value.trim();
        
        const photoFile = document.getElementById('article-photo').files[0];
        let image = '../assets/profil_dukuh.jpeg';
        
        if (photoFile) {
            image = await convertFileToBase64(photoFile);
        }

        const articleData = {
            user_id: user.id,
            title,
            content,
            author: author || user.profile.username || 'Pelaku UMKM',
            image_url: image
        };

        const { error } = await window.mleseDB.addArticle(articleData);

        if (error) {
            alert('Gagal menerbitkan artikel: ' + error.message);
        } else {
            alert('Artikel berhasil diterbitkan ke Beranda!');
            window.location.href = '/dashboard/artikel.html';
        }
    });
}


