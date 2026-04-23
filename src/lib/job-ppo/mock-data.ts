import type {
  CreatorSummary,
  DashboardMetric,
  PlanSummary,
  Role,
  SessionUser,
  WorkspaceSection,
} from '@/lib/job-ppo/types'

export const demoUsers: Record<Role, SessionUser> = {
  visitor: {
    id: 'visitor',
    authUserId: null,
    name: 'Visitante',
    email: null,
    role: 'visitor',
    label: 'Visitante',
    home: '/',
  },
  subscriber: {
    id: 'demo-subscriber',
    authUserId: null,
    name: 'Clara Mendes',
    email: 'clara@jobppo.com',
    role: 'subscriber',
    label: 'Assinante',
    home: '/assinante',
  },
  creator: {
    id: 'demo-creator',
    authUserId: null,
    name: 'Ayla Noir',
    email: 'ayla@jobppo.com',
    role: 'creator',
    label: 'Criadora',
    home: '/studio',
  },
  admin: {
    id: 'demo-admin',
    authUserId: null,
    name: 'Helena Costa',
    email: 'helena@jobppo.com',
    role: 'admin',
    label: 'Admin',
    home: '/admin',
  },
  super_admin: {
    id: 'demo-super-admin',
    authUserId: null,
    name: 'Marina Vale',
    email: 'marina@jobppo.com',
    role: 'super_admin',
    label: 'Super Admin',
    home: '/super-admin',
  },
}

export const categories = [
  'Editorial Glam',
  'Soft Boudoir',
  'Lifestyle Deluxe',
  'Cosplay Premium',
  'Wellness Muse',
  'Late Night Club',
]

export const publicPlans: PlanSummary[] = [
  {
    id: 'pulse',
    name: 'Pulse',
    price: 39,
    description: 'Entrada premium para descobrir criadoras e acompanhar o feed desbloqueado.',
    target: 'Assinantes que querem variedade e descoberta recorrente.',
    features: [
      'Feed premium com atualizacoes recentes',
      'Favoritos, notificacoes e historico de pagamentos',
      'Acesso ao teaser expandido de perfis destacados',
    ],
  },
  {
    id: 'velvet',
    name: 'Velvet Circle',
    price: 79,
    description: 'Assinatura com maior profundidade, foco em colecao privada e prioridade.',
    target: 'Usuarios com relacao frequente com criadoras favoritas.',
    featured: true,
    features: [
      'Biblioteca premium com midia liberada por assinatura',
      'Mensageria privada pronta para MVP expandido',
      'Prioridade em lancamentos e listas de espera',
    ],
  },
  {
    id: 'atelier',
    name: 'Atelier',
    price: 149,
    description: 'Camada aspiracional para experiencias premium e ofertas futuras avulsas.',
    target: 'Publico de alto valor com foco em exclusividade.',
    features: [
      'Acesso antecipado a colecoes e campanhas especiais',
      'Bundles editoriais e upgrades premium',
      'Base pronta para conteudo avulso e drops privados',
    ],
  },
]

