export type UserRole = "client" | "prestataire" | "admin"

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  role: UserRole
  location: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

export interface Annonce {
  id: string
  user_id: string
  title: string
  description: string
  event_type: string
  event_date: string | null
  budget_min: number | null
  budget_max: number | null
  location: string | null
  status: "active" | "closed" | "cancelled"
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
  price_min: number | null
  price_max: number | null
  location: string | null
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
  profiles_participant_1?: Profile
  profiles_participant_2?: Profile
  annonces?: Annonce
  services?: Service
  last_message?: Message
  unread_count?: number
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  is_read: boolean
  created_at: string
  profiles?: Profile
}

export const EVENT_TYPES = [
  "Mariage",
  "Anniversaire",
  "Fête d'entreprise",
  "Conférence",
  "Séminaire",
  "Soirée privée",
  "Baptême",
  "Communion",
  "Autre",
] as const

export const SERVICE_CATEGORIES = [
  "DJ",
  "Traiteur",
  "Photographe",
  "Vidéaste",
  "Fleuriste",
  "Décorateur",
  "Animateur",
  "Location de matériel",
  "Lieu de réception",
  "Autre",
] as const

export const LOCATIONS = [
  "Paris",
  "Lyon",
  "Marseille",
  "Toulouse",
  "Nice",
  "Nantes",
  "Strasbourg",
  "Montpellier",
  "Bordeaux",
  "Lille",
  "Toute la France",
] as const
