import { PrismaClient } from '@prisma/client'
import { seedDatabase } from '../src/lib/seedData'

const db = new PrismaClient()

async function main() {
  console.log('🌱 LAEMU Team-Backend — Seed startet…')
  await seedDatabase(db)
  console.log('✅ Seed abgeschlossen.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
