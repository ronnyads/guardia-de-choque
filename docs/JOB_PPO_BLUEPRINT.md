# JOB PPO Blueprint

## 1. Visao geral do produto

JOB PPO e uma plataforma premium de assinatura e descoberta de criadoras.
O produto foi desenhado para:

- maximizar descoberta visual e conversao na area publica
- transformar perfil de criadora em pagina comercial forte
- operar assinaturas recorrentes, pagamentos e repasses
- dar clareza para time admin com moderacao, verificacao e analytics
- nascer com base pronta para escalar em modulos e complexidade

## 2. Arquitetura recomendada

Stack do MVP:

- Frontend: Next.js 16.2 App Router + React 19.2
- UI: Tailwind CSS v4 + design tokens proprietarios
- Auth: Supabase Auth
- Banco: PostgreSQL via Supabase
- Storage: Supabase Storage com buckets publicos e privados
- Pagamentos: Stripe Billing para recorrencia
- Jobs e webhooks: Route Handlers + webhooks Stripe/Supabase
- Deploy: Railway ou Vercel + banco e storage geridos pelo Supabase

Camadas:

1. Experience layer
   - rotas publicas
   - rotas protegidas por papel
   - componentes reutilizaveis
2. Application layer
   - server actions
   - route handlers
   - regras de negocio de assinatura, moderacao e dashboards
3. Data access layer
   - queries server-side
   - DTOs por contexto
   - verificacao de sessao e autorizacao perto do dado
4. Infra layer
   - Supabase Auth
   - Postgres
   - Storage privado/publico
   - Stripe + webhooks

Decisoes principais:

- `proxy.ts` faz apenas checagem otimista de rota
- autorizacao real fica nas paginas, actions e APIs
- schema SQL usa schema dedicado `job_ppo` para conviver com legados
- visitante nao e persistido; papais persistidos comecam em `subscriber`

## 3. Estrutura de pastas do projeto

```text
src/
  app/
    (public)/
      page.tsx
      explorar/page.tsx
      categorias/page.tsx
      criadora/[slug]/page.tsx
      planos/page.tsx
      institucional/page.tsx
      termos/page.tsx
      privacidade/page.tsx
      suporte/page.tsx
    (auth)/
      actions.ts
      login/page.tsx
      cadastro/page.tsx
      recuperar-senha/page.tsx
    (subscriber)/
      assinante/
        layout.tsx
        page.tsx
        [section]/page.tsx
    (creator)/
      studio/
        layout.tsx
        page.tsx
        [section]/page.tsx
    admin/
      layout.tsx
      page.tsx
      [section]/page.tsx
      login/page.tsx
    super-admin/page.tsx
    unauthorized/page.tsx
    layout.tsx
    globals.css
  components/job-ppo/
    brand-mark.tsx
    dashboard-shell.tsx
    metric-card.tsx
    panel.tsx
    plan-card.tsx
    profile-card.tsx
    section-heading.tsx
    site-footer.tsx
    site-header.tsx
    workspace-page.tsx
  lib/job-ppo/
    mock-data.ts
    navigation.ts
    permissions.ts
    session.ts
    types.ts
  proxy.ts

supabase/
  migrations/
    20260423000001_job_ppo_foundation.sql
    20260423000002_job_ppo_seed.sql
```

## 4. Modelagem completa do banco de dados

Entidades principais:

- `users`: conta central de negocio vinculavel ao `auth.users`
- `profiles`: dados publicos/identitarios do usuario
- `creators`: extensao comercial da criadora
- `creator_verification`: documentos e trilha de validacao
- `subscriptions`: vinculo recorrente usuario -> criadora -> plano
- `plans`: precificacao recorrente da criadora
- `payments`: transacoes financeiras
- `payouts`: repasses da criadora
- `posts`: feed publico e premium
- `media`: ativos de storage e acesso
- `favorites`: favoritos do assinante
- `categories`, `tags`, `profile_tags`: descoberta e recomendacao
- `messages`: camada de conversa privada
- `notifications`: fila de eventos
- `reports`: denuncias
- `admin_logs`: auditoria administrativa
- `settings`: configuracao de plataforma e escopo de criadora

Pontos de modelagem:

- enums cobrem status de conta, assinatura, pagamento, payout, post e moderacao
- indices em slug, status, periodo, datas de pagamento, creator/category e favoritos
- constraints impedem duplicidade de favoritos, tags e identificadores externos
- valores financeiros usam `numeric(12,2)`
- `updated_at` e padronizado via trigger

Os detalhes completos estao no arquivo:

- `supabase/migrations/20260423000001_job_ppo_foundation.sql`

## 5. Regras de papeis e permissoes

Papeis:

- `visitor`: explora, busca, ve teaser e planos
- `subscriber`: assina, acessa feed premium, favoritos, pagamentos e biblioteca
- `creator`: gerencia perfil, planos, conteudo, assinantes, ganhos e analytics
- `admin`: opera verificacao, moderacao, pagamentos, repasses, CMS e logs
- `super_admin`: controla permissoes globais e configuracoes criticas

Regras:

- visitante nunca acessa midia premium
- subscriber nao publica nem modera
- creator nao opera repasses globais nem permissao de terceiros
- admin nao altera politicas criticas de RBAC
- super admin tem override total