export const creators: CreatorSummary[] = [
  {
    slug: 'ayla-noir',
    artisticName: 'Ayla Noir',
    tagline: 'Editorial intimista, luxo suave e atmosfera de backstage.',
    category: 'Editorial Glam',
    monthlyPrice: 59,
    badges: ['Verificada', 'Trending'],
    bio: 'Mistura retratos cinematograficos, bastidores premium e narrativas curtas para uma audiencia que valoriza elegancia e exclusividade.',
    teaser: 'Novos editoriais em camadas, trilha sensual leve e conteudo premium semanal.',
    tags: ['editorial', 'bastidores', 'luxo', 'campanhas'],
    portraitGradient: 'linear-gradient(135deg, #4a2545 12%, #9b6c8f 52%, #e2c3b3 100%)',
    stats: {
      subscribers: '2.480',
      premiumPosts: '126',
      responseTime: '2h',
    },
    mediaPreview: [
      { title: 'Editorial Velvet Room', kind: 'Foto', locked: false },
      { title: 'Backstage de campanha', kind: 'Video', locked: true },
      { title: 'Drop after hours', kind: 'Foto', locked: true },
    ],
    similarSlugs: ['luna-sorel', 'nina-velour'],
  },
  {
    slug: 'luna-sorel',
    artisticName: 'Luna Sorel',
    tagline: 'Boudoir com luz baixa, silhueta delicada e composicao calorosa.',
    category: 'Soft Boudoir',
    monthlyPrice: 49,
    badges: ['Verificada', 'Popular'],
    bio: 'Cria series sensoriais com enquadramento editorial, paleta quente e rotina de publicacao consistente para retenção.',
    teaser: 'Galerias teaser com close-up, bastidores e post premium programado.',
    tags: ['boudoir', 'soft light', 'teasers', 'premium'],
    portraitGradient: 'linear-gradient(135deg, #2c182c 10%, #c07aa0 50%, #f0d3c6 100%)',
    stats: {
      subscribers: '1.940',
      premiumPosts: '98',
      responseTime: '4h',
    },
    mediaPreview: [
      { title: 'Rose Dust Morning', kind: 'Foto', locked: false },
      { title: 'Colecao Moonlight', kind: 'Video', locked: true },
      { title: 'Audio note exclusivo', kind: 'Audio', locked: true },
    ],
    similarSlugs: ['ayla-noir', 'safira-lane'],
  },
  {
    slug: 'nina-velour',
    artisticName: 'Nina Velour',
    tagline: 'Lifestyle deluxe com foco em viagem, hotel e narrativa visual.',
    category: 'Lifestyle Deluxe',
    monthlyPrice: 69,
    badges: ['Popular'],
    bio: 'Transforma lifestyle em produto premium com colecoes mensais, ofertas escalaveis e percepcao de marca forte.',
    teaser: 'Drops com hotel diaries, rotina e conteudo premium de viagem.',
    tags: ['lifestyle', 'travel', 'hotel', 'premium'],
    portraitGradient: 'linear-gradient(135deg, #1f1628 15%, #7c5c79 48%, #cdb0a1 100%)',
    stats: {
      subscribers: '1.120',
      premiumPosts: '84',
      responseTime: '5h',
    },
    mediaPreview: [
      { title: 'Hotel Diary', kind: 'Foto', locked: false },
      { title: 'Suite Notes', kind: 'Video', locked: true },
      { title: 'After pool gallery', kind: 'Foto', locked: true },
    ],
    similarSlugs: ['ayla-noir', 'ivy-mirage'],
  },
  {
    slug: 'ivy-mirage',
    artisticName: 'Ivy Mirage',
    tagline: 'Cosplay premium com figurinos autorais e entregas seriadas.',
    category: 'Cosplay Premium',
    monthlyPrice: 45,
    badges: ['Nova'],
    bio: 'Combina fandom, styling e producao premium para conversao alta em lancamentos tematicos.',
    teaser: 'Calendario com drops semanais, teaser bloqueado e CTA fixo.',
    tags: ['cosplay', 'figurino', 'drops', 'colecao'],
    portraitGradient: 'linear-gradient(135deg, #2b1631 8%, #945782 45%, #e7c2b2 100%)',
    stats: {
      subscribers: '760',
      premiumPosts: '41',
      responseTime: '6h',
    },
    mediaPreview: [
      { title: 'Lookbook Cyber Lace', kind: 'Foto', locked: false },
      { title: 'Transformacao completa', kind: 'Video', locked: true },
      { title: 'Close details', kind: 'Foto', locked: true },
    ],
    similarSlugs: ['safira-lane', 'nina-velour'],
  },
  {
    slug: 'safira-lane',
    artisticName: 'Safira Lane',
    tagline: 'Wellness sensual com recorte premium e storytelling calmo.',
    category: 'Wellness Muse',
    monthlyPrice: 42,
    badges: ['Verificada', 'Nova'],
    bio: 'Usa rituais, rotinas e conteudo suave para manter consumo recorrente e ticket saudavel.',
    teaser: 'Serie semanal com diario, galerias privadas e notificacoes personalizadas.',
    tags: ['wellness', 'ritual', 'exclusive', 'soft'],
    portraitGradient: 'linear-gradient(135deg, #2f1c29 10%, #8f6f88 48%, #e4c5b7 100%)',
    stats: {
      subscribers: '540',
      premiumPosts: '34',
      responseTime: '8h',
    },
    mediaPreview: [
      { title: 'Ritual de domingo', kind: 'Foto', locked: false },
      { title: 'Night routine', kind: 'Video', locked: true },
      { title: 'Audio intimate note', kind: 'Audio', locked: true },
    ],
    similarSlugs: ['luna-sorel', 'ivy-mirage'],
  },
  {
    slug: 'celeste-rush',
    artisticName: 'Celeste Rush',
    tagline: 'Energia after hours, atmosfera clube e pacing de alta conversao.',
    category: 'Late Night Club',
    monthlyPrice: 74,
    badges: ['Trending', 'Popular'],
    bio: 'Une ritmo, visual forte e agenda constante para impulsionar novas assinaturas e upsell futuro.',
    teaser: 'Colecoes noturnas, conteudo premium em serie e destaque na home.',
    tags: ['nightlife', 'club', 'drops', 'trending'],
    portraitGradient: 'linear-gradient(135deg, #140d1b 8%, #733661 42%, #d59ab0 72%, #ebcfbf 100%)',
    stats: {
      subscribers: '3.090',
      premiumPosts: '153',
      responseTime: '1h',
    },
    mediaPreview: [
      { title: 'Velvet lights', kind: 'Foto', locked: false },
      { title: 'After party premium', kind: 'Video', locked: true },
      { title: 'Private set list', kind: 'Audio', locked: true },
    ],
    similarSlugs: ['ayla-noir', 'luna-sorel'],
  },
]

