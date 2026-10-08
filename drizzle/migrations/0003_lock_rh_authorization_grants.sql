REVOKE ALL ON public.user_roles FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
COMMENT ON TABLE public.user_roles IS 'Administrator-provisioned RH authorization. Client roles may read only their own authorization and cannot grant, edit, or revoke access.';