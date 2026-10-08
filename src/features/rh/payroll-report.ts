import type { Row } from './record-form'

export const cents = (value: unknown) => Math.round(Number(value || 0) * 100)
export const benefits = (row: Row) => (cents(row['vale_alimentacao']) + cents(row['vale_transporte'])) / 100
export function monthKey(date: Date, offset = 0) {
 const month = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + offset, 1))
 return `${month.getUTCFullYear()}-${String(month.getUTCMonth() + 1).padStart(2, '0')}`
}
export const monthLabel = (month: string) => new Date(`${month}-01T12:00:00Z`).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' })
export function payrollSummary(rows: Row[]) {
 const sum = (key: string) => rows.reduce((total, row) => total + cents(row[key]), 0) / 100
 const base = sum('salario_base'), food = sum('vale_alimentacao'), transport = sum('vale_transporte'), net = sum('liquido')
 const total = (cents(net) + cents(food) + cents(transport)) / 100
 const paid = rows.filter(row => row['status'] === 'paga').reduce((total, row) => total + cents(row['liquido']) + cents(row['vale_alimentacao']) + cents(row['vale_transporte']), 0) / 100
 return { base, food, transport, net, total, paid, count: rows.length }
}
export function forecastMonths(employees: Row[], now: Date, count: number) {
 return Array.from({ length: count }, (_, index) => {
  const month = monthKey(now, index + 1)
  const rows = employees.filter(row => row['status'] === 'ativo' && String(row['data_admissao']).slice(0, 7) <= month)
  const base = rows.reduce((total, row) => total + cents(row['salario_base']), 0) / 100
  const food = rows.reduce((total, row) => total + cents(row['vale_alimentacao']), 0) / 100
  const transport = rows.reduce((total, row) => total + cents(row['vale_transporte']), 0) / 100
  return { month, count: rows.length, base, food, transport, total: (cents(base) + cents(food) + cents(transport)) / 100 }
 })
}