-- DILON DESA MLESE - DATABASE SCHEMA FOR SUPABASE
-- -------------------------------------------------------------
-- Buka "SQL Editor" di dasbor Supabase Anda, tempel kode ini, lalu klik "Run".

-- 1. Tabel Profil Pengguna (Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT,
    role TEXT DEFAULT 'seller', -- 'seller' atau 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Tabel UMKM (umkm)
CREATE TABLE IF NOT EXISTS public.umkm (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    owner TEXT NOT NULL,
    description TEXT,
    address TEXT,
    kadus INTEGER NOT NULL,
    drive_link TEXT DEFAULT '#',
    maps_link TEXT DEFAULT '#',
    wa_link TEXT DEFAULT '#',
    image TEXT, -- Menyimpan data base64 gambar
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', atau 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Tabel Produk (products)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    umkm_id UUID REFERENCES public.umkm(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC,
    image_url TEXT, -- Menyimpan data base64 gambar
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Tabel Artikel & Berita (articles)
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    author TEXT,
    image_url TEXT, -- Menyimpan data base64 gambar
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- AKTIFKAN ROW LEVEL SECURITY (RLS) ATAU IZINKAN AKSES PENUH UNTUK KEMUDAHAN
-- Jika ingin mempermudah penulisan data tanpa aturan RLS yang ketat saat demo:
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.umkm DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles DISABLE ROW LEVEL SECURITY;
