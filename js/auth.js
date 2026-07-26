// Authentication & Router Protection Logic
// -------------------------------------------------------------

// Fungsi bantu untuk menentukan prefiks relatif (agar navigasi folder dashboard/ & admin/ tetap konsisten)
function getPathPrefix() {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/dashboard/') || currentPath.includes('/admin/')) {
        return '../';
    }
    return '';
}

// Proteksi Halaman Berdasarkan Sesi dan Hak Akses (Role)
async function protectPage() {
    const prefix = getPathPrefix();
    const currentPath = window.location.pathname;
    const user = await window.mleseDB.getUser();

    // 1. Rute Dasbor (Memerlukan Login)
    if (currentPath.includes('/dashboard/')) {
        if (!user) {
            window.location.href = prefix + 'login.html?redirect=' + encodeURIComponent(window.location.href);
            return;
        }
    }

    // 2. Rute Admin (Memerlukan Login dan Hak Akses Admin)
    if (currentPath.includes('/admin/')) {
        if (!user) {
            window.location.href = prefix + 'login.html?redirect=' + encodeURIComponent(window.location.href);
            return;
        }
        if (user.profile.role !== 'admin') {
            window.location.href = prefix + 'dashboard/index.html';
            return;
        }
    }

    // 3. Rute Auth (login.html / register.html - Jika sudah login, langsung ke dasbor)
    if (currentPath.includes('login.html') || currentPath.includes('register.html')) {
        if (user) {
            if (user.profile.role === 'admin') {
                window.location.href = 'admin/index.html';
            } else {
                window.location.href = 'dashboard/index.html';
            }
        }
    }
}

// Logika Inisialisasi Auth
document.addEventListener('DOMContentLoaded', () => {
    // Jalankan proteksi rute
    protectPage();

    // Handler Form Registrasi
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            const submitBtn = registerForm.querySelector('button[type="submit"]');

            if (submitBtn) submitBtn.disabled = true;
            
            const { data, error } = await window.mleseDB.register(email, password, username);
            
            if (error) {
                alert('Pendaftaran gagal: ' + error.message);
                if (submitBtn) submitBtn.disabled = false;
            } else {
                alert('Pendaftaran berhasil! Silakan masuk ke dalam dasbor.');
                window.location.href = 'login.html';
            }
        });
    }

    // Handler Form Login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const submitBtn = loginForm.querySelector('button[type="submit"]');

            if (submitBtn) submitBtn.disabled = true;

            const { data, error } = await window.mleseDB.login(email, password);

            if (error) {
                alert('Masuk gagal: ' + error.message);
                if (submitBtn) submitBtn.disabled = false;
            } else {
                // Periksa role pengguna yang masuk
                const user = await window.mleseDB.getUser();
                if (user && user.profile.role === 'admin') {
                    window.location.href = 'admin/index.html';
                } else {
                    window.location.href = 'dashboard/index.html';
                }
            }
        });
    }

    // Handler Tombol Keluar (Logout)
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (confirm('Apakah Anda yakin ingin keluar dari sistem?')) {
                await window.mleseDB.logout();
                window.location.href = getPathPrefix() + 'login.html';
            }
        });
    }

    // Tampilkan Nama Pengguna di Dasbor (Jika Elemen Tersedia)
    const userDisplayName = document.getElementById('user-display-name');
    if (userDisplayName) {
        window.mleseDB.getUser().then(user => {
            if (user) {
                userDisplayName.textContent = user.profile.username || user.email;
            }
        });
    }
});
