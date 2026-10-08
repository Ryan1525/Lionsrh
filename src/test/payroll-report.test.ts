import { describe, expect, it } from 'vitest'
import { forecastMonths, monthKey, payrollSummary } from '@/features/rh/payroll-report'

describe('Monthly payroll reports', () => {
 it('keeps historical benefits and paid amounts separate from current employee rates', () => {
  const result = payrollSummary([{id:'1',salario_base:2000,liquido:1900,vale_alimentacao:400,vale_transporte:200,status:'paga'},{id:'2',salario_base:1000,liquido:900,vale_alimentacao:100,vale_transporte:50,status:'aberta'}])
  expect(result).toMatchObject({base:3000,net:2800,food:500,transport:250,total:3550,paid:2500,count:2})
 })
 it('forecasts only active, admitted employees and handles the year boundary', () => {
  const rows = [{id:'1',status:'ativo',data_admissao:'2026-01-01',salario_base:1000.10,vale_alimentacao:200.20,vale_transporte:50.30},{id:'2',status:'desligado',data_admissao:'2026-01-01',salario_base:9000},{id:'3',status:'ativo',data_admissao:'2027-02-01',salario_base:500}]
  const result = forecastMonths(rows, new Date('2026-12-15T00:00:00Z'), 3)
  expect(result[0]).toMatchObject({month:'2027-01',count:1,total:1250.60})
  expect(result[1]).toMatchObject({month:'2027-02',count:2,total:1750.60})
  expect(monthKey(new Date('2026-01-01T00:00:00Z'),-1)).toBe('2025-12')
 })
 it('handles an empty history and forecast', () => {
  expect(payrollSummary([]).total).toBe(0)
  expect(forecastMonths([],new Date('2026-10-01T00:00:00Z'),6)).toHaveLength(6)
 })
})