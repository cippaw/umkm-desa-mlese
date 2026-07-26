document.addEventListener('DOMContentLoaded', () => {
    // 1. Handle Active Page Navigation state matching in header dropdown
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-menu > .nav-item');
    
    if (currentPath.includes('index.html') || currentPath.endsWith('umkm-desa-mlese/')) {
        navItems.forEach(item => {
            const linkText = item.querySelector('.nav-link')?.textContent.trim();
            if (linkText === 'Data Desa') {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // 2. Smooth Scrolling for Anchor Links (if any exist)
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.length > 1) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerOffset = 90; 
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    history.pushState(null, null, targetId);
                }
            }
        });
    });

    // 3. Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            if (navMenu.style.display === 'flex') {
                navMenu.style.display = 'none';
            } else {
                navMenu.style.display = 'flex';
                navMenu.style.flexDirection = 'column';
                navMenu.style.position = 'absolute';
                navMenu.style.top = '70px';
                navMenu.style.left = '0';
                navMenu.style.width = '100%';
                navMenu.style.backgroundColor = '#ffffff';
                navMenu.style.padding = '20px';
                navMenu.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)';
                navMenu.style.zIndex = '1001';
            }
        });
    }

    // 4. DATABASE INTEGRATION & DYNAMIC RENDERING (UMKM & TOKO)
    
    // Retrieve approved submissions from localStorage
    function getLocalApprovedProducts() {
        const approved = localStorage.getItem('approved_umkm');
        return approved ? JSON.parse(approved) : [];
    }

    // Combine static products from products.js with dynamic approved products
    function getCombinedProducts() {
        const staticProducts = window.productsData || [];
        const localProducts = getLocalApprovedProducts();
        return [...staticProducts, ...localProducts];
    }

    // Dynamic rendering of UMKM Rows in Kadus/Index pages
    const umkmListContainer = document.querySelector('.umkm-list-container');
    if (umkmListContainer) {
        // Determine which kadus filter to apply based on the page filename
        let kadusFilter = null;
        if (currentPath.includes('kadus1.html')) {
            kadusFilter = 1;
        } else if (currentPath.includes('kadus2.html')) {
            kadusFilter = 2;
        } else if (currentPath.includes('kadus3.html')) {
            kadusFilter = 3;
        }

        const combinedList = getCombinedProducts();
        const filteredList = kadusFilter 
            ? combinedList.filter(p => p.kadus === kadusFilter)
            : combinedList;

        if (filteredList.length === 0) {
            umkmListContainer.innerHTML = `
                <div class="empty-state" style="text-align: center; padding: 40px; color: var(--text-muted);">
                    <i class="fa-solid fa-store-slash" style="font-size: 48px; margin-bottom: 15px; display: block; opacity: 0.5;"></i>
                    <p>Belum ada produk UMKM terdaftar untuk wilayah ini.</p>
                </div>
            `;
        } else {
            umkmListContainer.innerHTML = ''; // clear initial HTML content
            filteredList.forEach(product => {
                const kadusLabel = product.kadus === 2 ? 'Kadus 2 (Dusun Birin)' : `Kadus ${product.kadus}`;
                const kadusBadgeBg = product.kadus === 1 ? '#e0f2fe' : (product.kadus === 2 ? '#dcfce7' : '#fef3c7');
                const kadusBadgeColor = product.kadus === 1 ? '#0369a1' : (product.kadus === 2 ? '#15803d' : '#b45309');

                const rowItemHtml = `
                    <div class="umkm-row-item" id="${product.id}">
                        <div class="umkm-row-visual">
                            <img src="${product.image}" alt="${product.title}" class="umkm-row-img" onerror="this.src='assets/profil_dukuh.jpeg'">
                        </div>
                        <div class="umkm-row-content">
                            <div class="umkm-row-header">
                                <h4 class="umkm-row-title">${product.title}</h4>
                                <span class="umkm-row-owner"><i class="fa-solid fa-user"></i> Pemilik: ${product.owner}</span>
                                <span style="font-size: 11px; background: ${kadusBadgeBg}; color: ${kadusBadgeColor}; padding: 2px 8px; border-radius: 12px; font-weight: 600; display: inline-block; margin-top: 4px;">${kadusLabel}</span>
                            </div>
                            <p class="umkm-row-desc">${product.description}</p>
                            <ul class="umkm-row-info-list">
                                <li><strong>Jenis Produk:</strong> ${product.productsList || 'Beragam produk lokal'}</li>
                                <li><strong>Alamat Usaha:</strong> ${product.address}</li>
                            </ul>
                            <div class="umkm-row-buttons">
                                <a href="${product.links.catalog}" target="_blank" class="btn-row-cta btn-gdrive" ${product.links.catalog === '#' ? 'style="opacity: 0.5; pointer-events: none;"' : ''}>
                                    <i class="fa-brands fa-google-drive"></i> Katalog (Google Drive)
                                </a>
                                <a href="${product.links.maps}" target="_blank" class="btn-row-cta btn-gmaps" ${product.links.maps === '#' ? 'style="opacity: 0.5; pointer-events: none;"' : ''}>
                                    <i class="fa-solid fa-map-location-dot"></i> Lokasi (Google Maps)
                                </a>
                                <a href="${product.links.whatsapp}" target="_blank" class="btn-row-cta btn-wa">
                                    <i class="fa-brands fa-whatsapp"></i> Hubungi WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                `;
                umkmListContainer.insertAdjacentHTML('beforeend', rowItemHtml);
            });
        }
    }

    // Dynamic rendering of Toko Desa (toko.html) Products & Categories
    const tokoProductsContainer = document.getElementById('toko-products-container');
    if (tokoProductsContainer) {
        const combinedList = getCombinedProducts();
        
        if (combinedList.length === 0) {
            tokoProductsContainer.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
                    <p>Belum ada produk yang tersedia di toko.</p>
                </div>
            `;
        } else {
            tokoProductsContainer.innerHTML = '';
            combinedList.forEach(product => {
                const detailLink = `kadus${product.kadus}.html#${product.id}`;
                const cardHtml = `
                    <div class="umkm-card">
                        <div class="card-img-wrapper">
                            <img src="${product.image}" alt="${product.title}" class="card-img" onerror="this.src='assets/profil_dukuh.jpeg'">
                            <span class="card-badge">${product.category}</span>
                        </div>
                        <div class="card-content">
                            <h3 class="card-title">${product.title}</h3>
                            <p class="card-desc" style="margin-bottom: 15px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${product.description}</p>
                            <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 12px; color: var(--text-muted); font-weight: 500;"><i class="fa-solid fa-map-pin"></i> Kadus ${product.kadus}</span>
                                <a href="${detailLink}" class="card-btn">Lihat Detail ➔</a>
                            </div>
                        </div>
                    </div>
                `;
                tokoProductsContainer.insertAdjacentHTML('beforeend', cardHtml);
            });
        }
    }
});
