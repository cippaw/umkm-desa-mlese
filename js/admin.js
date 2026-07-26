// Admin Management Panel Logic
// -------------------------------------------------------------

document.addEventListener('DOMContentLoaded', async () => {
    const user = await window.mleseDB.getUser();
    if (!user || user.profile.role !== 'admin') return; // auth.js will protect

    const currentPath = window.location.pathname;

    // Load admin header profile name
    const adminHeaderName = document.getElementById('admin-header-name');
    if (adminHeaderName) {
        adminHeaderName.textContent = user.profile.username || 'Administrator';
    }

    // A. LOGIKA UTAMA ANALITIK ADMIN (admin/index.html)
    if (currentPath.includes('admin/index.html') || (currentPath.includes('admin/') && currentPath.endsWith('/'))) {
        initAdminDashboard(user);
    }

    // B. LOGIKA VERIFIKASI PENGAJUAN (admin/verifikasi.html)
    if (currentPath.includes('admin/verifikasi.html')) {
        initAdminVerification();
    }

    // C. LOGIKA KELOLA SEMUA UMKM (admin/kelola-umkm.html)
    if (currentPath.includes('admin/kelola-umkm.html')) {
        initAdminManageUMKM();
    }
});

// 1. Dasbor Ringkasan Admin
async function initAdminDashboard(user) {
    const { data: allUMKM } = await window.mleseDB.getUMKMList();
    const { data: allProducts } = await window.mleseDB.getAllProducts();
    const { data: articles } = await window.mleseDB.getArticles();

    const pendingList = (allUMKM || []).filter(u => u.status === 'pending');
    const approvedList = (allUMKM || []).filter(u => u.status === 'approved' || !u.status);

    // Render Stats
    document.getElementById('admin-stat-total-umkm') && (document.getElementById('admin-stat-total-umkm').textContent = (allUMKM || []).length);
    document.getElementById('admin-stat-approved') && (document.getElementById('admin-stat-approved').textContent = approvedList.length);
    document.getElementById('admin-stat-pending') && (document.getElementById('admin-stat-pending').textContent = pendingList.length);
    document.getElementById('admin-stat-products') && (document.getElementById('admin-stat-products').textContent = (allProducts || []).length);
    document.getElementById('admin-stat-articles') && (document.getElementById('admin-stat-articles').textContent = (articles || []).length);

    // Render Recent Pending Requests
    const recentPendingBody = document.getElementById('admin-recent-pending-body');
    if (recentPendingBody) {
        if (pendingList.length === 0) {
            recentPendingBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-6 text-gray-400">
                        Tidak ada pengajuan UMKM yang menunggu persetujuan.
                    </td>
                </tr>
            `;
            return;
        }

        recentPendingBody.innerHTML = '';
        pendingList.slice(0, 5).forEach((item, idx) => {
            const row = `
                <tr class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td class="px-6 py-4 font-semibold text-gray-500">${idx + 1}</td>
                    <td class="px-6 py-4 font-bold text-gray-800">${item.title}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${item.owner}</td>
                    <td class="px-6 py-4 text-xs font-semibold text-gray-500">Kadus ${item.kadus}</td>
                    <td class="px-6 py-4">
                        <div class="flex gap-2">
                            <button onclick="handleApproveUMKM('${item.id}')" class="px-3 py-1.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-xs font-bold transition-colors">Setujui</button>
                            <button onclick="handleRejectUMKM('${item.id}')" class="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors">Tolak</button>
                        </div>
                    </td>
                </tr>
            `;
            recentPendingBody.insertAdjacentHTML('beforeend', row);
        });
    }
}

// 2. Logika Verifikasi Penuh (Approve/Reject)
async function initAdminVerification() {
    const tableBody = document.getElementById('admin-verification-table-body');
    if (!tableBody) return;

    const { data: pendingList } = await window.mleseDB.getPendingUMKMList();

    if (!pendingList || pendingList.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-10 text-gray-400">
                    <i class="fa-solid fa-square-check text-4xl mb-2 block opacity-50"></i>
                    Semua pengajuan sudah ditinjau. Tidak ada pengajuan baru!
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = '';
    pendingList.forEach((item, idx) => {
        const row = `
            <tr class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                <td class="px-6 py-4 font-semibold text-gray-500">${idx + 1}</td>
                <td class="px-6 py-4">
                    <img src="${item.image}" alt="${item.title}" class="w-12 h-12 object-cover rounded-lg border" onerror="this.src='../assets/profil_dukuh.jpeg'">
                </td>
                <td class="px-6 py-4 font-bold text-gray-800">${item.title}</td>
                <td class="px-6 py-4 text-sm text-gray-600">${item.owner}</td>
                <td class="px-6 py-4 text-xs font-bold text-gray-500">Kadus ${item.kadus}</td>
                <td class="px-6 py-4">
                    <div class="flex gap-2">
                        <button onclick="handleApproveUMKM('${item.id}')" class="px-3 py-1.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-xs font-bold transition-colors">
                            <i class="fa-solid fa-check"></i> Setujui
                        </button>
                        <button onclick="handleRejectUMKM('${item.id}')" class="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors">
                            <i class="fa-solid fa-xmark"></i> Tolak
                        </button>
                    </div>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

// 3. Kelola Semua UMKM Aktif
async function initAdminManageUMKM() {
    const tableBody = document.getElementById('admin-manage-umkm-table-body');
    if (!tableBody) return;

    const { data: allUMKM } = await window.mleseDB.getUMKMList();

    if (!allUMKM || allUMKM.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-10 text-gray-400">
                    Belum ada UMKM terdaftar di sistem.
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = '';
    allUMKM.forEach((item, idx) => {
        let statusBadge = `<span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-[10px] font-bold">Pending</span>`;
        if (item.status === 'approved' || !item.status) {
            statusBadge = `<span class="px-2 py-1 bg-red-50 text-red-800 rounded-full text-[10px] font-bold border border-red-100">Aktif</span>`;
        } else if (item.status === 'rejected') {
            statusBadge = `<span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-[10px] font-bold">Ditolak</span>`;
        }

        const row = `
            <tr class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                <td class="px-6 py-4 font-semibold text-gray-500">${idx + 1}</td>
                <td class="px-6 py-4 font-bold text-gray-800">${item.title}</td>
                <td class="px-6 py-4 text-sm text-gray-600">${item.owner}</td>
                <td class="px-6 py-4 text-xs text-gray-500">Kadus ${item.kadus}</td>
                <td class="px-6 py-4">${statusBadge}</td>
                <td class="px-6 py-4">
                    <button onclick="handleDeleteUMKM('${item.id}')" class="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors">
                        <i class="fa-solid fa-trash"></i> Hapus
                    </button>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

// Window actions
window.handleApproveUMKM = async (id) => {
    if (confirm('Apakah Anda yakin ingin menyetujui pengajuan UMKM ini?')) {
        await window.mleseDB.updateUMKMStatus(id, 'approved');
        alert('UMKM berhasil disetujui dan telah aktif!');
        window.location.reload();
    }
};

window.handleRejectUMKM = async (id) => {
    if (confirm('Apakah Anda yakin ingin menolak pengajuan UMKM ini?')) {
        await window.mleseDB.updateUMKMStatus(id, 'rejected');
        alert('Pengajuan UMKM telah ditolak.');
        window.location.reload();
    }
};

window.handleDeleteUMKM = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus data UMKM ini secara permanen dari sistem?')) {
        await window.mleseDB.deleteUMKM(id);
        alert('Data UMKM berhasil dihapus!');
        window.location.reload();
    }
};
