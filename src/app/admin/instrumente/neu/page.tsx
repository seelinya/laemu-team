import { PageHeader } from '@/components/admin/PageHeader'
import { InstrumentForm } from '@/components/admin/InstrumentForm'

export default function NeuInstrumentPage() {
  return (
    <div>
      <PageHeader
        title="Neues Instrument"
        back={{ href: '/admin/instrumente', label: 'Instrumente' }}
      />
      <InstrumentForm />
    </div>
  )
}
