import { createFileRoute } from '@tanstack/react-router'
import { AuthPage } from '@/features/rh/auth-page'
import { pageHead } from '@/features/rh/config'
export const Route = createFileRoute('/')({head:()=>pageHead('Lions RH — Gestão de pessoas'),component:AuthPage})
