export function getLineColors(index: number) {
  const colors = [
    { line: '#f97316', background: 'rgba(249, 115, 22, 0.1)' },   // Orange-500
    { line: '#fb923c', background: 'rgba(251, 146, 60, 0.1)' },   // Orange-400
    { line: '#fdba74', background: 'rgba(253, 186, 116, 0.1)' },  // Orange-300
    { line: '#fed7aa', background: 'rgba(254, 215, 170, 0.1)' },  // Orange-200
    { line: '#ffedd5', background: 'rgba(255, 237, 213, 0.1)' },  // Orange-100
  ]
  return colors[index % colors.length]
}

// Common chart colors
export const chartColors = {
  primary: '#f97316',      // Orange-500
  secondary: '#64748b',    // Slate-500
  muted: '#94a3b8',       // Slate-400
  border: '#e2e8f0',      // Slate-200
  background: '#f8fafc',  // Slate-50
  grid: '#f1f5f9',       // Slate-100
} 