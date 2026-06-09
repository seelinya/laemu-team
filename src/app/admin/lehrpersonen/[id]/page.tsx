import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { PageHeader } from '@/components/admin/PageHeader'
import { TeacherForm } from '@/components/admin/TeacherForm'

export const dynamic = 'force-dynamic'

export default async function EditTeacherPage({ params }: { params: { id: string } }) {
  const teacher = await db.teacher.findUnique({ where: { id: params.id } })
  if (!teacher) notFound()

  return (
    <div>
      <PageHeader
        title={teacher.name}
        subtitle="Lehrperson bearbeiten"
        back={{ href: '/admin/lehrpersonen', label: 'Lehrpersonen' }}
      />
      <TeacherForm teacher={teacher} />
    </div>
  )
}
