'use client'

import { Input } from '@/components/ui/input'

interface RangeFilterProps {
  min: number | null
  max: number | null
  onChange: (min: number | null, max: number | null) => void
  placeholder?: string
}

export function RangeFilter({
  min,
  max,
  onChange,
  placeholder = '',
}: RangeFilterProps) {
  return (
    <div className="flex gap-2">
      <Input
        type="number"
        placeholder={`${placeholder} Min`}
        value={min ?? ''}
        onChange={(e) => {
          const value = e.target.value ? parseInt(e.target.value) : null
          onChange(value, max)
        }}
        className="w-full"
      />
      <Input
        type="number"
        placeholder={`${placeholder} Max`}
        value={max ?? ''}
        onChange={(e) => {
          const value = e.target.value ? parseInt(e.target.value) : null
          onChange(min, value)
        }}
        className="w-full"
      />
    </div>
  )
}
