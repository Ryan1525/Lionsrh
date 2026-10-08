ALTER TABLE public.documentos ADD COLUMN modulo text, ADD COLUMN registro_id uuid;
ALTER TABLE public.documentos ADD CONSTRAINT documentos_vinculo_valido CHECK ((modulo IS NULL AND registro_id IS NULL) OR (modulo IS NOT NULL AND registro_id IS NOT NULL AND modulo IN ('funcionarios','desligados','ferias','atestados','declaracoes','folha')));
CREATE INDEX documentos_registro_idx ON public.documentos (modulo, registro_id);
COMMENT ON COLUMN public.documentos.modulo IS 'RH module that owns this attachment; null for standalone documents';