export const discoveryMetrics: DashboardMetric[] = [
  { label: 'Criadoras ativas', value: '148', delta: '+12 este mes', tone: 'positive' },
  { label: 'Ticket medio', value: 'R$ 63', delta: '+9,4%', tone: 'positive' },
  { label: 'Renovacao', value: '82%', delta: 'base recorrente forte', tone: 'warning' },
]

export const subscriberMetrics: DashboardMetric[] = [
  { label: 'Assinaturas ativas', value: '4', delta: '+1 nova esta semana', tone: 'positive' },
  { label: 'Favoritas', value: '12', delta: '3 em alta hoje', tone: 'warning' },
  { label: 'Biblioteca liberada', value: '286', delta: 'midias desbloqueadas', tone: 'positive' },
]

export const creatorMetrics: DashboardMetric[] = [
  { label: 'Assinantes ativos', value: '2.480', delta: '+8,2%', tone: 'positive' },
  { label: 'Receita estimada', value: 'R$ 116k', delta: 'mensal bruto', tone: 'warning' },
  { label: 'Conteudos publicados', value: '126', delta: '12 agendados', tone: 'positive' },
]

export const adminMetrics: DashboardMetric[] = [
  { label: 'MRR plataforma', value: 'R$ 428k', delta: '+11,8%', tone: 'positive' },
  { label: 'Criadoras pendentes', value: '18', delta: '7 urgentes', tone: 'danger' },
  { label: 'Denuncias abertas', value: '9', delta: '3 em revisao', tone: 'warning' },
]

