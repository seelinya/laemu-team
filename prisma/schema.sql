-- CreateTable
CREATE TABLE IF NOT EXISTS "TeamUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'editor',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Instrument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "emoji" TEXT NOT NULL DEFAULT '🎵',
    "description" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Teacher" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "handle" TEXT NOT NULL DEFAULT '',
    "instrument" TEXT NOT NULL DEFAULT '',
    "bio" TEXT NOT NULL DEFAULT '',
    "imageUrl" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "track" TEXT NOT NULL DEFAULT 'starter',
    "level" TEXT NOT NULL DEFAULT 'Starter',
    "emoji" TEXT NOT NULL DEFAULT '🎵',
    "imageUrl" TEXT NOT NULL DEFAULT '',
    "durationLabel" TEXT NOT NULL DEFAULT '',
    "teacherName" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "instrumentId" TEXT,
    CONSTRAINT "Course_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "Instrument" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Module" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'not-started',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "courseId" TEXT NOT NULL,
    CONSTRAINT "Module_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Lesson" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "durationLabel" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL DEFAULT 'video',
    "videoUrl" TEXT NOT NULL DEFAULT '',
    "textContent" TEXT NOT NULL DEFAULT '',
    "pdfUrl" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "moduleId" TEXT NOT NULL,
    CONSTRAINT "Lesson_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Piece" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL DEFAULT '',
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL DEFAULT '',
    "composer" TEXT NOT NULL DEFAULT '',
    "year" INTEGER,
    "formation" TEXT NOT NULL DEFAULT '',
    "artDesStueckes" TEXT NOT NULL DEFAULT 'volkstuemlich',
    "taktart" TEXT NOT NULL DEFAULT '',
    "plan" TEXT NOT NULL DEFAULT 'free',
    "difficultyNum" INTEGER NOT NULL DEFAULT 1,
    "level" INTEGER NOT NULL DEFAULT 1,
    "stufen" INTEGER NOT NULL DEFAULT 1,
    "meter" TEXT NOT NULL DEFAULT '',
    "intro" TEXT NOT NULL DEFAULT '',
    "lyrics" TEXT NOT NULL DEFAULT '',
    "spotifyUrl" TEXT NOT NULL DEFAULT '',
    "imageUrl" TEXT NOT NULL DEFAULT '',
    "masterVideoUrl" TEXT NOT NULL DEFAULT '',
    "hasMixer" BOOLEAN NOT NULL DEFAULT false,
    "hasViolin" BOOLEAN NOT NULL DEFAULT false,
    "hasGriff" BOOLEAN NOT NULL DEFAULT false,
    "price" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "styleTags" TEXT NOT NULL DEFAULT '[]',
    "melodieTags" TEXT NOT NULL DEFAULT '[]',
    "autoTags" TEXT NOT NULL DEFAULT '[]',
    "formations" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "instrumentId" TEXT,
    "instrumentName" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "Piece_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "Instrument" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "VoiceSection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "instrument" TEXT NOT NULL DEFAULT '',
    "color" TEXT NOT NULL DEFAULT '#C4973A',
    "hasLaemuPlayer" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "pieceId" TEXT NOT NULL,
    CONSTRAINT "VoiceSection_pieceId_fkey" FOREIGN KEY ("pieceId") REFERENCES "Piece" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "VoiceVideo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "durationLabel" TEXT NOT NULL DEFAULT '',
    "videoUrl" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "sectionId" TEXT NOT NULL,
    CONSTRAINT "VoiceVideo_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "VoiceSection" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "AudioSample" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "durationLabel" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL DEFAULT 'audio',
    "url" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "sectionId" TEXT NOT NULL,
    CONSTRAINT "AudioSample_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "VoiceSection" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Sheet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "sheetKey" TEXT NOT NULL DEFAULT '',
    "price" INTEGER NOT NULL DEFAULT 0,
    "pdfUrl" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "pieceId" TEXT,
    "sectionId" TEXT,
    CONSTRAINT "Sheet_pieceId_fkey" FOREIGN KEY ("pieceId") REFERENCES "Piece" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Sheet_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "VoiceSection" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "MixerMusician" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "voice" TEXT NOT NULL DEFAULT '',
    "instrument" TEXT NOT NULL DEFAULT '',
    "singing" TEXT NOT NULL DEFAULT '',
    "volume" INTEGER NOT NULL DEFAULT 80,
    "muted" BOOLEAN NOT NULL DEFAULT false,
    "color" TEXT NOT NULL DEFAULT '#C4973A',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "pieceId" TEXT NOT NULL,
    CONSTRAINT "MixerMusician_pieceId_fkey" FOREIGN KEY ("pieceId") REFERENCES "Piece" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "OriginalRecording" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'audio',
    "artist" TEXT NOT NULL DEFAULT '',
    "url" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "pieceId" TEXT NOT NULL,
    CONSTRAINT "OriginalRecording_pieceId_fkey" FOREIGN KEY ("pieceId") REFERENCES "Piece" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Tontraeger" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "year" INTEGER,
    "artist" TEXT NOT NULL DEFAULT '',
    "url" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "pieceId" TEXT NOT NULL,
    CONSTRAINT "Tontraeger_pieceId_fkey" FOREIGN KEY ("pieceId") REFERENCES "Piece" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Wish" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "composer" TEXT NOT NULL DEFAULT '',
    "votes" TEXT NOT NULL DEFAULT '{}',
    "available" TEXT NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'offen',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "MediaAsset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL DEFAULT '',
    "kind" TEXT NOT NULL DEFAULT 'other',
    "size" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "_PieceTeachers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PieceTeachers_A_fkey" FOREIGN KEY ("A") REFERENCES "Piece" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PieceTeachers_B_fkey" FOREIGN KEY ("B") REFERENCES "Teacher" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "TeamUser_email_key" ON "TeamUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Instrument_slug_key" ON "Instrument"("slug");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Tag_category_value_key" ON "Tag"("category", "value");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Course_instrumentId_idx" ON "Course"("instrumentId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Module_courseId_idx" ON "Module"("courseId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Lesson_moduleId_idx" ON "Lesson"("moduleId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Piece_instrumentId_idx" ON "Piece"("instrumentId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "VoiceSection_pieceId_idx" ON "VoiceSection"("pieceId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "VoiceVideo_sectionId_idx" ON "VoiceVideo"("sectionId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "AudioSample_sectionId_idx" ON "AudioSample"("sectionId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Sheet_pieceId_idx" ON "Sheet"("pieceId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Sheet_sectionId_idx" ON "Sheet"("sectionId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "MixerMusician_pieceId_idx" ON "MixerMusician"("pieceId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "OriginalRecording_pieceId_idx" ON "OriginalRecording"("pieceId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Tontraeger_pieceId_idx" ON "Tontraeger"("pieceId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "_PieceTeachers_AB_unique" ON "_PieceTeachers"("A", "B");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "_PieceTeachers_B_index" ON "_PieceTeachers"("B");