Matriz implementada em:

- `src/lib/job-ppo/permissions.ts`

## 6. Mapa completo de paginas

Area publica:

- `/`
- `/explorar`
- `/categorias`
- `/criadora/[slug]`
- `/planos`
- `/institucional`
- `/termos`
- `/privacidade`
- `/suporte`
- `/login`
- `/cadastro`
- `/recuperar-senha`

Area do assinante:

- `/assinante`
- `/assinante/favoritos`
- `/assinante/assinaturas`
- `/assinante/pagamentos`
- `/assinante/biblioteca`
- `/assinante/mensagens`
- `/assinante/notificacoes`
- `/assinante/configuracoes`

Area da criadora:

- `/studio`
- `/studio/onboarding`
- `/studio/perfil`
- `/studio/verificacao`
- `/studio/planos`
- `/studio/conteudo`
- `/studio/biblioteca`
- `/studio/assinantes`
- `/studio/ganhos`
- `/studio/analytics`
- `/studio/notificacoes`
- `/studio/configuracoes`

Area admin:

- `/admin`
- `/admin/usuarios`
- `/admin/criadoras`
- `/admin/verificacao`
- `/admin/moderacao`
- `/admin/denuncias`
- `/admin/assinaturas`
- `/admin/pagamentos`
- `/admin/repasses`
- `/admin/analytics`
- `/admin/categorias`
- `/admin/cms`
- `/admin/configuracoes`
- `/admin/logs`
- `/admin/permissoes`
- `/super-admin`

## 7. Fluxos principais

Usuario assinante:

1. entra na landing
2. explora perfis
3. abre perfil publico
4. visualiza teaser bloqueado
5. escolhe plano
6. assina
7. acessa feed premium, favoritos, historico e biblioteca

Criadora:

1. cria conta
2. entra no onboarding
3. configura perfil artistico
4. envia documentos
5. cadastra planos
6. sobe midias e posts
7. acompanha assinantes, ganhos e analytics

Admin:

1. entra no painel
2. revisa verificacao
3. modera conteudo
4. monitora pagamentos e repasses
5. trata denuncias
6. ajusta categorias, banners, CMS e configuracoes

## 8. Lista de componentes reutilizaveis

Implementados agora:

- `BrandMark`
- `SiteHeader`
- `SiteFooter`
- `DashboardShell`
- `Panel`
- `MetricCard`
- `ProfileCard`
- `PlanCard`
- `SectionHeading`
- `WorkspacePage`

Backlog imediato:

- uploader com preview
- gallery masonry premium
- data table com filtros reais
- empty states especificos por papel
- chart cards
- drawer mobile para dashboard

## 9. Ordem ideal de implementacao do MVP

1. Design system, navegacao e layout global
2. Auth real com Supabase e tabela `users`
3. Descoberta publica + perfil publico + favoritos
4. Planos, checkout e webhook de assinatura
5. Studio da criadora com perfil, planos e posts
6. Moderacao, verificacao e admin logs
7. Pagamentos, repasses e analytics basicos
8. Mensagens privadas e conteudo avulso

## 10. Codigo inicial do sistema

Entregue nesta fundacao:

- novo tema premium feminino em `src/app/globals.css`
- layouts por area e roteamento moderno com App Router
- sessao demo com cookies e protecao por papel
- area publica forte com descoberta e perfil da criadora
- dashboards iniciais de assinante, criadora e admin
- blueprint persistido no repositorio
- schema SQL completo + seed inicial

## 11. Esquema de rotas

Publicas:

- GET paginas em `(public)`

Protegidas por papel:

- `/assinante/**` -> `subscriber`
- `/studio/**` -> `creator`
- `/admin/**` -> `admin`
- `/super-admin` -> `super_admin`

Observacoes:

- `proxy.ts` intercepta acesso sem sessao
- checagem real e repetida em `requireRole()` nas layouts/paginas
- `/admin/login` redireciona para `/login?next=/admin`

## 12. Seeds de exemplo

Arquivo:

- `supabase/migrations/20260423000002_job_ppo_seed.sql`

Conteudo do seed:

- 4 usuarios
- 4 perfis
- 2 criadoras
- categorias e tags iniciais
- planos
- assinaturas
- pagamentos
- payout
- posts e media
- favoritos
- notificacoes
- denuncia
- log administrativo
- settings da plataforma

## 13. Plano de evolucao pos-MVP

Fase 1:

- integrar Supabase Auth real
- criar DAL com DTOs server-side
- integrar Stripe Billing + webhooks
- buckets privados com signed URLs

Fase 2:

- search semantica e ranqueamento
- recomendacao por categoria, tags e comportamento
- mensageria privada com limites e moderacao
- dashboards com cohort, churn e LTV

Fase 3:

- bundles e conteudo avulso
- afiliacao e referral
- payout automatizado
- antifraude comportamental e score de risco

## Arquivos-chave

- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/proxy.ts`
- `src/lib/job-ppo/*`
- `src/components/job-ppo/*`
- `supabase/migrations/20260423000001_job_ppo_foundation.sql`
- `supabase/migrations/20260423000002_job_ppo_seed.sql`