export const subscriberSections: Record<string, WorkspaceSection> = {
  favoritos: {
    slug: 'favoritos',
    title: 'Favoritos',
    description: 'Lista viva de criadoras para recorrencia, remarketing e quick re-subscribe.',
    bullets: [
      'Salvar criadoras em colecoes pessoais',
      'Acionar alertas quando houver novo drop',
      'Ordenar por destaque, novidade e preco',
    ],
    highlights: ['Retencao', 'Recompra', 'Wishlist premium'],
    metrics: [
      { label: 'Favoritos ativos', value: '12', delta: '+2 desde ontem', tone: 'positive' },
      { label: 'Com promocao', value: '3', delta: 'oportunidade de conversao', tone: 'warning' },
    ],
    table: {
      columns: ['Criadora', 'Categoria', 'Plano', 'Status'],
      rows: [
        ['Ayla Noir', 'Editorial Glam', 'R$ 59', 'assinavel'],
        ['Celeste Rush', 'Late Night Club', 'R$ 74', 'trending'],
        ['Safira Lane', 'Wellness Muse', 'R$ 42', 'nova'],
      ],
    },
  },
  assinaturas: {
    slug: 'assinaturas',
    title: 'Assinaturas ativas',
    description: 'Controle de renovacao, upgrade, cancelamento e falha de cobranca em uma unica camada.',
    bullets: [
      'Visualizar periodo atual e renovacao',
      'Alterar plano quando existir upgrade',
      'Receber alertas de falha de pagamento',
    ],
    highlights: ['Billing', 'Status', 'Retencao'],
    metrics: [
      { label: 'Ativas', value: '4', delta: '100% em dia', tone: 'positive' },
      { label: 'Cancelam no fim', value: '1', delta: 'acao de winback', tone: 'danger' },
    ],
    table: {
      columns: ['Criadora', 'Plano', 'Renova em', 'Status'],
      rows: [
        ['Ayla Noir', 'Velvet Circle', '05 maio', 'ativa'],
        ['Luna Sorel', 'Pulse', '11 maio', 'ativa'],
        ['Nina Velour', 'Pulse', '18 maio', 'cancelamento agendado'],
      ],
    },
  },
  pagamentos: {
    slug: 'pagamentos',
    title: 'Historico de pagamentos',
    description: 'Extrato legivel para suporte, disputas e confianca do assinante.',
    bullets: [
      'Linha do tempo de cobrancas e falhas',
      'Comprovantes para atendimento',
      'Base pronta para multi gateway',
    ],
    highlights: ['Financeiro', 'Confianca', 'Suporte'],
    metrics: [
      { label: 'Total investido', value: 'R$ 317', delta: 'ultimo trimestre', tone: 'warning' },
      { label: 'Falhas', value: '0', delta: 'ultimo ciclo', tone: 'positive' },
    ],
    table: {
      columns: ['Data', 'Criadora', 'Valor', 'Status'],
      rows: [
        ['22 abr', 'Ayla Noir', 'R$ 79', 'pago'],
        ['15 abr', 'Luna Sorel', 'R$ 49', 'pago'],
        ['02 abr', 'Nina Velour', 'R$ 69', 'pago'],
      ],
    },
  },
  biblioteca: {
    slug: 'biblioteca',
    title: 'Biblioteca desbloqueada',
    description: 'Acervo premium organizado por criadora, midia e momento da assinatura.',
    bullets: [
      'Fotos, videos e audio em um feed privado',
      'Blocos por criadora e colecao',
      'Filtro por recencia e formato',
    ],
    highlights: ['Media hub', 'Acesso premium', 'Experiencia mobile'],
    metrics: [
      { label: 'Itens liberados', value: '286', delta: '+18 esta semana', tone: 'positive' },
      { label: 'Criadoras na biblioteca', value: '4', delta: 'portfolio ativo', tone: 'warning' },
    ],
  },
  mensagens: {
    slug: 'mensagens',
    title: 'Mensagens privadas',
    description: 'Viavel como MVP expandido, com moderação, read-state e fila de suporte.',
    bullets: [
      'Threads por criadora',
      'Sinais de leitura e fila de resposta',
      'Camada pronta para monetizacao futura',
    ],
    highlights: ['Conversao', 'Retencao', 'Relacionamento'],
    metrics: [
      { label: 'Threads abertas', value: '6', delta: '2 aguardando resposta', tone: 'warning' },
      { label: 'Tempo medio', value: '3h', delta: 'SLA premium', tone: 'positive' },
    ],
  },
  notificacoes: {
    slug: 'notificacoes',
    title: 'Central de notificacoes',
    description: 'Comunica lancamentos, falhas de cobranca, novos posts e mensagens.',
    bullets: [
      'Preferencias por canal',
      'Agrupamento por prioridade',
      'Eventos acionados por assinatura',
    ],
    highlights: ['CRM', 'Alertas', 'Recorrencia'],
    metrics: [
      { label: 'Nao lidas', value: '8', delta: '3 criticas', tone: 'danger' },
      { label: 'Recebidas no mes', value: '41', delta: 'engajamento alto', tone: 'positive' },
    ],
  },
  configuracoes: {
    slug: 'configuracoes',
    title: 'Configuracoes da conta',
    description: 'Privacidade, notificacoes, seguranca e preferencias de descoberta.',
    bullets: [
      'Alterar senha e dados basicos',
      'Consentimentos operacionais',
      'Preferencias de notificacao e recomendacao',
    ],
    highlights: ['Conta', 'Privacidade', 'Seguranca'],
    metrics: [
      { label: 'Dispositivos ativos', value: '2', delta: 'ultimo acesso hoje', tone: 'warning' },
      { label: 'MFA pronto', value: 'Backlog', delta: 'pos-MVP', tone: 'danger' },
    ],
  },
}

