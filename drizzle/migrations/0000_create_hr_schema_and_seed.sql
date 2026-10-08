-- ===== Sistema de RH: schema completo + dados de exemplo =====

-- Funcionários
create table public.funcionarios (
  id uuid primary key default gen_random_uuid(),
  matricula text not null unique,
  nome text not null,
  cargo text not null,
  departamento text not null,
  email text,
  telefone text,
  cpf text,
  data_admissao date not null,
  salario_base numeric(12,2) not null default 0,
  status text not null default 'ativo',
  data_desligamento date,
  motivo_desligamento text,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.funcionarios to authenticated;
grant all on public.funcionarios to service_role;
alter table public.funcionarios enable row level security;
create policy "RH autenticado gerencia funcionarios" on public.funcionarios for all to authenticated using (true) with check (true);

-- Férias
create table public.ferias (
  id uuid primary key default gen_random_uuid(),
  funcionario_id uuid not null references public.funcionarios(id) on delete cascade,
  data_inicio date not null,
  data_fim date not null,
  dias integer not null default 30,
  status text not null default 'pendente',
  observacao text,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.ferias to authenticated;
grant all on public.ferias to service_role;
alter table public.ferias enable row level security;
create policy "RH autenticado gerencia ferias" on public.ferias for all to authenticated using (true) with check (true);

-- Atestados
create table public.atestados (
  id uuid primary key default gen_random_uuid(),
  funcionario_id uuid not null references public.funcionarios(id) on delete cascade,
  data_inicio date not null,
  dias integer not null default 1,
  cid text,
  motivo text,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.atestados to authenticated;
grant all on public.atestados to service_role;
alter table public.atestados enable row level security;
create policy "RH autenticado gerencia atestados" on public.atestados for all to authenticated using (true) with check (true);

-- Declarações
create table public.declaracoes (
  id uuid primary key default gen_random_uuid(),
  funcionario_id uuid not null references public.funcionarios(id) on delete cascade,
  tipo text not null default 'vinculo',
  conteudo text not null,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.declaracoes to authenticated;
grant all on public.declaracoes to service_role;
alter table public.declaracoes enable row level security;
create policy "RH autenticado gerencia declaracoes" on public.declaracoes for all to authenticated using (true) with check (true);

-- Folha de pagamento
create table public.folha_pagamento (
  id uuid primary key default gen_random_uuid(),
  funcionario_id uuid not null references public.funcionarios(id) on delete cascade,
  competencia text not null,
  salario_base numeric(12,2) not null default 0,
  adicionais numeric(12,2) not null default 0,
  descontos numeric(12,2) not null default 0,
  liquido numeric(12,2) not null default 0,
  status text not null default 'fechada',
  created_at timestamptz not null default now(),
  unique (funcionario_id, competencia)
);
grant select, insert, update, delete on public.folha_pagamento to authenticated;
grant all on public.folha_pagamento to service_role;
alter table public.folha_pagamento enable row level security;
create policy "RH autenticado gerencia folha" on public.folha_pagamento for all to authenticated using (true) with check (true);

-- Documentos anexados
create table public.documentos (
  id uuid primary key default gen_random_uuid(),
  funcionario_id uuid not null references public.funcionarios(id) on delete cascade,
  nome text not null,
  tipo text not null default 'outro',
  storage_path text,
  tamanho bigint,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.documentos to authenticated;
grant all on public.documentos to service_role;
alter table public.documentos enable row level security;
create policy "RH autenticado gerencia documentos" on public.documentos for all to authenticated using (true) with check (true);

-- Políticas de acesso aos anexos no storage (bucket 'documentos', privado)
create policy "autenticados leem anexos" on storage.objects for select to authenticated using (bucket_id = 'documentos');
create policy "autenticados enviam anexos" on storage.objects for insert to authenticated with check (bucket_id = 'documentos');
create policy "autenticados atualizam anexos" on storage.objects for update to authenticated using (bucket_id = 'documentos') with check (bucket_id = 'documentos');
create policy "autenticados removem anexos" on storage.objects for delete to authenticated using (bucket_id = 'documentos');

-- ===== Seed: 30 funcionários (27 ativos, 3 desligados) =====
insert into public.funcionarios (matricula, nome, cargo, departamento, email, telefone, cpf, data_admissao, salario_base, status, data_desligamento, motivo_desligamento) values
('MAT-0001','Ricardo Campos','Gerente de Operações','Operações','ricardo.campos@orbitalogistica.com.br','(11) 98765-1001','123.456.789-01','2019-03-12',11800.00,'ativo',null,null),
('MAT-0002','Aline Ferraz','Analista Financeiro Sênior','Financeiro','aline.ferraz@orbitalogistica.com.br','(11) 98765-1002','234.567.890-12','2021-06-22',8600.00,'ativo',null,null),
('MAT-0003','Bruno Tavares','Desenvolvedor Pleno','Tecnologia','bruno.tavares@orbitalogistica.com.br','(11) 98765-1003','345.678.901-23','2018-02-05',9400.00,'ativo',null,null),
('MAT-0004','Mariana Souza','Analista de RH','Pessoas','mariana.souza@orbitalogistica.com.br','(11) 98765-1004','456.789.012-34','2019-07-03',6200.00,'ativo',null,null),
('MAT-0005','Paulo Lima','Coordenador Comercial','Comercial','paulo.lima@orbitalogistica.com.br','(11) 98765-1005','567.890.123-45','2020-09-22',9600.00,'ativo',null,null),
('MAT-0006','Ana Beatriz Ferreira','Analista Financeiro','Financeiro','ana.ferreira@orbitalogistica.com.br','(11) 98765-1006','678.901.234-56','2022-01-11',5600.00,'ativo',null,null),
('MAT-0007','João Pedro Oliveira','Gerente de Projetos','Operações','joao.oliveira@orbitalogistica.com.br','(11) 98765-1007','789.012.345-67','2018-04-05',11000.00,'ativo',null,null),
('MAT-0008','Camila Gomes','Assistente Administrativo','Administrativo','camila.gomes@orbitalogistica.com.br','(11) 98765-1008','890.123.456-78','2023-06-18',3200.00,'ativo',null,null),
('MAT-0009','Felipe Rocha','Analista de Marketing','Marketing','felipe.rocha@orbitalogistica.com.br','(11) 98765-1009','901.234.567-89','2022-02-27',5800.00,'ativo',null,null),
('MAT-0010','Letícia Santos','Suporte Técnico','Tecnologia','leticia.santos@orbitalogistica.com.br','(11) 98765-1010','012.345.678-90','2023-10-09',3900.00,'ativo',null,null),
('MAT-0011','Diego Martins','Desenvolvedor Sênior','Tecnologia','diego.martins@orbitalogistica.com.br','(11) 98765-1011','111.222.333-44','2019-08-14',12400.00,'ativo',null,null),
('MAT-0012','Fernanda Lima','Designer UX','Marketing','fernanda.lima@orbitalogistica.com.br','(11) 98765-1012','222.333.444-55','2022-05-30',6700.00,'ativo',null,null),
('MAT-0013','Gustavo Henrique','Analista de Logística','Operações','gustavo.henrique@orbitalogistica.com.br','(11) 98765-1013','333.444.555-66','2020-11-02',5100.00,'ativo',null,null),
('MAT-0014','Patrícia Alves','Contadora','Financeiro','patricia.alves@orbitalogistica.com.br','(11) 98765-1014','444.555.666-77','2018-03-19',8900.00,'ativo',null,null),
('MAT-0015','Rafael Duarte','Vendedor','Comercial','rafael.duarte@orbitalogistica.com.br','(11) 98765-1015','555.666.777-88','2021-09-07',4200.00,'ativo',null,null),
('MAT-0016','Juliana Castro','Vendedora','Comercial','juliana.castro@orbitalogistica.com.br','(11) 98765-1016','666.777.888-99','2022-04-25',4200.00,'ativo',null,null),
('MAT-0017','Thiago Nogueira','Analista de Suporte','Tecnologia','thiago.nogueira@orbitalogistica.com.br','(11) 98765-1017','777.888.999-00','2023-01-16',4100.00,'ativo',null,null),
('MAT-0018','Vanessa Ribeiro','Coordenadora de RH','Pessoas','vanessa.ribeiro@orbitalogistica.com.br','(11) 98765-1018','888.999.000-11','2019-10-08',8400.00,'ativo',null,null),
('MAT-0019','Eduardo Pires','Motorista','Operações','eduardo.pires@orbitalogistica.com.br','(11) 98765-1019','999.000.111-22','2021-02-12',3400.00,'ativo',null,null),
('MAT-0020','Carolina Mendes','Assistente Financeiro','Financeiro','carolina.mendes@orbitalogistica.com.br','(11) 98765-1020','000.111.222-33','2023-07-21',3100.00,'ativo',null,null),
('MAT-0021','Marcelo Vieira','Supervisor de Operações','Operações','marcelo.vieira@orbitalogistica.com.br','(11) 98765-1021','111.000.222-44','2017-05-04',7800.00,'ativo',null,null),
('MAT-0022','Beatriz Cardoso','Analista de Marketing Sênior','Marketing','beatriz.cardoso@orbitalogistica.com.br','(11) 98765-1022','222.111.333-55','2020-12-13',7300.00,'ativo',null,null),
('MAT-0023','André Luiz Silva','Estoquista','Operações','andre.silva@orbitalogistica.com.br','(11) 98765-1023','333.222.444-66','2022-08-28',2900.00,'ativo',null,null),
('MAT-0024','Renata Barros','Analista Administrativo','Administrativo','renata.barros@orbitalogistica.com.br','(11) 98765-1024','444.333.555-77','2021-03-15',4400.00,'ativo',null,null),
('MAT-0025','Lucas Prado','Desenvolvedor Júnior','Tecnologia','lucas.prado@orbitalogistica.com.br','(11) 98765-1025','555.444.666-88','2024-06-06',4500.00,'ativo',null,null),
('MAT-0026','Sofia Araújo','Atendente','Comercial','sofia.araujo@orbitalogistica.com.br','(11) 98765-1026','666.555.777-99','2024-09-19',2600.00,'ativo',null,null),
('MAT-0027','Vinícius Teixeira','Analista de Dados','Tecnologia','vinicius.teixeira@orbitalogistica.com.br','(11) 98765-1027','777.666.888-00','2025-02-10',6900.00,'ativo',null,null),
('MAT-0028','Otávio Ramos','Vendedor','Comercial','otavio.ramos@orbitalogistica.com.br','(11) 98765-1028','888.777.999-11','2019-04-14',4300.00,'desligado','2026-05-15','Pedido de demissão'),
('MAT-0029','Larissa Monteiro','Assistente Administrativo','Administrativo','larissa.monteiro@orbitalogistica.com.br','(11) 98765-1029','999.888.000-22','2020-10-02',3300.00,'desligado','2026-06-30','Desligamento sem justa causa'),
('MAT-0030','Henrique Lopes','Suporte Técnico','Tecnologia','henrique.lopes@orbitalogistica.com.br','(11) 98765-1030','000.999.111-33','2023-01-23',3800.00,'desligado','2026-08-12','Acordo entre as partes');

-- ===== Seed: férias =====
insert into public.ferias (funcionario_id, data_inicio, data_fim, dias, status)
select id, '2026-09-28', '2026-10-27', 30, 'em_gozo' from public.funcionarios where matricula = 'MAT-0009';
insert into public.ferias (funcionario_id, data_inicio, data_fim, dias, status)
select id, '2026-10-05', '2026-10-24', 20, 'em_gozo' from public.funcionarios where matricula = 'MAT-0012';
insert into public.ferias (funcionario_id, data_inicio, data_fim, dias, status)
select id, '2026-11-04', '2026-11-15', 12, 'pendente' from public.funcionarios where matricula = 'MAT-0003';
insert into public.ferias (funcionario_id, data_inicio, data_fim, dias, status)
select id, '2026-12-01', '2026-12-30', 30, 'aprovada' from public.funcionarios where matricula = 'MAT-0015';
insert into public.ferias (funcionario_id, data_inicio, data_fim, dias, status)
select id, '2026-01-02', '2026-01-31', 30, 'concluida' from public.funcionarios where matricula = 'MAT-0008';
insert into public.ferias (funcionario_id, data_inicio, data_fim, dias, status)
select id, '2026-07-15', '2026-08-03', 20, 'concluida' from public.funcionarios where matricula = 'MAT-0021';

-- ===== Seed: atestados =====
insert into public.atestados (funcionario_id, data_inicio, dias, cid, motivo)
select id, '2026-10-01', 3, 'J11', 'Gripe' from public.funcionarios where matricula = 'MAT-0005';
insert into public.atestados (funcionario_id, data_inicio, dias, cid, motivo)
select id, '2026-09-28', 2, null, 'Consulta médica' from public.funcionarios where matricula = 'MAT-0010';
insert into public.atestados (funcionario_id, data_inicio, dias, cid, motivo)
select id, '2026-09-15', 5, 'M54', 'Dor lombar' from public.funcionarios where matricula = 'MAT-0019';
insert into public.atestados (funcionario_id, data_inicio, dias, cid, motivo)
select id, '2026-10-05', 1, null, 'Exame de rotina' from public.funcionarios where matricula = 'MAT-0023';

-- ===== Seed: declarações =====
insert into public.declaracoes (funcionario_id, tipo, conteudo, created_at)
select id, 'vinculo', 'Declaramos, para os devidos fins, que Aline Ferraz, matrícula MAT-0002, exerce o cargo de Analista Financeiro Sênior nesta empresa desde 22/06/2021.', '2026-09-15 10:00:00+00' from public.funcionarios where matricula = 'MAT-0002';
insert into public.declaracoes (funcionario_id, tipo, conteudo, created_at)
select id, 'salarial', 'Declaramos, para os devidos fins, que João Pedro Oliveira, matrícula MAT-0007, exerce o cargo de Gerente de Projetos com salário mensal de R$ 11.000,00.', '2026-08-22 10:00:00+00' from public.funcionarios where matricula = 'MAT-0007';
insert into public.declaracoes (funcionario_id, tipo, conteudo, created_at)
select id, 'tempo_casa', 'Declaramos, para os devidos fins, que Vanessa Ribeiro, matrícula MAT-0018, integra o quadro de colaboradores desta empresa desde 08/10/2019.', '2026-09-30 10:00:00+00' from public.funcionarios where matricula = 'MAT-0018';
insert into public.declaracoes (funcionario_id, tipo, conteudo, created_at)
select id, 'vinculo', 'Declaramos, para os devidos fins, que Rafael Duarte, matrícula MAT-0015, exerce o cargo de Vendedor nesta empresa desde 07/09/2021.', '2026-10-02 10:00:00+00' from public.funcionarios where matricula = 'MAT-0015';

-- ===== Seed: folha de pagamento do mês anterior (todos os ativos) =====
insert into public.folha_pagamento (funcionario_id, competencia, salario_base, adicionais, descontos, liquido, status)
select id,
       to_char(date_trunc('month', now()) - interval '1 month', 'YYYY-MM'),
       salario_base,
       0,
       round(salario_base * 0.09, 2),
       salario_base - round(salario_base * 0.09, 2),
       'fechada'
from public.funcionarios
where status = 'ativo';