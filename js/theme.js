// Dark/Light Theme Manager & Automatic Toggle Injection
// -------------------------------------------------------------

// 1. Eksekusi Segera (Untuk mencegah efek kedipan warna latar belakang saat memuat halaman)
(function () {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark' || (!currentTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
})();

// 2. Injeksi Tombol Toggle Tema secara Otomatis pada Navbar setelah DOM selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Cari elemen navbar kanan / tempat tombol masuk berada
    const navRight = document.querySelector('header .flex.items-center') || document.querySelector('.header-container nav') || document.querySelector('header');
    
    if (navRight) {
        // Cek apakah tombol toggle sudah ada untuk menghindari duplikasi
        if (document.getElementById('theme-toggle-btn')) return;

        const themeBtn = document.createElement('button');
        themeBtn.id = 'theme-toggle-btn';
        themeBtn.setAttribute('aria-label', 'Toggle Theme');
        themeBtn.className = 'p-2.5 rounded-xl text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all mr-2 flex items-center justify-center';
        themeBtn.innerHTML = `
            <i class="fa-solid fa-moon dark:hidden text-lg"></i>
            <i class="fa-solid fa-sun hidden dark:block text-lg text-amber-500"></i>
        `;
        
        // Injeksi tombol toggle ke bagian paling kiri dari navbar action buttons
        if (navRight.classList.contains('items-center')) {
            navRight.insertBefore(themeBtn, navRight.firstChild);
        } else {
            navRight.appendChild(themeBtn);
        }

        // Event listener untuk pertukaran tema
        themeBtn.addEventListener('click', () => {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }
});

