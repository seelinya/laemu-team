import { PageHeader } from '@/components/admin/PageHeader'
import { TeacherForm } from '@/components/admin/TeacherForm'

export default function NeuTeacherPage() {
  return (
    <div>
      <PageHeader title="Neue Lehrperson" back={{ href: '/admin/lehrpersonen', label: 'Lehrpersonen' }} />
      <TeacherForm />
    </div>
  )
}
