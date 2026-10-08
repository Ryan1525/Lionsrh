import { createServerFn } from '@tanstack/react-start'
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'
import { z } from 'zod'
const text = z.string().trim().min(1).max(500)
const optional = z.string().max(500).nullable().optional().transform(v=>v??null)
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
const amount = z.coerce.number().finite().min(0)
const employee = z.string().uuid()
const schemas = {
 funcionarios: z.object({matricula:text,nome:text,cargo:text,departamento:text,email:z.union([z.string().email(),z.literal('')]).nullable().optional().transform(v=>v??null),telefone:optional,cpf:optional,data_admissao:date,salario_base:amount,vale_alimentacao:amount.default(0),vale_transporte:amount.default(0)}),
 ferias: z.object({funcionario_id:employee,data_inicio:date,data_fim:date,dias:z.coerce.number().int().min(1).max(366),status:z.enum(['pendente','aprovada','concluida','cancelada']),observacao:optional}).refine(v=>v.data_fim>=v.data_inicio,{message:'A data final deve ser igual ou posterior ao início.'}),
 atestados:z.object({funcionario_id:employee,data_inicio:date,dias:z.coerce.number().int().min(1).max(366),cid:optional,motivo:optional}),
 declaracoes:z.object({funcionario_id:employee,tipo:z.enum(['vinculo','rendimentos','outro']),conteudo:z.string().trim().min(1).max(20000)}),
  folha_pagamento:z.object({funcionario_id:employee,competencia:z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),salario_base:amount,adicionais:amount,descontos:amount,vale_alimentacao:amount.default(0),vale_transporte:amount.default(0),status:z.enum(['aberta','fechada','paga'])}),
 documentos:z.object({funcionario_id:employee,nome:text,tipo:z.enum(['contrato','identificacao','atestado','comprovante','outro']),storage_path:z.string().min(1),tamanho:z.number().int().min(1).max(10485760),modulo:z.enum(['funcionarios','desligados','ferias','atestados','declaracoes','folha']).nullable().optional().transform(v=>v??null),registro_id:employee.nullable().optional().transform(v=>v??null)}).refine(v=>Boolean(v.modulo)===Boolean(v.registro_id),{message:'Informe o registro do anexo.'}),
}
const tables = z.enum(['funcionarios','ferias','atestados','declaracoes','folha_pagamento','documentos'])
export const getRhData = createServerFn({method:'GET'}).middleware([requireSupabaseAuth]).handler(async ({context}) => {
 const results = await Promise.all([context.supabase.from('funcionarios').select('*').order('nome'),context.supabase.from('ferias').select('*').order('created_at',{ascending:false}),context.supabase.from('atestados').select('*').order('created_at',{ascending:false}),context.supabase.from('declaracoes').select('*').order('created_at',{ascending:false}),context.supabase.from('folha_pagamento').select('*').order('competencia',{ascending:false}),context.supabase.from('documentos').select('*').order('created_at',{ascending:false})]);
 if(results.some(r=>r.error)) throw new Error('Não foi possível carregar os registros de RH. Tente novamente.')
 return {funcionarios:results[0].data ?? [],ferias:results[1].data ?? [],atestados:results[2].data ?? [],declaracoes:results[3].data ?? [],folha_pagamento:results[4].data ?? [],documentos:results[5].data ?? []}
})
export const saveRhRecord = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({table:tables,id:z.string().uuid().optional(),values:z.record(z.unknown())})).handler(async ({data,context})=>{
 const db=context.supabase; const {table,id,values}=data;
 function checked(result:{error:unknown;data:{id:string}|null}) { if(result.error||!result.data)throw new Error('Não foi possível salvar. Confira os campos e se a matrícula já existe.'); return result.data; }
 switch(table){
 case 'funcionarios': {const v=schemas.funcionarios.parse(values);return checked(id?await db.from('funcionarios').update(v).eq('id',id).select('id').single():await db.from('funcionarios').insert(v).select('id').single());}
 case 'ferias': {const v=schemas.ferias.parse(values);return checked(id?await db.from('ferias').update(v).eq('id',id).select('id').single():await db.from('ferias').insert(v).select('id').single());}
 case 'atestados': {const v=schemas.atestados.parse(values);return checked(id?await db.from('atestados').update(v).eq('id',id).select('id').single():await db.from('atestados').insert(v).select('id').single());}
 case 'declaracoes': {const v=schemas.declaracoes.parse(values);return checked(id?await db.from('declaracoes').update(v).eq('id',id).select('id').single():await db.from('declaracoes').insert(v).select('id').single());}
 case 'folha_pagamento': {const v=schemas.folha_pagamento.parse(values);const result=id?await db.from(table).update({...v,liquido:v.salario_base+v.adicionais-v.descontos}).eq('id',id).select('id').single():await db.from(table).insert({...v,liquido:v.salario_base+v.adicionais-v.descontos}).select('id').single();if(result.error)throw new Error('Não foi possível salvar a folha.');return result.data;}
  case 'documentos': { const v=schemas.documentos.parse(values); if(!v.storage_path.startsWith(`${context.userId}/`)) throw new Error('Arquivo inválido.');
   if(v.modulo&&v.registro_id){const targetTable=v.modulo==='desligados'?'funcionarios':v.modulo==='folha'?'folha_pagamento':v.modulo;const target=await db.from(targetTable).select('*').eq('id',v.registro_id).single();if(target.error||!target.data)throw new Error('Registro do anexo não encontrado.');const owner='funcionario_id' in target.data?target.data.funcionario_id:target.data.id;if(owner!==v.funcionario_id)throw new Error('Funcionário do anexo inválido.');}
   const folder=v.storage_path.slice(0,v.storage_path.lastIndexOf('/'));const filename=v.storage_path.slice(v.storage_path.lastIndexOf('/')+1);const stored=await db.storage.from('documentos').list(folder,{search:filename});if(stored.error||!stored.data.some(f=>f.name===filename&&Number(f.metadata?.['size'])===v.tamanho))throw new Error('Envie o arquivo antes de salvar o anexo.');
   return checked(id?await db.from('documentos').update(v).eq('id',id).select('id').single():await db.from('documentos').insert(v).select('id').single()); }
 }
})
export const terminateEmployee = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({id:employee,data_desligamento:date,motivo_desligamento:text})).handler(async({data,context})=>{const {id,...values}=data;const result=await context.supabase.from('funcionarios').update({...values,status:'desligado'}).eq('id',id).select('id').single();if(result.error)throw new Error('Não foi possível registrar o desligamento.');return result.data})
export const deleteRhRecord = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({table:tables,id:employee})).handler(async({data,context})=>{
 if(data.table==='funcionarios')throw new Error('Utilize o desligamento para preservar o histórico.');
  if(data.table!=='documentos'){const modulo=data.table==='folha_pagamento'?'folha':data.table;const attachments=await context.supabase.from('documentos').select('id,storage_path').eq('modulo',modulo).eq('registro_id',data.id);if(attachments.error)throw new Error('Não foi possível consultar os anexos.');const paths=(attachments.data??[]).flatMap(a=>a.storage_path?[a.storage_path]:[]);if(paths.length){const removed=await context.supabase.storage.from('documentos').remove(paths);if(removed.error)throw new Error('Não foi possível remover os anexos.');}if(attachments.data?.length){const deleted=await context.supabase.from('documentos').delete().in('id',attachments.data.map(a=>a.id));if(deleted.error)throw new Error('Não foi possível excluir os anexos.');}}
 let path: string | null=null;
 if(data.table==='documentos'){const r=await context.supabase.from('documentos').select('storage_path').eq('id',data.id).single();if(r.error)throw new Error('Documento não encontrado.');path=r.data.storage_path;}
 if(path){const r=await context.supabase.storage.from('documentos').remove([path]);if(r.error)throw new Error('Não foi possível remover o arquivo.');}
 const r=await context.supabase.from(data.table).delete().eq('id',data.id);if(r.error)throw new Error('Não foi possível excluir o registro.');return {ok:true}
})
export const rhQuery = {queryKey:['rh'],queryFn:()=>getRhData()}
