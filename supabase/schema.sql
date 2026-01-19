
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  email TEXT UNIQUE,
  image TEXT,
  email_verified TIMESTAMP WITH TIME ZONE,

  -- Profile Fields
  birthday TIMESTAMP WITH TIME ZONE,
  likes TEXT,
  dislikes TEXT,
  fav_movies TEXT,
  fav_people TEXT,
  stan_link TEXT,
  low_profile BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fams Table
CREATE TABLE fams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  vibe TEXT,
  vibe_config TEXT, -- JSON string
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fam Members Table
CREATE TABLE fam_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  fam_id UUID REFERENCES fams(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'MEMBER', -- 'OWNER', 'MEMBER'
  custom_name TEXT,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, fam_id)
);

-- Posts Table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  image_url TEXT,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  council_id UUID, -- For future Council feature

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post Fams Junction (Many-to-Many for Post Visibility)
CREATE TABLE post_fams (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  fam_id UUID REFERENCES fams(id) ON DELETE CASCADE,

  PRIMARY KEY (post_id, fam_id)
);

-- Comments Table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Basic RLS Policies (If using Client Side or Anon Key)
-- For now, we are using Service Role in Next.js Server Actions, so these are documentation/fallback.

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE fams ENABLE ROW LEVEL SECURITY;
ALTER TABLE fam_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_fams ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Example: Users can read their own profile
CREATE POLICY "Public profiles" ON users FOR SELECT USING (true);
