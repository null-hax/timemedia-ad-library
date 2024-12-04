export function getLineColors(index: number) {
  const colors = [
    { line: '#0891b2', background: '#67e8f9' }, // Cyan-600 & Cyan-300
    { line: '#059669', background: '#6ee7b7' }, // Emerald-600 & Emerald-300  
    { line: '#c026d3', background: '#f0abfc' }, // Fuchsia-600 & Fuchsia-300
    { line: '#7c3aed', background: '#c4b5fd' }, // Violet-600 & Violet-300
    { line: '#e11d48', background: '#fda4af' }, // Rose-600 & Rose-300
  ]
  return colors[index % colors.length]
}

// Common chart colors
export const chartColors = {
  primary: '#06b6d4',      // Cyan-500
  secondary: '#64748b',    // Slate-500
  muted: '#475569',       // Slate-400
  border: '#e2e8f0',      // Slate-200
  background: '#f8fafc',  // Slate-50
  grid: '#e2e8f0',       // Slate-200
} 