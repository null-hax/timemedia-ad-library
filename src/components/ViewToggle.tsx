import { Button } from '@/components/ui/button'
import { LayoutGrid, Table as TableIcon } from 'lucide-react'

interface ViewToggleProps {
  value: 'card' | 'table'
  onChange: (view: 'card' | 'table') => void
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={value === 'card' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('card')}
      >
        <LayoutGrid className="h-4 w-4 mr-2" />
        Cards
      </Button>
      <Button
        variant={value === 'table' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('table')}
      >
        <TableIcon className="h-4 w-4 mr-2" />
        Table
      </Button>
    </div>
  )
}
