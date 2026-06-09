import type { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

// Wiederverwendbare Seed-Logik — wird sowohl vom CLI-Seed (prisma/seed.ts) als
// auch vom Laufzeit-Auto-Setup (src/lib/ensureDb.ts) genutzt.

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function seedAdmin(db: PrismaClient) {
  const email = (process.env.SEED_ADMIN_EMAIL || 'team@laemu.ch').toLowerCase()
  const password = process.env.SEED_ADMIN_PASSWORD || 'laemu-team-2026'
  const name = process.env.SEED_ADMIN_NAME || 'LAEMU Team'

  const existing = await db.teamUser.findUnique({ where: { email } })
  if (existing) return
  await db.teamUser.create({
    data: { email, name, role: 'admin', passwordHash: await bcrypt.hash(password, 10) },
  })
}

async function seedTags(db: PrismaClient) {
  const data: { category: string; value: string }[] = [
    ...['Urchig', 'Modern', 'Konzertant', 'Illgauer Stil', 'Innerschwyzer Stil', 'Berner Stil', 'Bündner Stil'].map((value) => ({ category: 'stil', value })),
    ...['Schlager', 'Kinderlied', 'Weihnachtslied', 'Pop', 'Rock'].map((value) => ({ category: 'genre', value })),
    ...['Schottisch', 'Ländler', 'Walzer', 'Mazurka', 'Polka', 'Schnellpolka', 'Stümpäli', 'Marsch', 'Lied'].map((value) => ({ category: 'taktart', value })),
  ]
  for (const t of data) {
    await db.tag.upsert({
      where: { category_value: { category: t.category, value: t.value } },
      update: {},
      create: t,
    })
  }
}

async function seedContent(db: PrismaClient) {
  const pieceCount = await db.piece.count()
  if (pieceCount > 0) return

  const instrumentDefs = [
    { slug: 'schwyzer', label: 'Schwyzerörgeli', emoji: '🎶', description: 'Diatonisch und voller Seele', sortOrder: 0 },
    { slug: 'handorgel', label: 'Handorgel', emoji: '🪗', description: 'Das Herzstück der Ländlermusik', sortOrder: 1 },
    { slug: 'bassgeige', label: 'Bassgeige', emoji: '🎻', description: 'Das rhythmische Fundament', sortOrder: 2 },
    { slug: 'klavierbegleitung', label: 'Klavierbegleitung', emoji: '🎹', description: 'Harmonische Begleitung', sortOrder: 3 },
    { slug: 'klarinette', label: 'Klarinette', emoji: '🎵', description: 'Die singende Stimme', sortOrder: 4 },
  ]
  const instruments: Record<string, string> = {}
  for (const def of instrumentDefs) {
    const inst = await db.instrument.create({ data: def })
    instruments[def.slug] = inst.id
  }

  const teacherDefs = [
    { name: 'Hansruedi Wenger', handle: '@hansruedi_wenger', instrument: 'Handorgel', bio: 'Über 20 Jahre Unterrichtserfahrung. Mitglied der Ländlerkapelle Hess.' },
    { name: 'Cyrill Rusch', handle: '@cyrill_rusch', instrument: 'Schwyzerörgeli', bio: 'Preisgekrönter Örgelist.' },
    { name: 'Franz Hess', handle: '@franz_hess', instrument: 'Klavier- & Bassbegleitung', bio: 'Harmonischer Anker vieler Kapellen.' },
    { name: 'Seebi Diener', handle: '@seebi_diener', instrument: 'Handorgel', bio: 'Spezialist für Taktarten & Rhythmus.' },
    { name: 'Cécile Schmidig', handle: '@cecile_schmidig', instrument: 'Bühnenpräsenz', bio: 'Coachin für Auftritt & Ausstrahlung.' },
  ]
  const teachers: Record<string, string> = {}
  for (let i = 0; i < teacherDefs.length; i++) {
    const def = teacherDefs[i]
    const t = await db.teacher.create({ data: { ...def, sortOrder: i } })
    teachers[def.name] = t.id
  }

  type L = { title: string; duration: string; type: string }
  type M = { title: string; status: string; lessons: L[] }
  type C = {
    title: string; instrument: string | null; track: string; level: string
    emoji: string; teacher: string; durationLabel: string; modules: M[]
  }

  const courseDefs: C[] = [
    {
      title: 'Grundlagenkurs', instrument: 'handorgel', track: 'starter', level: 'Starter',
      emoji: '🪗', teacher: 'Hansruedi Wenger', durationLabel: '8h',
      modules: [
        { title: 'Einführung', status: 'completed', lessons: [
          { title: 'Auspacken des Instrumentes', duration: '5 min', type: 'video' },
          { title: 'Stimmen & Intonation', duration: '8 min', type: 'video' },
          { title: 'Die richtige Haltung', duration: '10 min', type: 'video' },
          { title: 'Die Knöpfe kennenlernen', duration: '12 min', type: 'video' },
          { title: 'Dein erster Klang', duration: '7 min', type: 'video' },
        ] },
        { title: 'Erste Schritte mit der Handorgel', status: 'in-progress', lessons: [
          { title: 'Die Bassseite verstehen', duration: '10 min', type: 'video' },
          { title: 'Die Diskantseite', duration: '12 min', type: 'video' },
          { title: 'Koordination beider Hände', duration: '15 min', type: 'video+text' },
          { title: 'Erste Übung: Polka-Rhythmus', duration: '18 min', type: 'video' },
        ] },
        { title: 'System der Handorgel', status: 'not-started', lessons: [
          { title: 'Die Tonleiter', duration: '8 min', type: 'video+text' },
          { title: 'Grundakkorde', duration: '12 min', type: 'video' },
          { title: 'Bassbegleitung', duration: '15 min', type: 'video' },
        ] },
      ],
    },
    {
      title: 'Grundlagenkurs Schwyzerörgeli', instrument: 'schwyzer', track: 'starter', level: 'Starter',
      emoji: '🎶', teacher: 'Cyrill Rusch', durationLabel: '7h',
      modules: [
        { title: 'Einführung ins Schwyzerörgeli', status: 'completed', lessons: [
          { title: 'Das Schwyzerörgeli kennenlernen', duration: '6 min', type: 'video' },
          { title: 'Stimmung & Pflege im Überblick', duration: '9 min', type: 'video' },
          { title: 'Die richtige Haltung', duration: '10 min', type: 'video' },
        ] },
        { title: 'Das diatonische System verstehen', status: 'not-started', lessons: [
          { title: 'Wie das diatonische System funktioniert', duration: '11 min', type: 'video+text' },
          { title: 'Grundakkorde auf der Bassseite', duration: '13 min', type: 'video' },
        ] },
      ],
    },
    {
      title: 'Harmonielehre', instrument: null, track: 'allgemein', level: 'Allgemein',
      emoji: '🎼', teacher: 'Franz Hess', durationLabel: '6h',
      modules: [
        { title: 'Grundlagen der Harmonielehre', status: 'completed', lessons: [
          { title: 'Intervalle verstehen', duration: '11 min', type: 'video+text' },
          { title: 'Dur- und Moll-Tonleitern', duration: '13 min', type: 'video' },
          { title: 'Dreiklänge bilden', duration: '10 min', type: 'video' },
        ] },
        { title: 'Akkorde & Kadenzen', status: 'in-progress', lessons: [
          { title: 'Die Grundkadenz (I–IV–V)', duration: '14 min', type: 'video+text' },
          { title: 'Akkord-Umkehrungen', duration: '12 min', type: 'video' },
        ] },
      ],
    },
    {
      title: 'Taktarten in der Ländlermusik', instrument: null, track: 'allgemein', level: 'Allgemein',
      emoji: '🥁', teacher: 'Seebi Diener', durationLabel: '4h',
      modules: [
        { title: 'Die Grundtaktarten', status: 'completed', lessons: [
          { title: 'Walzer — der 3/4-Takt', duration: '9 min', type: 'video' },
          { title: 'Polka — der 2/4-Takt', duration: '8 min', type: 'video' },
          { title: 'Marsch — der 4/4-Takt', duration: '8 min', type: 'video' },
        ] },
      ],
    },
    {
      title: 'Bühnenpräsenz', instrument: null, track: 'allgemein', level: 'Allgemein',
      emoji: '🎤', teacher: 'Cécile Schmidig', durationLabel: '3h',
      modules: [
        { title: 'Sicher auftreten', status: 'not-started', lessons: [
          { title: 'Lampenfieber meistern', duration: '12 min', type: 'video+text' },
          { title: 'Körperhaltung & Ausstrahlung', duration: '10 min', type: 'video' },
        ] },
      ],
    },
  ]

  for (let ci = 0; ci < courseDefs.length; ci++) {
    const c = courseDefs[ci]
    await db.course.create({
      data: {
        title: c.title, slug: slugify(c.title), track: c.track, level: c.level,
        emoji: c.emoji, teacherName: c.teacher, durationLabel: c.durationLabel,
        sortOrder: ci, published: true,
        instrumentId: c.instrument ? instruments[c.instrument] : null,
        modules: {
          create: c.modules.map((m, mi) => ({
            title: m.title, status: m.status, sortOrder: mi,
            lessons: {
              create: m.lessons.map((l, li) => ({
                title: l.title, durationLabel: l.duration, type: l.type, sortOrder: li, published: true,
              })),
            },
          })),
        },
      },
    })
  }

  const pieceDefs = [
    { title: 'Dr Alperose', artist: 'Willi Valotti', composer: 'Willi Valotti', year: 1978, instrument: 'handorgel', formation: 'Trio', taktart: 'Walzer', plan: 'starter', difficultyNum: 3, level: 2, art: 'volkstuemlich', stil: ['Urchig', 'Innerschwyzer Stil'], genre: [] as string[], auto: ['Handorgel', 'Schwyzerörgeli', 'Starter', 'Grundlagenkurs'], violin: true, griff: true, mixer: true, img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80', rich: true },
    { title: 'Ländler im Dreivierteltakt', artist: 'Kapelle Hess-Ruedi-Hegner', composer: 'Hess', year: 1995, instrument: 'schwyzer', formation: 'Kapelle', taktart: 'Ländler', plan: 'starter', difficultyNum: 2, level: 1, art: 'volkstuemlich', stil: ['Modern', 'Konzertant'], genre: [] as string[], auto: ['Schwyzerörgeli', 'Starter'], violin: true, griff: false, mixer: false, img: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=800&q=80', rich: false },
    { title: 'Abendstern-Polka', artist: 'Bodästänix', composer: 'Unbekannt', year: 2003, instrument: 'handorgel', formation: 'Quartett', taktart: 'Polka', plan: 'pro', difficultyNum: 4, level: 3, art: 'volkstuemlich', stil: ['Urchig', 'Berner Stil'], genre: [] as string[], auto: ['Handorgel', 'Pro'], violin: false, griff: true, mixer: false, img: 'https://images.unsplash.com/photo-1415886670524-cc42c35e9fd4?w=800&q=80', rich: false },
    { title: 'Innerschwizer Schottisch', artist: 'Trio Rigi', composer: 'Müller', year: 1988, instrument: 'klarinette', formation: 'Trio', taktart: 'Schottisch', plan: 'starter', difficultyNum: 3, level: 2, art: 'volkstuemlich', stil: ['Innerschwyzer Stil'], genre: [] as string[], auto: ['Klarinette', 'Starter'], violin: false, griff: false, mixer: false, img: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&q=80', rich: false },
    { title: 'Walzer am See', artist: 'Lisa Frei', composer: 'Frei', year: 2015, instrument: 'klavierbegleitung', formation: 'Solo', taktart: 'Walzer', plan: 'free', difficultyNum: 2, level: 2, art: 'volkstuemlich', stil: ['Modern'], genre: [] as string[], auto: ['Klavierbegleitung', 'Free'], violin: true, griff: false, mixer: false, img: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80', rich: false },
    { title: 'Bergbach-Mazurka', artist: 'Hess-Rusch-Hegner', composer: 'Rusch', year: 1972, instrument: 'bassgeige', formation: 'Kapelle', taktart: 'Mazurka', plan: 'pro', difficultyNum: 5, level: 4, art: 'volkstuemlich', stil: ['Konzertant', 'Bündner Stil'], genre: [] as string[], auto: ['Bassgeige', 'Pro'], violin: true, griff: true, mixer: false, img: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80', rich: false },
    { title: 'Stille Nacht', artist: 'Verschiedene Kapellen', composer: 'Franz Xaver Gruber', year: 1818, instrument: 'handorgel', formation: 'Trio', taktart: '', plan: 'free', difficultyNum: 1, level: 1, art: 'bekannte_melodie', stil: [] as string[], genre: ['Weihnachtslied'], auto: ['Handorgel', 'Free', 'Bekannte Melodie'], violin: true, griff: false, mixer: false, img: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&q=80', rich: false },
  ]

  for (const p of pieceDefs) {
    const piece = await db.piece.create({
      data: {
        title: p.title, slug: slugify(p.title), artist: p.artist, composer: p.composer, year: p.year,
        formation: p.formation, taktart: p.taktart, plan: p.plan, difficultyNum: p.difficultyNum, level: p.level,
        artDesStueckes: p.art, hasViolin: p.violin, hasGriff: p.griff, hasMixer: p.mixer,
        styleTags: JSON.stringify(p.stil), melodieTags: JSON.stringify(p.genre), autoTags: JSON.stringify(p.auto),
        imageUrl: p.img, published: true,
        instrumentId: instruments[p.instrument], instrumentName: instrumentDefs.find((i) => i.slug === p.instrument)?.label ?? '',
      },
    })

    if (p.rich) {
      await db.piece.update({
        where: { id: piece.id },
        data: {
          meter: '3/4', stufen: 3,
          intro: 'Dr Alperose ist ein klassischer Ländlerwalzer im 3/4-Takt, komponiert von Willi Valotti im Jahr 1978.',
          lyrics: "Wo d'Alperose blüeht im Abedsunneschii,\nDört isch mis Herz, dört mueß i immer sii.",
          spotifyUrl: 'https://open.spotify.com/',
          formations: JSON.stringify(['Hess-Rusch-Hegner Trio', 'Kapelle Schwyz', 'Bodästänix']),
          teachers: { connect: [{ id: teachers['Hansruedi Wenger'] }, { id: teachers['Cyrill Rusch'] }, { id: teachers['Franz Hess'] }] },
          sheets: { create: [
            { label: 'Violinschlüssel', sheetKey: 'violin', price: 5, sortOrder: 0 },
            { label: 'LAEMU-Notation', sheetKey: 'laemu', price: 5, sortOrder: 1 },
            { label: 'Griffschrift', sheetKey: 'griff', price: 5, sortOrder: 2 },
          ] },
          mixerMusicians: { create: [
            { name: 'Seebi Diener', voice: '1. Stimme', instrument: 'Handorgel', volume: 85, color: '#C4973A', sortOrder: 0 },
            { name: 'Cyrill Rusch', voice: '2. Stimme', instrument: 'Schwyzerörgeli', volume: 75, color: '#5A8A6A', sortOrder: 1 },
            { name: 'Franz Hess', voice: 'Begleitung', instrument: 'Klavier', volume: 70, color: '#7A6A9A', sortOrder: 2 },
            { name: 'Simon Rusch', voice: 'Bassbegleitung', instrument: 'Bass', volume: 68, muted: true, color: '#8A5A4A', sortOrder: 3 },
          ] },
          originalRecordings: { create: [
            { label: 'Originalaufnahme 1978 (Ur-Formation)', type: 'audio', artist: 'Willi Valotti', sortOrder: 0 },
            { label: 'Hess-Rusch-Hegner Trio', type: 'youtube', artist: 'Live-Aufnahme 2019', sortOrder: 1 },
          ] },
          tontraeger: { create: [
            { label: 'LAEMU – Best of Ländlermusik Vol. 3', year: 2022, artist: 'Verschiedene Künstler', sortOrder: 0 },
            { label: 'Willi Valotti – Original-Aufnahmen', year: 1978, artist: 'Willi Valotti', sortOrder: 1 },
          ] },
          voiceSections: { create: [
            {
              label: '1. Stimme Handorgel', instrument: 'Handorgel', color: '#C4973A', hasLaemuPlayer: true, sortOrder: 0,
              videos: { create: [
                { label: '1. Stimme — Einführung & Takt 1–8', durationLabel: '12 Min.', sortOrder: 0 },
                { label: '1. Stimme — Takt 9–16 mit Übergängen', durationLabel: '14 Min.', sortOrder: 1 },
                { label: '1. Stimme — Teil B & Zusammenfassung', durationLabel: '11 Min.', sortOrder: 2 },
              ] },
              sheets: { create: [
                { label: 'Violinschlüssel', sheetKey: 'violin', price: 5, sortOrder: 0 },
                { label: 'Griffschrift', sheetKey: 'griff', price: 5, sortOrder: 1 },
              ] },
              audioSamples: { create: [
                { label: 'Vorspielen — ganzes Stück', durationLabel: '3:42', type: 'audio', sortOrder: 0 },
                { label: 'Slow-Version 50%', durationLabel: '7:24', type: 'audio', sortOrder: 1 },
              ] },
            },
            {
              label: '2. Stimme Handorgel', instrument: 'Handorgel', color: '#C4973A', hasLaemuPlayer: true, sortOrder: 1,
              videos: { create: [
                { label: '2. Stimme — Einführung & Begleitfiguren', durationLabel: '10 Min.', sortOrder: 0 },
              ] },
              sheets: { create: [{ label: 'Violinschlüssel', sheetKey: 'violin', price: 5, sortOrder: 0 }] },
            },
            {
              label: 'Bassbegleitung', instrument: 'Bass', color: '#8A5A4A', hasLaemuPlayer: true, sortOrder: 2,
              videos: { create: [
                { label: 'Bass — Grundrhythmus im 3/4-Takt', durationLabel: '9 Min.', sortOrder: 0 },
              ] },
              sheets: { create: [{ label: 'Bassbegleitung (Notation)', sheetKey: 'bass', price: 5, sortOrder: 0 }] },
            },
          ] },
        },
      })
    }
  }

  const wishes = [
    { title: 'S Röseli', composer: 'Trad.', votes: { 'Handorgel (1. Stimme)': 14, 'Schwyzerörgeli (1. Stimme)': 9, 'Bassgeige': 4, 'Handorgel (2. Stimme)': 6 }, available: ['Schwyzerörgeli (1. Stimme)'] },
    { title: 'Märzenschnee-Ländler', composer: '', votes: { 'Schwyzerörgeli (1. Stimme)': 17, 'Klarinette (1. Stimme)': 5 }, available: [] as string[] },
    { title: 'Luzerner Polka', composer: 'R. Suter', votes: { 'Klarinette (1. Stimme)': 28, 'Handorgel (1. Stimme)': 13, 'Bassgeige': 7 }, available: [] as string[] },
  ]
  for (const w of wishes) {
    await db.wish.create({
      data: { title: w.title, composer: w.composer, votes: JSON.stringify(w.votes), available: JSON.stringify(w.available) },
    })
  }
}

// Komplettes Seeding (idempotent: vorhandene Inhalte werden nicht dupliziert).
export async function seedDatabase(db: PrismaClient) {
  await seedAdmin(db)
  await seedTags(db)
  await seedContent(db)
}
