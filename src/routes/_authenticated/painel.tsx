import { createFileRoute } from '@tanstack/react-router'
import { Workspace, RhError, RhNotFound } from '@/features/rh/workspace'
import { rhQuery } from '@/features/rh/data.functions'
import { sections, pageHead } from '@/features/rh/config'
export const Route = createFileRoute('/_authenticated/painel')({head:()=>pageHead(sections.painel.title),loader:({context})=>context.queryClient.ensureQueryData(rhQuery),component:()=> <Workspace section="painel"/>,errorComponent:RhError,notFoundComponent:RhNotFound})
