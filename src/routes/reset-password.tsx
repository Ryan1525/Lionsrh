import { createFileRoute } from '@tanstack/react-router'
import { ResetPage } from '@/features/rh/auth-page'
import { pageHead } from '@/features/rh/config'
export const Route=createFileRoute('/reset-password')({head:()=>pageHead('Redefinir senha'),component:ResetPage})
