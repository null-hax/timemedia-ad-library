'use client'

import * as React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { ChevronsUpDown, X } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

export interface Option {
  value: string
  label: string
}

interface MultiSelectProps {
  options: Option[]
  value: string[]
  onValueChange: (value: string[]) => void
  placeholder?: string
}

export function MultiSelect({
  options,
  value = [],
  onValueChange,
  placeholder = 'Select items...',
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')

  const selected = value
    .map(v => options.find(opt => opt.value === v))
    .filter((opt): opt is Option => opt !== undefined)

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleOption = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue]
    onValueChange(newValue)
  }

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <div className="flex gap-1 flex-wrap">
              {selected.length > 0 ? (
                <span className="text-sm">
                  {selected.length} selected
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">
                  {placeholder}
                </span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="p-2 w-[--trigger-width]" 
          style={{ '--trigger-width': 'var(--radix-popover-trigger-width)' } as React.CSSProperties}
          align="start"
          sideOffset={4}
        >
          <Input
            placeholder="Search newsletters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-2"
          />
          <ScrollArea className="h-60">
            <div className="space-y-2">
              {filteredOptions.map(option => (
                <div
                  key={option.value}
                  className="flex items-center gap-2 rounded-sm px-2 py-1.5 hover:bg-muted cursor-pointer"
                  onClick={() => toggleOption(option.value)}
                >
                  <Checkbox 
                    checked={value.includes(option.value)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">{option.label}</span>
                </div>
              ))}
              {filteredOptions.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-4">
                  No results found
                </div>
              )}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selected.map(item => (
            <Badge
              key={item.value}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => toggleOption(item.value)}
            >
              {item.label}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
} 