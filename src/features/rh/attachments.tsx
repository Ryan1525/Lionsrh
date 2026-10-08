import { useRef, useState } from 'react'
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { Download, FileText, Trash2, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { supabase } from '@/integrations/supabase/client'
import { rhQuery, saveRhRecord, deleteRhRecord } from './data.functions'
import { sections, dateLabel, type Section } from './config'
import type { Row } from './record-form'

export function Attachments({ section, row, onClose }: { section: Section; row: Row; onClose: () => void }) {
 const { data } = useSuspenseQuery(rhQuery)
 const client = useQueryClient()
 const save = useServerFn(saveRhRecord)
 const remove = useServerFn(deleteRhRecord)
 const input = useRef<HTMLInputElement>(null)
 const [busy, setBusy] = useState(false)
 const [deleting, setDeleting] = useState<string | null>(null)
 const employeeId = sections[section].table === 'funcionarios' ? row.id : String(row['funcionario_id'])
 const employeeName = data.funcionarios.find(e => e.id === employeeId)?.nome ?? 'Funcionário'
 const files = data.documentos.filter(d => d.modulo === section && d.registro_id === row.id)

 async function upload(selected: File[]) {
  if (!selected.length) return
  if (selected.some(f => f.size === 0 || f.size > 10 * 1024 * 1024)) { toast.error('Cada arquivo deve ter entre 1 byte e 10 MB.'); return }
  setBusy(true)
  let completed = 0
  try {
   const { data: auth, error } = await supabase.auth.getUser()
   if (error || !auth.user) throw new Error('Entre novamente para anexar arquivos.')
   for (const file of selected) {
    const path = `${auth.user.id}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    const sent = await supabase.storage.from('documentos').upload(path, file)
    if (sent.error) throw new Error('Não foi possível enviar o arquivo.')
    try {
     await save({ data: { table: 'documentos', values: { funcionario_id: employeeId, nome: file.name, tipo: section === 'atestados' ? 'atestado' : 'outro', storage_path: path, tamanho: file.size, modulo: section, registro_id: row.id } } })
     completed++
    } catch (err) { await supabase.storage.from('documentos').remove([path]); throw err }
   }
   toast.success('Anexos salvos com sucesso.')
  } catch (err) { toast.error(`${completed ? `${completed} arquivo(s) salvo(s). ` : ''}${err instanceof Error ? err.message : 'Não foi possível salvar os anexos.'}`) }
  finally { await client.invalidateQueries({ queryKey: ['rh'] }); setBusy(false); if (input.current) input.current.value = '' }
 }
 async function download(path: string | null, name: string) {
  if (!path) return
  try {
   const { data: blob, error } = await supabase.storage.from('documentos').download(path)
   if (error) throw error
   const url = URL.createObjectURL(blob)
   const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click()
   setTimeout(() => URL.revokeObjectURL(url), 1000)
  } catch { toast.error('Não foi possível baixar o anexo.') }
 }
 async function confirmRemove() {
  if (!deleting) return
  setBusy(true)
  try { await remove({ data: { table: 'documentos', id: deleting } }); await client.invalidateQueries({ queryKey: ['rh'] }); setDeleting(null); toast.success('Anexo excluído.') }
  catch (err) { toast.error(err instanceof Error ? err.message : 'Não foi possível excluir o anexo.') }
  finally { setBusy(false) }
 }
 return <Dialog open onOpenChange={open => { if (!open && !busy) onClose() }}><DialogContent className="max-h-[90dvh] overflow-y-auto max-w-2xl"><DialogHeader><DialogTitle>Anexos · {sections[section].title}</DialogTitle><DialogDescription>{employeeName}{section === 'folha' ? ` · ${String(row['competencia'])}` : row['data_inicio'] ? ` · ${dateLabel(row['data_inicio'])}` : ''}</DialogDescription></DialogHeader>
  <input ref={input} type="file" multiple className="hidden" aria-label="Selecionar anexos" accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.xls,.xlsx,.txt,.csv" disabled={busy} onChange={e => void upload(Array.from(e.target.files ?? []))} />
  <Button disabled={busy} onClick={() => input.current?.click()}><Upload />{busy ? 'Aguarde…' : 'Adicionar anexos'}</Button><p className="text-sm text-muted-foreground">PDF, imagens ou documentos · até 10 MB por arquivo</p>
  <div className="divide-y divide-border">{files.length === 0 ? <p className="py-6 text-center text-muted-foreground">Nenhum anexo neste registro.</p> : files.map(file => <div key={file.id} className="flex items-center gap-3 py-3"><FileText className="shrink-0 text-primary" /><div className="min-w-0 flex-1"><strong className="block break-words">{file.nome}</strong><span className="text-xs text-muted-foreground">{(Number(file.tamanho) / 1024).toFixed(1)} KB · {dateLabel(file.created_at)}</span></div><Button size="icon" variant="ghost" title="Baixar anexo" aria-label={`Baixar ${file.nome}`} disabled={busy} onClick={() => void download(file.storage_path, file.nome)}><Download /></Button><Button size="icon" variant="ghost" className="text-destructive" title="Excluir anexo" aria-label={`Excluir ${file.nome}`} disabled={busy} onClick={() => setDeleting(file.id)}><Trash2 /></Button></div>)}</div>
  {deleting && <div className="border-t border-border pt-4"><p className="mb-3">Excluir este anexo permanentemente?</p><div className="flex justify-end gap-3"><Button variant="outline" disabled={busy} onClick={() => setDeleting(null)}>Cancelar</Button><Button variant="destructive" disabled={busy} onClick={() => void confirmRemove()}>Excluir anexo</Button></div></div>}
 </DialogContent></Dialog>
}