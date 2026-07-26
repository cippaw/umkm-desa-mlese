// Supabase Client Setup & Smart Fallback
// -------------------------------------------------------------
// Masukkan kredensial project Supabase Anda di sini untuk menghubungkan database cloud.
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

let isDemoMode = false;
let supabaseClient = null;

// Deteksi apakah kredensial masih menggunakan nilai placeholder bawaan
if (SUPABASE_URL.includes('YOUR_') || SUPABASE_ANON_KEY.includes('YOUR_')) {
    isDemoMode = true;
    console.warn("DILAN Desa Mlese: Menjalankan dalam 'Mode Demo (LocalStorage)' karena API Key Supabase belum diatur. Untuk menghubungkan ke database cloud nyata, silakan ubah kredensial di berkas 'js/supabase-client.js'.");
} else {
    try {
        if (typeof supabase !== 'undefined') {
            supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        } else {
            isDemoMode = true;
            console.error("Supabase SDK gagal dimuat. Beralih ke Mode Demo.");
        }
    } catch (e) {
        isDemoMode = true;
        console.error("Koneksi Supabase gagal. Beralih ke Mode Demo. Error: ", e);
    }
}

// Simulasi Database (LocalStorage Mock) untuk Mode Demo agar web langsung bisa dicoba secara offline
const LocalDB = {
    // Auth Mock
    signUp: async (email, password, username) => {
        let users = JSON.parse(localStorage.getItem('mock_users') || '[]');
        if (users.find(u => u.email === email)) {
            return { error: { message: 'Email sudah terdaftar!' } };
        }
        const newUser = { id: 'u-' + Date.now(), email, username, role: 'seller' };
        users.push({ ...newUser, password });
        localStorage.setItem('mock_users', JSON.stringify(users));
        
        // Simpan ke profil mock
        let profiles = JSON.parse(localStorage.getItem('mock_profiles') || '[]');
        profiles.push({ id: newUser.id, username, role: 'seller', created_at: new Date() });
        localStorage.setItem('mock_profiles', JSON.stringify(profiles));
        
        return { data: { user: newUser }, error: null };
    },
    signIn: async (email, password) => {
        let users = JSON.parse(localStorage.getItem('mock_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
            return { error: { message: 'Email atau password salah!' } };
        }
        const sessionUser = { id: user.id, email: user.email, username: user.username };
        localStorage.setItem('mock_session', JSON.stringify(sessionUser));
        return { data: { user: sessionUser }, error: null };
    },
    signOut: async () => {
        localStorage.removeItem('mock_session');
        return { error: null };
    },
    getSessionUser: () => {
        const session = localStorage.getItem('mock_session');
        return session ? JSON.parse(session) : null;
    },
    getProfile: async (userId) => {
        let profiles = JSON.parse(localStorage.getItem('mock_profiles') || '[]');
        // Tambahkan akun admin default jika kosong untuk kemudahan demo
        if (profiles.length === 0) {
            profiles = [
                { id: 'admin-id', username: 'admin_mlese', role: 'admin', created_at: new Date() }
            ];
            localStorage.setItem('mock_profiles', JSON.stringify(profiles));
            let mockUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
            if (!mockUsers.find(u => u.email === 'admin@mlese.desa.id')) {
                mockUsers.push({ id: 'admin-id', email: 'admin@mlese.desa.id', password: 'admin', username: 'admin_mlese', role: 'admin' });
                localStorage.setItem('mock_users', JSON.stringify(mockUsers));
            }
        }
        const profile = profiles.find(p => p.id === userId);
        return { data: profile, error: null };
    },
    
    // Database CRUD Mock
    select: (table) => {
        return {
            eq: (field, value) => {
                let data = JSON.parse(localStorage.getItem(`mock_${table}`) || '[]');
                if (table === 'umkm') {
                    const hasOldData = data.some(item => item.title && item.title.includes('Bu Siswo'));
                    if (data.length === 0 || hasOldData) {
                        data = window.productsData || [];
                        localStorage.setItem('mock_umkm', JSON.stringify(data));
                    }
                }
                return {
                    data: data.filter(item => item[field] == value),
                    error: null
                };
            },
            all: () => {
                let data = JSON.parse(localStorage.getItem(`mock_${table}`) || '[]');
                if (table === 'umkm') {
                    const hasOldData = data.some(item => item.title && item.title.includes('Bu Siswo'));
                    if (data.length === 0 || hasOldData) {
                        data = window.productsData || [];
                        localStorage.setItem('mock_umkm', JSON.stringify(data));
                    }
                }
                return { data, error: null };
            }
        };
    },
    insert: async (table, rowData) => {
        let data = JSON.parse(localStorage.getItem(`mock_${table}`) || '[]');
        const newRow = { id: 'id-' + Date.now(), created_at: new Date(), ...rowData };
        data.push(newRow);
        localStorage.setItem(`mock_${table}`, JSON.stringify(data));
        return { data: [newRow], error: null };
    },
    update: async (table, id, updatedFields) => {
        let data = JSON.parse(localStorage.getItem(`mock_${table}`) || '[]');
        data = data.map(item => item.id == id ? { ...item, ...updatedFields } : item);
        localStorage.setItem(`mock_${table}`, JSON.stringify(data));
        return { error: null };
    },
    delete: async (table, id) => {
        let data = JSON.parse(localStorage.getItem(`mock_${table}`) || '[]');
        data = data.filter(item => item.id != id);
        localStorage.setItem(`mock_${table}`, JSON.stringify(data));
        return { error: null };
    }
};

// Interface Wrapper untuk menyatukan logika Supabase nyata & LocalStorage Mock
window.mleseDB = {
    isDemo: isDemoMode,
    
    // AUTHENTICATION API
    register: async (email, password, username) => {
        if (isDemoMode) {
            return await LocalDB.signUp(email, password, username);
        } else {
            const { data, error } = await supabaseClient.auth.signUp({ email, password });
            if (error) return { data: null, error };
            
            // Tambahkan baris ke profil
            const { error: profileError } = await supabaseClient
                .from('profiles')
                .insert([{ id: data.user.id, username, role: 'seller' }]);
            
            return { data, error: profileError };
        }
    },
    
    login: async (email, password) => {
        if (isDemoMode) {
            return await LocalDB.signIn(email, password);
        } else {
            return await supabaseClient.auth.signInWithPassword({ email, password });
        }
    },
    
    logout: async () => {
        if (isDemoMode) {
            return await LocalDB.signOut();
        } else {
            return await supabaseClient.auth.signOut();
        }
    },
    
    getUser: async () => {
        if (isDemoMode) {
            const user = LocalDB.getSessionUser();
            if (!user) return null;
            const profile = await LocalDB.getProfile(user.id);
            return { ...user, profile: profile.data };
        } else {
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (!user) return null;
            const { data: profile } = await supabaseClient
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            return { ...user, profile };
        }
    },

    // DATABASE API (UMKM, PRODUCTS, ARTICLES)
    getUMKMList: async (kadusFilter = null) => {
        if (isDemoMode) {
            let res = LocalDB.select('umkm').all();
            if (kadusFilter) {
                res.data = res.data.filter(p => p.kadus == kadusFilter);
            }
            return res;
        } else {
            let query = supabaseClient.from('umkm').select('*');
            if (kadusFilter) {
                query = query.eq('kadus', kadusFilter);
            }
            return await query;
        }
    },

    getApprovedUMKMList: async (kadusFilter = null) => {
        if (isDemoMode) {
            let res = LocalDB.select('umkm').all();
            // Default static products are approved by default
            res.data = res.data.filter(p => p.status === 'approved' || !p.status);
            if (kadusFilter) {
                res.data = res.data.filter(p => p.kadus == kadusFilter);
            }
            return res;
        } else {
            let query = supabaseClient.from('umkm').select('*').eq('status', 'approved');
            if (kadusFilter) {
                query = query.eq('kadus', kadusFilter);
            }
            return await query;
        }
    },

    getPendingUMKMList: async () => {
        if (isDemoMode) {
            let res = LocalDB.select('umkm').all();
            res.data = res.data.filter(p => p.status === 'pending');
            return res;
        } else {
            return await supabaseClient.from('umkm').select('*').eq('status', 'pending');
        }
    },

    getUMKMDetail: async (id) => {
        if (isDemoMode) {
            const list = LocalDB.select('umkm').all().data;
            const found = list.find(item => item.id == id || item.id === id);
            return { data: found, error: found ? null : { message: 'UMKM tidak ditemukan' } };
        } else {
            return await supabaseClient.from('umkm').select('*').eq('id', id).single();
        }
    },

    getUMKMByUser: async (userId) => {
        if (isDemoMode) {
            return LocalDB.select('umkm').eq('user_id', userId);
        } else {
            return await supabaseClient.from('umkm').select('*').eq('user_id', userId);
        }
    },

    addUMKM: async (umkmData) => {
        if (isDemoMode) {
            return await LocalDB.insert('umkm', umkmData);
        } else {
            return await supabaseClient.from('umkm').insert([umkmData]);
        }
    },

    updateUMKMStatus: async (id, status) => {
        if (isDemoMode) {
            return await LocalDB.update('umkm', id, { status });
        } else {
            return await supabaseClient.from('umkm').update({ status }).eq('id', id);
        }
    },

    updateUMKM: async (id, umkmData) => {
        if (isDemoMode) {
            return await LocalDB.update('umkm', id, umkmData);
        } else {
            return await supabaseClient.from('umkm').update(umkmData).eq('id', id);
        }
    },

    deleteUMKM: async (id) => {
        if (isDemoMode) {
            return await LocalDB.delete('umkm', id);
        } else {
            return await supabaseClient.from('umkm').delete().eq('id', id);
        }
    },

    // PRODUCTS API
    getProductsByUMKM: async (umkmId) => {
        if (isDemoMode) {
            return LocalDB.select('products').eq('umkm_id', umkmId);
        } else {
            return await supabaseClient.from('products').select('*').eq('umkm_id', umkmId);
        }
    },

    getAllProducts: async () => {
        if (isDemoMode) {
            return LocalDB.select('products').all();
        } else {
            return await supabaseClient.from('products').select('*');
        }
    },

    addProduct: async (productData) => {
        if (isDemoMode) {
            return await LocalDB.insert('products', productData);
        } else {
            return await supabaseClient.from('products').insert([productData]);
        }
    },

    deleteProduct: async (id) => {
        if (isDemoMode) {
            return await LocalDB.delete('products', id);
        } else {
            return await supabaseClient.from('products').delete().eq('id', id);
        }
    },

    // ARTICLES API
    getArticles: async () => {
        if (isDemoMode) {
            return LocalDB.select('articles').all();
        } else {
            return await supabaseClient.from('articles').select('*').order('created_at', { ascending: false });
        }
    },

    addArticle: async (articleData) => {
        if (isDemoMode) {
            return await LocalDB.insert('articles', articleData);
        } else {
            return await supabaseClient.from('articles').insert([articleData]);
        }
    },

    deleteArticle: async (id) => {
        if (isDemoMode) {
            return await LocalDB.delete('articles', id);
        } else {
            return await supabaseClient.from('articles').delete().eq('id', id);
        }
    }
};

// Inisialisasi Kredensial Pengguna Demo Bawaan untuk Kemudahan Login Awal
if (isDemoMode) {
    let mockUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
    let adminExists = mockUsers.some(u => u.email === 'admin@mlese.desa.id');
    let sellerExists = mockUsers.some(u => u.email === 'seller@mlese.desa.id');

    if (!adminExists) {
        mockUsers.push({ id: 'admin-id', email: 'admin@mlese.desa.id', password: 'admin', username: 'admin_mlese', role: 'admin' });
    }
    if (!sellerExists) {
        mockUsers.push({ id: 'seller-id', email: 'seller@mlese.desa.id', password: 'seller', username: 'umkm_mlese', role: 'seller' });
    }
    localStorage.setItem('mock_users', JSON.stringify(mockUsers));

    let mockProfiles = JSON.parse(localStorage.getItem('mock_profiles') || '[]');
    if (!mockProfiles.some(p => p.id === 'admin-id')) {
        mockProfiles.push({ id: 'admin-id', username: 'admin_mlese', role: 'admin', created_at: new Date().toISOString() });
    }
    if (!mockProfiles.some(p => p.id === 'seller-id')) {
        mockProfiles.push({ id: 'seller-id', username: 'umkm_mlese', role: 'seller', created_at: new Date().toISOString() });
    }
    localStorage.setItem('mock_profiles', JSON.stringify(mockProfiles));
}

