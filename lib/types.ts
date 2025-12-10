export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  role: "client" | "prestataire"
  location: string | null
  bio: string | null
  featured?: boolean
  is_admin?: boolean
  created_at: string
  updated_at: string
}

export interface Annonce {
  id: string
  user_id: string
  title: string
  description: string
  event_type: string
  event_date: string
  location: string
  budget_min: number | null
  budget_max: number | null
  status: "active" | "closed" | "draft"
  images?: string[]
  featured?: boolean
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface Service {
  id: string
  user_id: string
  name: string
  description: string
  category: string
  location: string
  price_min: number | null
  price_max: number | null
  images: string[]
  status: "active" | "inactive"
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface Conversation {
  id: string
  participant_1: string
  participant_2: string
  annonce_id: string | null
  service_id: string | null
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  is_read: boolean
  created_at: string
}
