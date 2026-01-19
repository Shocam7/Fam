export interface User {
  id: string
  name: string | null
  email: string | null
  image: string | null
  created_at?: string
}

export interface Fam {
  id: string
  name: string
  vibe: string | null
  vibe_config: string | null
  owner_id: string
  created_at?: string
  _count?: {
    members: number
  }
  owner?: User
}

export interface FamMember {
  id: string
  user_id: string
  fam_id: string
  role: string
  user?: User
  fam?: Fam
}

export interface Comment {
  id: string
  content: string
  author_id: string
  post_id: string
  created_at: string
  author?: User
}

export interface Post {
  id: string
  content: string
  imageUrl?: string | null
  author_id: string
  created_at: string
  author?: User
  comments?: Comment[]
  post_fams?: { fam_id: string; fam: Fam }[]
  fams?: { fam: Fam }[]
}
