-- Set JWT secret (ganti dengan secret projectmu)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-here';

-- USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
    is_online BOOLEAN DEFAULT FALSE
);

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT FALSE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_seen TIMESTAMPTZ DEFAULT timezone('utc', now());

-- ROOMS TABLE
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tambahkan kolom username dan avatar_url ke tabel messages untuk menyimpan snapshot nama dan avatar user saat pesan dikirim
ALTER TABLE messages ADD COLUMN IF NOT EXISTS username text;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS avatar_url text;

-- ENABLE RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- USERS POLICIES
CREATE POLICY "Users can view all users" ON public.users
    FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid()::uuid = id);
-- CREATE POLICY "Users can insert their own profile" ON public.users
--     FOR INSERT WITH CHECK (auth.uid()::uuid = id);

-- ROOMS POLICIES
CREATE POLICY "Anyone can view public rooms" ON public.rooms
    FOR SELECT USING (is_public = true);
CREATE POLICY "Authenticated users can insert rooms" ON public.rooms
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- MESSAGES POLICIES
CREATE POLICY "Anyone can view messages in public rooms" ON public.messages
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM public.rooms r
        WHERE r.id = room_id AND r.is_public = true
      )
    );
CREATE POLICY "Users can insert their own messages" ON public.messages
    FOR INSERT WITH CHECK (auth.uid()::uuid = user_id);
CREATE POLICY "Users can update their own messages" ON public.messages
    FOR UPDATE USING (auth.uid()::uuid = user_id);
CREATE POLICY "Users can delete their own messages" ON public.messages
    FOR DELETE USING (auth.uid()::uuid = user_id);

-- TRIGGERS: Update last_seen for users
CREATE OR REPLACE FUNCTION update_last_seen()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_seen = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_last_seen
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_last_seen();

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_is_online ON public.users(is_online);
CREATE INDEX IF NOT EXISTS idx_users_last_seen ON public.users(last_seen DESC); 

INSERT INTO public.rooms (id, name, is_public, created_at)
VALUES (gen_random_uuid(), 'Public Room', true, timezone('utc', now()))
ON CONFLICT DO NOTHING;


ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow logged-in users to insert messages" ON messages;
CREATE POLICY "Allow logged-in users to insert messages"
ON messages
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);


DROP POLICY IF EXISTS "Allow all inserts" ON messages;

CREATE POLICY "Allow all inserts"
ON messages
FOR INSERT
WITH CHECK (true);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Allow replication"
   ON messages
   FOR REPLICATION
   USING (true);