export const creatorSections: Record<string, WorkspaceSection> = {
  onboarding: {
    slug: 'onboarding',
    title: 'Onboarding da criadora',
    description: 'Fluxo guiado para perfil, documentos, politicas e readiness comercial.',
    bullets: [
      'Checklist de publicacao inicial',
      'Tutorial rapido de planos e posts',
      'Status de verificacao e compliance',
    ],
    highlights: ['Setup', 'Readiness', 'Ativacao'],
    metrics: [
      { label: 'Etapas concluidas', value: '4/6', delta: 'faltam documentos', tone: 'warning' },
      { label: 'Tempo estimado', value: '9 min', delta: 'para publicar', tone: 'positive' },
    ],
  },
  perfil: {
    slug: 'perfil',
    title: 'Perfil artistico',
    description: 'Edita identidade visual, bio, galerias teaser, CTA e posicionamento de descoberta.',
    bullets: [
      'Hero, tagline e bio otimizada',
      'Tags, categorias e badges',
      'Galeria teaser e prova social',
    ],
    highlights: ['Brand', 'Descoberta', 'Conversao'],
    metrics: [
      { label: 'CTR do perfil', value: '7,2%', delta: '+1,1%', tone: 'positive' },
      { label: 'Completeness', value: '86%', delta: 'quase pronto', tone: 'warning' },
    ],
  },
  verificacao: {
    slug: 'verificacao',
    title: 'Verificacao',
    description: 'Documentos, revisao administrativa e trilha de decisao.',
    bullets: [
      'Upload seguro com validade',
      'Status pendente, aprovado ou rejeitado',
      'Historico de observacoes do time',
    ],
    highlights: ['Compliance', 'KYC', 'Trust'],
    metrics: [
      { label: 'Status atual', value: 'Pendente', delta: 'ultimo envio hoje', tone: 'warning' },
      { label: 'Itens faltantes', value: '1', delta: 'documento selfie', tone: 'danger' },
    ],
  },
  planos: {
    slug: 'planos',
    title: 'Gestao de planos',
    description: 'Camada comercial para recorrencia, upsell e futuras ofertas avulsas.',
    bullets: [
      'Criar planos mensais',
      'Ordenar destaque e copy de valor',
      'Sincronizar IDs de preco do gateway',
    ],
    highlights: ['Pricing', 'MRR', 'Upsell'],
    metrics: [
      { label: 'Planos ativos', value: '3', delta: '1 premium em destaque', tone: 'positive' },
      { label: 'Conversao media', value: '5,8%', delta: 'landing para checkout', tone: 'warning' },
    ],
  },
  conteudo: {
    slug: 'conteudo',
    title: 'Posts premium',
    description: 'Calendario editorial com teaser, bloqueio premium e programacao.',
    bullets: [
      'Rascunho, agendado, publicado e moderado',
      'CTA fixo de assinatura no perfil',
      'Compatibilidade com foto, video e audio',
    ],
    highlights: ['Publishing', 'Paywall', 'Calendar'],
    metrics: [
      { label: 'Rascunhos', value: '7', delta: '2 para hoje', tone: 'warning' },
      { label: 'Publicados no mes', value: '18', delta: '+22%', tone: 'positive' },
    ],
  },
  biblioteca: {
    slug: 'biblioteca',
    title: 'Biblioteca de midia',
    description: 'Gestao centralizada de arquivos, processamento e status de acesso.',
    bullets: [
      'Validador de formato e tamanho',
      'Teaser, premium e privado',
      'Fila de processamento e moderacao',
    ],
    highlights: ['Storage', 'Uploads', 'Moderacao'],
    metrics: [
      { label: 'Arquivos prontos', value: '312', delta: '+21 esta semana', tone: 'positive' },
      { label: 'Processando', value: '4', delta: 'video HD', tone: 'warning' },
    ],
  },
  assinantes: {
    slug: 'assinantes',
    title: 'Lista de assinantes',
    description: 'Visao operacional de base ativa, churn e sinais de reativacao.',
    bullets: [
      'Segmentacao por status',
      'Origem da assinatura e LTV',
      'Lista pronta para CRM futuro',
    ],
    highlights: ['CRM', 'Retention', 'LTV'],
    metrics: [
      { label: 'Base ativa', value: '2.480', delta: '+180 no mes', tone: 'positive' },
      { label: 'Churn previsto', value: '3,2%', delta: 'abaixo da meta', tone: 'warning' },
    ],
  },
  ganhos: {
    slug: 'ganhos',
    title: 'Ganhos e repasses',
    description: 'Painel financeiro com bruto, taxa da plataforma, liquido e calendario.',
    bullets: [
      'Resumo por periodo',
      'Saldo a repassar',
      'Extrato com falhas e chargebacks',
    ],
    highlights: ['Financeiro', 'Payout', 'Comissao'],
    metrics: [
      { label: 'Bruto do mes', value: 'R$ 116k', delta: '+8,2%', tone: 'positive' },
      { label: 'Liquido previsto', value: 'R$ 91k', delta: 'taxa incluida', tone: 'warning' },
    ],
  },
  analytics: {
    slug: 'analytics',
    title: 'Analytics basicos',
    description: 'Mede descoberta, conversao em assinatura, consumo de conteudo e crescimento.',
    bullets: [
      'Visitas, CTR e assinatura por perfil',
      'Conteudo mais destravado',
      'Sinais de recomendacao',
    ],
    highlights: ['Growth', 'Conversion', 'Content insights'],
    metrics: [
      { label: 'Visitas no perfil', value: '18,4k', delta: '+14%', tone: 'positive' },
      { label: 'Top teaser', value: 'Velvet Room', delta: 'CTR 11,2%', tone: 'warning' },
    ],
  },
  notificacoes: {
    slug: 'notificacoes',
    title: 'Notificacoes',
    description: 'Fila unica para eventos de sistema, pagamentos, moderacao e suporte.',
    bullets: [
      'Alertas de conteudo aprovado ou rejeitado',
      'Avisos financeiros',
      'Resumo operacional do dia',
    ],
    highlights: ['Ops', 'Alerts', 'Support'],
    metrics: [
      { label: 'Nao lidas', value: '5', delta: '2 operacionais', tone: 'warning' },
      { label: 'Criticas', value: '1', delta: 'documento pendente', tone: 'danger' },
    ],
  },
  configuracoes: {
    slug: 'configuracoes',
    title: 'Configuracoes da criadora',
    description: 'Conta, preferencia de pagamentos, consentimentos e integracoes futuras.',
    bullets: [
      'Conta e notificacoes',
      'Preferencias de repasse',
      'Termos e consentimento operacional',
    ],
    highlights: ['Conta', 'Payout', 'Consent'],
    metrics: [
      { label: 'Conta segura', value: 'Sim', delta: 'ultima revisao ontem', tone: 'positive' },
      { label: 'Metodo de repasse', value: 'Pix', delta: 'padrao do MVP', tone: 'warning' },
    ],
  },
}

