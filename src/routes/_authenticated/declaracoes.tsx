import { createFileRoute } from '@tanstack/react-router'
import { Workspace, RhError, RhNotFound } from '@/features/rh/workspace'
import { rhQuery } from '@/features/rh/data.functions'
import { sections, pageHead } from '@/features/rh/config'
export const Route = createFileRoute('/_authenticated/declaracoes')({head:()=>pageHead(sections.declaracoes.title),loader:({context})=>context.queryClient.ensureQueryData(rhQuery),component:()=> <Workspace section="declaracoes"/>,errorComponent:RhError,notFoundComponent:RhNotFound})
