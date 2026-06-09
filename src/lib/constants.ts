// Zentrale Vokabulare & Auswahllisten — abgeleitet aus dem LAEMU-Frontend.
// Diese dienen als Standard-Optionen in den Formularen. Die Tag-Vokabulare
// (Stil/Genre/Taktart) lassen sich zusätzlich über die Tag-Verwaltung pflegen.

export const ACADEMY_INSTRUMENTS = [
  'Schwyzerörgeli',
  'Handorgel',
  'Bassgeige',
  'Klavierbegleitung',
  'Klarinette',
] as const

export const PLANS = ['free', 'starter', 'pro'] as const
export const PLAN_LABELS: Record<string, string> = {
  free: 'Free',
  starter: 'Starter',
  pro: 'Pro',
}

export const COURSE_TRACKS = ['starter', 'pro', 'allgemein'] as const
export const COURSE_TRACK_LABELS: Record<string, string> = {
  starter: 'Starter-Lehrgang',
  pro: 'Pro-Lehrgang',
  allgemein: 'Allgemeiner Lehrgang',
}

export const COURSE_LEVELS = ['Starter', 'Pro', 'Allgemein'] as const

export const MODULE_STATUSES = ['not-started', 'in-progress', 'completed', 'locked'] as const
export const MODULE_STATUS_LABELS: Record<string, string> = {
  'not-started': 'Nicht begonnen',
  'in-progress': 'In Bearbeitung',
  completed: 'Abgeschlossen',
  locked: 'Gesperrt',
}

export const LESSON_TYPES = ['video', 'text', 'video+text'] as const
export const LESSON_TYPE_LABELS: Record<string, string> = {
  video: 'Video',
  text: 'Text',
  'video+text': 'Video + Text',
}

export const ART_DES_STUECKES = ['volkstuemlich', 'bekannte_melodie'] as const
export const ART_LABELS: Record<string, string> = {
  volkstuemlich: 'Volkstümlich',
  bekannte_melodie: 'Bekannte Melodie',
}

// Taktarten (Standard) — über Tag-Verwaltung erweiterbar.
export const TAKTARTEN = [
  'Schottisch', 'Ländler', 'Walzer', 'Mazurka', 'Polka',
  'Schnellpolka', 'Stümpäli', 'Marsch', 'Lied',
] as const

// Stil-Tags für volkstümliche Stücke.
export const STIL_TAGS = [
  'Urchig', 'Modern', 'Konzertant', 'Illgauer Stil',
  'Innerschwyzer Stil', 'Berner Stil', 'Bündner Stil',
] as const

// Genre-Tags für bekannte Melodien.
export const GENRE_TAGS = ['Schlager', 'Kinderlied', 'Weihnachtslied', 'Pop', 'Rock'] as const

export const MEDIA_TYPES = ['audio', 'youtube'] as const

export const TEAM_ROLES = ['admin', 'editor', 'teacher'] as const
export const TEAM_ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  editor: 'Redaktion',
  teacher: 'Lehrperson',
}

// Standard-Farben für Stimmen/Mixer (LAEMU-Palette pro Instrumentengruppe).
export const VOICE_COLORS: Record<string, string> = {
  Handorgel: '#C4973A',
  Schwyzerörgeli: '#5A8A6A',
  Klavier: '#7A6A9A',
  Klavierbegleitung: '#7A6A9A',
  Bass: '#8A5A4A',
  Bassgeige: '#8A5A4A',
  Klarinette: '#2563eb',
}

export const TAG_CATEGORIES = ['stil', 'genre', 'taktart', 'auto'] as const
export const TAG_CATEGORY_LABELS: Record<string, string> = {
  stil: 'Stil (volkstümlich)',
  genre: 'Genre (bekannte Melodie)',
  taktart: 'Taktart',
  auto: 'Auto-Tag',
}