export const adminSections: Record<string, WorkspaceSection> = {
  usuarios: {
    slug: 'usuarios',
    title: 'Gestao de usuarios',
    description: 'Base completa de assinantes com status, risco e historico de atividade.',
    bullets: [
      'Bloqueio, suspensao e notas internas',
      'Historico de login e cobranca',
      'Segmentacao por engajamento',
    ],
    highlights: ['Support', 'Risk', 'CRM'],
    metrics: [
      { label: 'Usuarios totais', value: '18.240', delta: '+7,4%', tone: 'positive' },
      { label: 'Risco medio', value: 'Baixo', delta: 'monitoramento ativo', tone: 'warning' },
    ],
  },
  criadoras: {
    slug: 'criadoras',
    title: 'Gestao de criadoras',
    description: 'Operacao de onboarding, crescimento e qualidade do catalogo.',
    bullets: [
      'Status comercial e verificacao',
      'Tags, destaque e curadoria',
      'Sinais de performance e suporte',
    ],
    highlights: ['Catalog', 'Curation', 'Quality'],
    metrics: [
      { label: 'Criadoras ativas', value: '148', delta: '+12 este mes', tone: 'positive' },
      { label: 'Em destaque', value: '18', delta: 'curadoria editorial', tone: 'warning' },
    ],
  },
  verificacao: {
    slug: 'verificacao',
    title: 'Verificacao e aprovacao',
    description: 'Fila de documentos, decisao administrativa e trilha auditavel.',
    bullets: [
      'Revisao por checklist',
      'Aprovacao, rejeicao ou pedido de ajuste',
      'Log com responsavel e justificativa',
    ],
    highlights: ['KYC', 'Audit', 'Compliance'],
    metrics: [
      { label: 'Pendentes', value: '18', delta: '7 urgentes', tone: 'danger' },
      { label: 'Tempo medio', value: '11h', delta: 'meta < 24h', tone: 'positive' },
    ],
  },
  moderacao: {
    slug: 'moderacao',
    title: 'Moderacao de conteudo',
    description: 'Controle de posts, midia e decisao operacional antes ou depois da publicacao.',
    bullets: [
      'Status pendente, aprovado, rejeitado',
      'Motivos padronizados',
      'Queue de reprocessamento',
    ],
    highlights: ['Content safety', 'Queue', 'Policy'],
    metrics: [
      { label: 'Pendente de revisao', value: '24', delta: '12 novos hoje', tone: 'warning' },
      { label: 'Rejeitados', value: '3', delta: '1 recurso aberto', tone: 'danger' },
    ],
  },
  denuncias: {
    slug: 'denuncias',
    title: 'Denuncias',
    description: 'Fila priorizada com contexto do alvo, motivo e historico de decisao.',
    bullets: [
      'Perfil, conteudo ou mensagem',
      'Atribuicao a um admin',
      'Resolucao com rastro',
    ],
    highlights: ['Trust & Safety', 'Triage', 'Audit'],
    metrics: [
      { label: 'Abertas', value: '9', delta: '3 em revisao', tone: 'warning' },
      { label: 'SLA estourado', value: '1', delta: 'requer acao imediata', tone: 'danger' },
    ],
  },
  assinaturas: {
    slug: 'assinaturas',
    title: 'Assinaturas',
    description: 'Motor financeiro com visao por plano, criadora e status do ciclo.',
    bullets: [
      'Ativas, canceladas, past due',
      'Renovacao e cancelamento',
      'Monitoramento de gateway',
    ],
    highlights: ['Billing', 'MRR', 'Churn'],
    metrics: [
      { label: 'Ativas', value: '6.820', delta: '+9,1%', tone: 'positive' },
      { label: 'Canceladas no mes', value: '312', delta: '4,5% churn', tone: 'warning' },
    ],
  },
  pagamentos: {
    slug: 'pagamentos',
    title: 'Pagamentos',
    description: 'Concentrador de transacoes, falhas, chargebacks e conciliacao.',
    bullets: [
      'Status por tentativa',
      'Detalhe por gateway',
      'Preparado para conciliacao futura',
    ],
    highlights: ['Transactions', 'Failures', 'Chargeback'],
    metrics: [
      { label: 'Aprovacao', value: '91,3%', delta: '+1,7 pp', tone: 'positive' },
      { label: 'Falhas hoje', value: '14', delta: 'maioria cartao expirado', tone: 'warning' },
    ],
  },
  repasses: {
    slug: 'repasses',
    title: 'Repasses',
    description: 'Governanca do valor devido a criadoras com janelas e comprovantes.',
    bullets: [
      'Calendario quinzenal ou mensal',
      'Bruto, taxas e liquido',
      'Status pendente, processando, pago',
    ],
    highlights: ['Payouts', 'Finance ops', 'Governance'],
    metrics: [
      { label: 'A pagar', value: 'R$ 172k', delta: 'proxima janela 30 abr', tone: 'warning' },
      { label: 'Pago no mes', value: 'R$ 418k', delta: '+10,2%', tone: 'positive' },
    ],
  },
  analytics: {
    slug: 'analytics',
    title: 'Analytics gerais',
    description: 'Visao executiva de crescimento, catalogo e saude da plataforma.',
    bullets: [
      'MRR, ARPU e churn',
      'Crescimento de criadoras e usuarios',
      'Top criadoras e top categorias',
    ],
    highlights: ['Executive view', 'Growth', 'Cohorts'],
    metrics: [
      { label: 'MRR', value: 'R$ 428k', delta: '+11,8%', tone: 'positive' },
      { label: 'ARPU', value: 'R$ 62,8', delta: '+4,1%', tone: 'warning' },
    ],
  },
  categorias: {
    slug: 'categorias',
    title: 'Categorias e tags',
    description: 'Taxonomia da descoberta, home e perfis semelhantes.',
    bullets: [
      'Ordenacao, cor e prioridade',
      'Tags para recomendacao',
      'Base de destaque e curadoria',
    ],
    highlights: ['Discovery', 'Search', 'Curation'],
    metrics: [
      { label: 'Categorias ativas', value: '14', delta: '6 principais na home', tone: 'positive' },
      { label: 'Tags mapeadas', value: '96', delta: 'base semantica inicial', tone: 'warning' },
    ],
  },
  cms: {
    slug: 'cms',
    title: 'CMS institucional',
    description: 'Blocos de texto institucional, suporte, legal e banners de homepage.',
    bullets: [
      'Hero banners e destaques',
      'Textos legais e FAQ',
      'Config de destaque editorial',
    ],
    highlights: ['CMS', 'Homepage', 'Legal'],
    metrics: [
      { label: 'Banners ativos', value: '5', delta: '2 rotacionando', tone: 'warning' },
      { label: 'Ultima edicao', value: 'Hoje', delta: 'copy comercial', tone: 'positive' },
    ],
  },
  configuracoes: {
    slug: 'configuracoes',
    title: 'Configuracoes gerais',
    description: 'Parametros da plataforma: fees, limites, emails, banners e toggles.',
    bullets: [
      'Taxa da plataforma e payout',
      'Flags de modulos do MVP',
      'Preferencias de notificacao operacional',
    ],
    highlights: ['Platform settings', 'Ops', 'Feature flags'],
    metrics: [
      { label: 'Feature flags', value: '12', delta: '3 beta', tone: 'warning' },
      { label: 'Ambiente', value: 'Staging pronto', delta: 'Railway friendly', tone: 'positive' },
    ],
  },
  logs: {
    slug: 'logs',
    title: 'Logs de atividade',
    description: 'Trilha de auditoria administrativa para governanca e suporte.',
    bullets: [
      'Acoes por admin',
      'IP, entidade e metadata',
      'Filtro por modulo e periodo',
    ],
    highlights: ['Audit trail', 'Security', 'Ops'],
    metrics: [
      { label: 'Eventos hoje', value: '183', delta: 'sem anomalias', tone: 'positive' },
      { label: 'Eventos criticos', value: '2', delta: 'ambos revisados', tone: 'warning' },
    ],
  },
  permissoes: {
    slug: 'permissoes',
    title: 'Gestao de permissoes',
    description: 'Matriz de acesso por papel com visao clara do que pode ser operado.',
    bullets: [
      'Papéis visitante, assinante, criadora, admin e super admin',
      'Acesso minimo por principio de menor privilegio',
      'Base pronta para RBAC evolutivo',
    ],
    highlights: ['RBAC', 'Governance', 'Security'],
    metrics: [
      { label: 'Papéis ativos', value: '5', delta: 'MVP completo', tone: 'positive' },
      { label: 'Permissoes sensiveis', value: '9', delta: 'restritas ao super admin', tone: 'danger' },
    ],
  },
}

export function getCreatorBySlug(slug: string) {
  return creators.find((creator) => creator.slug === slug)
}

export function getSimilarCreators(slug: string) {
  const creator = getCreatorBySlug(slug)
  if (!creator) {
    return creators.slice(0, 3)
  }

  return creator.similarSlugs
    .map((similarSlug) => getCreatorBySlug(similarSlug))
    .filter((item): item is CreatorSummary => Boolean(item))
}
