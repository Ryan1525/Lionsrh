CREATE TABLE public.user_roles (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'rh_operator' CHECK (role = 'rh_operator'),
  PRIMARY KEY (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Operators read their own authorization" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

-- Preserve the existing administrator-provisioned RH accounts.
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'rh_operator' FROM auth.users WHERE deleted_at IS NULL AND NOT is_anonymous;

-- Signup is disabled: new administrator-provisioned accounts are RH operators.
CREATE FUNCTION public.authorize_provisioned_rh_account()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF NOT COALESCE(NEW.is_anonymous, false) THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'rh_operator') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.authorize_provisioned_rh_account() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER authorize_provisioned_rh_account AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.authorize_provisioned_rh_account();

ALTER POLICY "RH autenticado gerencia funcionarios" ON public.funcionarios
USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = (SELECT auth.uid()) AND r.role = 'rh_operator'))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = (SELECT auth.uid()) AND r.role = 'rh_operator'));
ALTER POLICY "RH autenticado gerencia ferias" ON public.ferias
USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = (SELECT auth.uid()) AND r.role = 'rh_operator'))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = (SELECT auth.uid()) AND r.role = 'rh_operator'));
ALTER POLICY "RH autenticado gerencia atestados" ON public.atestados
USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = (SELECT auth.uid()) AND r.role = 'rh_operator'))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = (SELECT auth.uid()) AND r.role = 'rh_operator'));
ALTER POLICY "RH autenticado gerencia declaracoes" ON public.declaracoes
USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = (SELECT auth.uid()) AND r.role = 'rh_operator'))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = (SELECT auth.uid()) AND r.role = 'rh_operator'));
ALTER POLICY "RH autenticado gerencia folha" ON public.folha_pagamento
USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = (SELECT auth.uid()) AND r.role = 'rh_operator'))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = (SELECT auth.uid()) AND r.role = 'rh_operator'));
ALTER POLICY "RH autenticado gerencia documentos" ON public.documentos
USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = (SELECT auth.uid()) AND r.role = 'rh_operator'))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = (SELECT auth.uid()) AND r.role = 'rh_operator'));

ALTER POLICY "autenticados enviam anexos" ON storage.objects WITH CHECK (
  bucket_id = 'documentos'
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
  AND EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = (SELECT auth.uid()) AND r.role = 'rh_operator')
);
ALTER POLICY "autenticados atualizam anexos" ON storage.objects USING (
  bucket_id = 'documentos'
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
  AND EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = (SELECT auth.uid()) AND r.role = 'rh_operator')
) WITH CHECK (
  bucket_id = 'documentos'
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
  AND EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = (SELECT auth.uid()) AND r.role = 'rh_operator')
);
-- Operators share linked company documents, but not other users' unlinked uploads.
ALTER POLICY "autenticados leem anexos" ON storage.objects USING (
  bucket_id = 'documentos'
  AND EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = (SELECT auth.uid()) AND r.role = 'rh_operator')
  AND ((storage.foldername(name))[1] = (SELECT auth.uid()::text)
    OR EXISTS (SELECT 1 FROM public.documentos d WHERE d.storage_path = storage.objects.name))
);
ALTER POLICY "autenticados removem anexos" ON storage.objects USING (
  bucket_id = 'documentos'
  AND EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = (SELECT auth.uid()) AND r.role = 'rh_operator')
  AND ((storage.foldername(name))[1] = (SELECT auth.uid()::text)
    OR EXISTS (SELECT 1 FROM public.documentos d WHERE d.storage_path = storage.objects.name))
);