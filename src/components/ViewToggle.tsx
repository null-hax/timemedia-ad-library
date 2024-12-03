import { Button } from '@/components/ui/button'
import { LayoutGrid, Table as TableIcon } from 'lucide-react'

interface ViewToggleProps {
  value: 'table' | 'card'
  onChange: (view: 'table' | 'card') => void
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={value === 'table' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('table')}
      >
        <TableIcon className="h-4 w-4 mr-2" />
        Table
      </Button>
      <Button
        variant={value === 'card' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('card')}
      >
        <LayoutGrid className="h-4 w-4 mr-2" />
        Cards
      </Button>
    </div>
  )
}
