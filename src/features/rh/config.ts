export const sections = {
 painel: { title: 'Visão geral', table: 'funcionarios', subtitle: 'Pessoas, rotinas e próximos passos.' },
 funcionarios: { title: 'Funcionários ativos', table: 'funcionarios', subtitle: 'Sua equipe, organizada em um só lugar.' },
 desligados: { title: 'Funcionários desligados', table: 'funcionarios', subtitle: 'Histórico de vínculos e desligamentos.' },
 ferias: { title: 'Férias', table: 'ferias', subtitle: 'Planejamento e acompanhamento dos períodos de descanso.' },
 atestados: { title: 'Atestados', table: 'atestados', subtitle: 'Registros de afastamentos e justificativas.' },
 declaracoes: { title: 'Declarações', table: 'declaracoes', subtitle: 'Declarações e comprovantes de vínculo.' },
 folha: { title: 'Folha de pagamento', table: 'folha_pagamento', subtitle: 'Salários, adicionais e descontos por competência.' },
 documentos: { title: 'Documentos', table: 'documentos', subtitle: 'Arquivos da equipe, reunidos com segurança.' },
} as const
export type Section = keyof typeof sections
export type Table = typeof sections[Section]['table']
export type Field = { name: string; label: string; type?: string; required?: boolean; options?: string[] }
const employee: Field = { name: 'funcionario_id', label: 'Funcionário', type: 'employee', required: true }
export const fields: Record<Table, Field[]> = {
 funcionarios: [ {name:'matricula',label:'Matrícula',required:true},{name:'nome',label:'Nome completo',required:true},{name:'cargo',label:'Cargo',required:true},{name:'departamento',label:'Departamento',required:true},{name:'email',label:'E-mail',type:'email'},{name:'telefone',label:'Telefone'},{name:'cpf',label:'CPF'},{name:'data_admissao',label:'Data de admissão',type:'date',required:true},{name:'salario_base',label:'Salário base (R$)',type:'number',required:true},{name:'vale_alimentacao',label:'Vale-alimentação mensal (R$)',type:'number',required:true},{name:'vale_transporte',label:'Vale-transporte mensal (R$)',type:'number',required:true}],
 ferias: [employee,{name:'data_inicio',label:'Início',type:'date',required:true},{name:'data_fim',label:'Fim',type:'date',required:true},{name:'dias',label:'Dias',type:'number',required:true},{name:'status',label:'Situação',options:['pendente','aprovada','concluida','cancelada']},{name:'observacao',label:'Observação',type:'textarea'}],
 atestados: [employee,{name:'data_inicio',label:'Início',type:'date',required:true},{name:'dias',label:'Dias de afastamento',type:'number',required:true},{name:'cid',label:'CID (opcional)'},{name:'motivo',label:'Motivo',type:'textarea'}],
 declaracoes: [employee,{name:'tipo',label:'Tipo',options:['vinculo','rendimentos','outro']},{name:'conteudo',label:'Conteúdo da declaração',type:'textarea',required:true}],
 folha_pagamento: [employee,{name:'competencia',label:'Competência',type:'month',required:true},{name:'salario_base',label:'Salário base (R$)',type:'number',required:true},{name:'adicionais',label:'Adicionais (R$)',type:'number',required:true},{name:'descontos',label:'Descontos (R$)',type:'number',required:true},{name:'vale_alimentacao',label:'Vale-alimentação (R$)',type:'number',required:true},{name:'vale_transporte',label:'Vale-transporte (R$)',type:'number',required:true},{name:'status',label:'Situação',options:['aberta','fechada','paga']}],
 documentos: [employee,{name:'nome',label:'Nome do documento',required:true},{name:'tipo',label:'Tipo',options:['contrato','identificacao','atestado','comprovante','outro']}],
}
export function pageHead(title: string) { const description = `${title} no Lions RH. Gestão de funcionários e rotinas de recursos humanos.`; return { meta: [{title:`${title} | Lions RH`},{name:'description',content:description},{property:'og:title',content:`${title} | Lions RH`},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'}] } }
export const money = (value: unknown) => Number(value || 0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})
export const dateLabel = (value: unknown) => value ? (String(value).split('T')[0] ?? '').split('-').reverse().join('/') : '—'
