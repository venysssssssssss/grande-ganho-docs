import{_ as i,C as s,o as t,c as d,j as a,a as o,E as n}from"./chunks/framework.VjMZkWOe.js";const N=JSON.parse('{"title":"Arquitetura","description":"","frontmatter":{},"headers":[],"relativePath":"arquitetura.md","filePath":"arquitetura.md"}'),l={name:"arquitetura.md"};function c(p,e,u,m,g,v){const r=s("MermaidDiagram");return t(),d("div",null,[e[0]||(e[0]=a("h1",{id:"arquitetura",tabindex:"-1"},[o("Arquitetura "),a("a",{class:"header-anchor",href:"#arquitetura","aria-label":'Permalink to "Arquitetura"'},"​")],-1)),e[1]||(e[1]=a("p",null,"Os diagramas representam o desenho aprovado. Serviços cloud, políticas IAM e capacidade devem ser confirmados por implantação e testes; não são evidência de recursos já provisionados.",-1)),e[2]||(e[2]=a("h2",{id:"c4-·-contexto",tabindex:"-1"},[o("C4 · Contexto "),a("a",{class:"header-anchor",href:"#c4-·-contexto","aria-label":'Permalink to "C4 · Contexto"'},"​")],-1)),n(r,{code:`flowchart TB
  cs[Equipe de acompanhamento] -->|Rotina e histórico| os[Potência Success OS]
  mentor[Mentor] -->|Sessões, planos e briefing| os
  gestor[Gestor da organização] -->|Operação e governança| os
  titular[Titular dos dados] -.->|Solicitação de privacidade via operação| os
  os -->|Identidade verificada e MFA| identity[Identity Platform]
  os -->|Arquivos privados| storage[Armazenamento de objetos]
  os -->|Criptografia de conteúdo pessoal| kms[Cloud KMS]
  member[Portal do mentorado futuro] -.->|Contrato posterior| os
  channels[Mensageria e IA futuras] -.->|Integração separadamente aprovada| os
`}),e[3]||(e[3]=a("p",null,"Equipe e mentor operam matrículas dentro da organização. O titular não recebe acesso ao sistema interno por ser cliente. Privacidade pode ser exercida por processo assistido; o portal futuro terá política própria.",-1)),e[4]||(e[4]=a("h2",{id:"c4-·-containers",tabindex:"-1"},[o("C4 · Containers "),a("a",{class:"header-anchor",href:"#c4-·-containers","aria-label":'Permalink to "C4 · Containers"'},"​")],-1)),n(r,{code:`flowchart LR
  web[Frontend web futuro] -->|HTTPS, cookie e CSRF| api[API Fastify /v1]
  mobile[Android online futuro] -->|HTTPS, bearer opaco| api
  api -->|Validação de identidade| identity[Identity Platform]
  api -->|Transação com principal| db[(PostgreSQL 17)]
  worker[Worker Node.js] -->|pg-boss, jobs persistentes| db
  api -->|Upload em quarentena| files[Bucket privado]
  worker -->|Inspeção e exportação| files
  api -->|Envelope decrypt autorizado| kms[Cloud KMS]
  worker -->|Revalida concessão antes de decrypt| kms
  publicdocs[Docs públicas VitePress] --- publichost[GitHub Pages dedicado]
  internaldocs[Docs operacionais privadas] --- protectedhost[Origem integralmente autenticada]
`}),e[5]||(e[5]=a("p",null,"Um monólito modular TypeScript compartilha domínio e contratos entre dois processos: API stateless e worker persistente. PostgreSQL garante referências, transações, políticas RLS e fila. Não há microserviços, Redis ou Kubernetes neste recorte.",-1)),e[6]||(e[6]=a("h2",{id:"c4-·-componentes-da-api-e-worker",tabindex:"-1"},[o("C4 · Componentes da API e worker "),a("a",{class:"header-anchor",href:"#c4-·-componentes-da-api-e-worker","aria-label":'Permalink to "C4 · Componentes da API e worker"'},"​")],-1)),n(r,{code:`flowchart TB
  http[HTTP e schemas TypeBox] --> auth[Identidade e sessão]
  auth --> policy[Organização, papel, escopo e finalidade]
  policy --> tx[Transação tenant SET LOCAL]
  tx --> resources[Cadastros e estrutura]
  tx --> operations[Carteira, 360, planos e ações]
  tx --> sensitive[Avaliações pessoais e concessões]
  tx --> evidence[Evidências e quarentena]
  resources --> audit[Auditoria transacional]
  operations --> audit
  sensitive --> audit
  evidence --> audit
  tx --> jobs[pg-boss na transação de negócio]
  jobs --> handler[Handler worker idempotente]
  handler --> policy
  handler --> retention[Retenção e expurgo]
`}),e[7]||(e[7]=a("p",null,"Schemas formam a fronteira de entrada e OpenAPI. A camada de autorização deriva o principal da sessão e da associação persistida. O cliente não escolhe seu ator, papel ou organização de confiança. Os handlers recebem identificadores e reconstituem autorização, evitando congelar permissões em payloads de fila.",-1)),e[8]||(e[8]=a("h2",{id:"modelo-de-dados-·-erd-conceitual",tabindex:"-1"},[o("Modelo de dados · ERD conceitual "),a("a",{class:"header-anchor",href:"#modelo-de-dados-·-erd-conceitual","aria-label":'Permalink to "Modelo de dados · ERD conceitual"'},"​")],-1)),n(r,{code:`erDiagram
  ORGANIZATION ||--o{ CLUB : possui
  ORGANIZATION ||--o{ PERSON : registra
  ORGANIZATION ||--o{ COMPANY : registra
  ORGANIZATION ||--o{ MEMBERSHIP : autoriza
  CLUB ||--o{ PROGRAM : oferece
  PROGRAM ||--o{ COHORT : agrupa
  ORGANIZATION ||--o{ PORTFOLIO : organiza
  PERSON ||--o{ ENROLLMENT : participa
  COMPANY o|--o{ ENROLLMENT : contexto
  PROGRAM ||--o{ ENROLLMENT : define
  COHORT o|--o{ ENROLLMENT : turma
  PORTFOLIO o|--o{ ENROLLMENT : carteira
  ENROLLMENT ||--o{ RESPONSIBILITY : equipe
  ENROLLMENT ||--o{ SESSION : historico
  ENROLLMENT ||--o{ ASSESSMENT : avaliado
  PILLAR ||--o{ ASSESSMENT : configura
  ASSESSMENT o|--o| SENSITIVE_CONTENT : separa
  ENROLLMENT ||--o{ PURPOSE_GRANT : concede
  ENROLLMENT ||--o{ PLAN : planeja
  PLAN ||--o{ GOAL : objetiva
  GOAL o|--o{ ACTION : executa
  ENROLLMENT ||--o{ RISK : avalia
  ENROLLMENT ||--o{ EVIDENCE : comprova
  ENROLLMENT ||--o{ CONSENT : registra
  MEMBERSHIP ||--o{ ACCESS_SESSION : autentica
  ORGANIZATION ||--o{ AUDIT_EVENT : audita
  ORGANIZATION ||--o{ JOB : processa
  ORGANIZATION ||--o{ DELETION_MARKER : impede_ressurreicao
  ENROLLMENT {
    uuid organization_id FK
    uuid id PK
    uuid person_id FK
    uuid program_id FK
    int version
    date cycle_start
    date cycle_end
  }
  ASSESSMENT {
    uuid organization_id FK
    uuid enrollment_id FK
    uuid pillar_id FK
    string status
    decimal optional_score
    datetime observed_at
    string source
    string visibility
    string sensitivity
  }
`}),e[9]||(e[9]=a("p",null,[o("O ERD expressa relações do domínio, não substitui o schema da migração. No banco, todo vínculo operacional inclui "),a("code",null,"organization_id"),o(": a FK de uma sessão para matrícula referencia "),a("code",null,"(organization_id, enrollment_id)"),o(". IDs válidos de outra organização não podem formar relações. Há unicidade de chaves compostas e índices pelas consultas reais de organização, responsáveis e datas.")],-1)),e[10]||(e[10]=a("p",null,"Turma é agrupamento acadêmico de um programa; carteira organiza responsabilidade operacional. A mesma pessoa pode ter matrículas simultâneas e ciclos distintos. Renovação cria uma nova participação ou ciclo conforme regra explícita, preservando histórico e evitando sobrescrever uma pessoa.",-1)),e[11]||(e[11]=a("p",null,"Pilares são configuráveis. Cada avaliação armazena fonte, autor, data observada, frescor, status, tendência, score opcional e evidência. Conteúdo pessoal tem armazenamento separado e cifrado; o resumo operacional não revela a existência de informações ocultas. Ausência de acesso não vira alerta de saúde.",-1)),e[12]||(e[12]=a("h2",{id:"rede-e-fronteiras-de-confianca",tabindex:"-1"},[o("Rede e fronteiras de confiança "),a("a",{class:"header-anchor",href:"#rede-e-fronteiras-de-confianca","aria-label":'Permalink to "Rede e fronteiras de confiança"'},"​")],-1)),n(r,{code:`flowchart TB
  internet[Internet e clientes não confiáveis] -->|TLS| edge[Entrada pública controlada]
  subgraph service[Projeto cloud do ambiente]
    edge --> api[Cloud Run API]
    worker[Cloud Run Worker com CPU disponível] --> vpc[Saída VPC privada]
    api --> vpc
    vpc --> sql[(Cloud SQL PostgreSQL HA sem IP público)]
    api --> privatebucket[Bucket privado, acesso por IAM]
    worker --> privatebucket
    api --> key[Secret Manager e KMS]
    worker --> key
    migration[Job de migração com papel separado] --> sql
  end
  federation[CI com identidade federada] -->|IAM mínimo| migration
  federation -->|Imagens imutáveis| registry[Artifact Registry]
  registry --> api
  registry --> worker
  identity[Identidade gerenciada] -->|Token verificado pela API| api
`}),e[13]||(e[13]=a("p",null,"Banco e bucket não têm acesso público. Identidades de API, worker, migração e CI são distintas e usam mínimo privilégio. Produção e staging têm projetos, banco, buckets, chaves e segredos separados. Segredos nunca entram na imagem, documentação ou workflow; CI usa federação em vez de chave de serviço persistente.",-1)),e[14]||(e[14]=a("h2",{id:"implantacao-desejada",tabindex:"-1"},[o("Implantação desejada "),a("a",{class:"header-anchor",href:"#implantacao-desejada","aria-label":'Permalink to "Implantação desejada"'},"​")],-1)),n(r,{code:`flowchart LR
  commit[Commit revisado] --> ci[Build e testes]
  ci --> image[Imagem por digest]
  image --> stage[Staging isolado]
  stage --> smoke[Testes de migração e autorização]
  smoke --> migrate[Migração expand compatível]
  migrate --> api[Revisão API gradual]
  migrate --> worker[Worker e fila compatíveis]
  api --> observe[Métricas e verificação]
  worker --> observe
  observe --> decision{Aceitar?}
  decision -->|Sim| stable[Promover]
  decision -->|Não| rollback[Revisão anterior compatível]
`}),e[15]||(e[15]=a("p",null,"A região primária prevista é São Paulo. Cloud SQL HA cobre falha zonal; não cobre indisponibilidade de toda a região. Backups, PITR e estratégia regional têm ensaios distintos. A API tem pools e concorrência limitados: o orçamento de conexões considera revisões simultâneas, autoscaling, workers e migração.",-1)),e[16]||(e[16]=a("p",null,"Fila persistente não garante exactly-once para terceiros. Todos os efeitos precisam de deduplicação quando possível e reconciliação quando o provedor não fornece idempotência. A CPU do worker deve estar disponível fora de requisições HTTP; um serviço sob suspensão não é um executor confiável.",-1))])}const E=i(l,[["render",c]]);export{N as __pageData,E as default};
