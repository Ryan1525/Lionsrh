import { useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { money } from './config'
import type { Row } from './record-form'
import { benefits, forecastMonths, monthKey, monthLabel, payrollSummary } from './payroll-report'

export function PayrollOverview({ employees, payroll }: { employees: Row[]; payroll: Row[] }) {
 const [now] = useState(() => new Date())
 const current = monthKey(now)
 const months = [...new Set(payroll.map(row => String(row['competencia'])))].filter(month => /^\d{4}-(0[1-9]|1[0-2])$/.test(month)).sort().reverse()
 const [selected, setSelected] = useState(months.find(month => month < current) ?? months[0] ?? current)
 const [horizon, setHorizon] = useState(6)
 const rows = payroll.filter(row => row['competencia'] === selected)
 const summary = payrollSummary(rows)
 const forecasts = forecastMonths(employees, now, horizon)
 const name = (row: Row) => String(employees.find(employee => employee.id === row['funcionario_id'])?.['nome'] ?? 'Funcionário')
 function exportCsv(header: string[], data: unknown[][], filename: string) {
  const cell = (value: unknown) => `"${String(value).replace(/^[=+@-]/, "'").replace(/"/g, '""')}"`
  const blob = new Blob(['\ufeff' + [header, ...data].map(row => row.map(cell).join(';')).join('\r\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob), link = document.createElement('a')
  link.href = url; link.download = filename; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
 }
 return <section id="relatorio-pagamentos" className="mt-10 scroll-mt-6">
  <div className="section-heading"><h2>Salários e benefícios</h2></div>
  <Tabs defaultValue="history">
   <TabsList><TabsTrigger value="history">Histórico mensal</TabsTrigger><TabsTrigger value="forecast">Previsão de pagamentos</TabsTrigger></TabsList>
   <TabsContent value="history" className="mt-5">
    <div className="list-toolbar"><label className="field-label">Competência<select aria-label="Competência do relatório" className="form-control" value={selected} onChange={event => setSelected(event.target.value)}>{months.length ? months.map(month => <option key={month} value={month}>{monthLabel(month)}</option>) : <option value={current}>{monthLabel(current)}</option>}</select></label><Button variant="outline" disabled={!rows.length} onClick={() => exportCsv(['Funcionário','Competência','Salário base','Vale-alimentação','Vale-transporte','Líquido salarial','Total com benefícios','Situação'], rows.map(row => [name(row),selected,money(row['salario_base']),money(row['vale_alimentacao']),money(row['vale_transporte']),money(row['liquido']),money(Number(row['liquido']) + benefits(row)),row['status']]), `pagamentos-${selected}.csv`)}><Download/>Exportar mês</Button></div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-5">{[{label:'Salários base registrados',value:summary.base},{label:'Benefícios registrados',value:summary.food + summary.transport},{label:'Total registrado com benefícios',value:summary.total},{label:'Pago com benefícios',value:summary.paid}].map(item => <div key={item.label} className="border-b border-border py-3"><span className="text-sm text-muted-foreground">{item.label}</span><strong className="block font-mono text-lg mt-2">{money(item.value)}</strong></div>)}</div>
    <div className="table-scroll"><table className="records-table"><thead><tr><th>Mês</th><th>Registros</th><th>Salários base</th><th>Alimentação</th><th>Transporte</th><th>Total com benefícios</th><th>Pago</th></tr></thead><tbody>{months.map(month => { const totals = payrollSummary(payroll.filter(row => row['competencia'] === month)); return <tr key={month}><td><Button variant="link" className="px-0" onClick={() => setSelected(month)}>{monthLabel(month)}</Button></td><td>{totals.count}</td><td>{money(totals.base)}</td><td>{money(totals.food)}</td><td>{money(totals.transport)}</td><td className="font-mono">{money(totals.total)}</td><td>{money(totals.paid)}</td></tr> })}</tbody></table></div>
    <h3 className="font-semibold mt-6 mb-3">Detalhamento · {monthLabel(selected)}</h3>
    <div className="table-scroll"><table className="records-table"><thead><tr><th>Funcionário</th><th>Salário base</th><th>Alimentação</th><th>Transporte</th><th>Líquido salarial</th><th>Total com benefícios</th><th>Situação</th></tr></thead><tbody>{rows.map(row => <tr key={row.id}><td>{name(row)}</td><td>{money(row['salario_base'])}</td><td>{money(row['vale_alimentacao'])}</td><td>{money(row['vale_transporte'])}</td><td>{money(row['liquido'])}</td><td className="font-mono text-primary">{money(Number(row['liquido']) + benefits(row))}</td><td>{String(row['status'])}</td></tr>)}</tbody></table>{!rows.length && <div className="empty-state"><h3>Nenhuma folha registrada nesta competência</h3></div>}</div>
   </TabsContent>
   <TabsContent value="forecast" className="mt-5">
    <div className="list-toolbar"><label className="field-label">Período<select aria-label="Meses de previsão" className="form-control" value={horizon} onChange={event => setHorizon(Number(event.target.value))}>{[3,6,12].map(value => <option key={value} value={value}>Próximos {value} meses</option>)}</select></label><Button variant="outline" onClick={() => exportCsv(['Mês','Funcionários','Salários base','Vale-alimentação','Vale-transporte','Total previsto'],forecasts.map(row => [row.month,row.count,money(row.base),money(row.food),money(row.transport),money(row.total)]),'previsao-pagamentos.csv')}><Download/>Exportar previsão</Button></div>
    <p className="text-sm text-muted-foreground mb-5">Estimativa com salários base e benefícios atuais dos funcionários ativos. Não inclui adicionais, descontos, encargos, 13º ou alterações futuras.</p>
    <div className="table-scroll"><table className="records-table"><thead><tr><th>Mês</th><th>Funcionários</th><th>Salários base</th><th>Alimentação</th><th>Transporte</th><th>Total previsto</th></tr></thead><tbody>{forecasts.map(row => <tr key={row.month}><td>{monthLabel(row.month)}</td><td>{row.count}</td><td>{money(row.base)}</td><td>{money(row.food)}</td><td>{money(row.transport)}</td><td className="font-mono text-primary">{money(row.total)}</td></tr>)}</tbody></table></div>
   </TabsContent>
  </Tabs>
 </section>
}