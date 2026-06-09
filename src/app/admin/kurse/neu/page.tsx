import { db } from '@/lib/db'
import { PageHeader } from '@/components/admin/PageHeader'
import { CourseForm } from '@/components/admin/CourseForm'

export const dynamic = 'force-dynamic'

export default async function NeuKursPage() {
  const [instruments, teachers] = await Promise.all([
    db.instrument.findMany({ orderBy: { sortOrder: 'asc' } }),
    db.teacher.findMany({ orderBy: { name: 'asc' } }),
  ])

  return (
    <div>
      <PageHeader
        title="Neuer Kurs"
        subtitle="Lege den Kurs an — Module und Lektionen folgen danach."
        back={{ href: '/admin/kurse', label: 'Kurse' }}
      />
      <CourseForm instruments={instruments} teachers={teachers} />
    </div>
  )
}
