import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { PageHeader } from '@/components/admin/PageHeader'
import { InstrumentForm } from '@/components/admin/InstrumentForm'

export const dynamic = 'force-dynamic'

export default async function EditInstrumentPage({ params }: { params: { id: string } }) {
  const instrument = await db.instrument.findUnique({ where: { id: params.id } })
  if (!instrument) notFound()

  return (
    <div>
      <PageHeader
        title={`${instrument.emoji} ${instrument.label}`}
        subtitle="Instrument bearbeiten"
        back={{ href: '/admin/instrumente', label: 'Instrumente' }}
      />
      <InstrumentForm instrument={instrument} />
    </div>
  )
}
