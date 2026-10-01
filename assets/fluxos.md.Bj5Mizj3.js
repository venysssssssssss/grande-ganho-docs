import{_ as i,C as s,o as t,c as d,j as e,a as o,E as r}from"./chunks/framework.VjMZkWOe.js";const g=JSON.parse('{"title":"Fluxos críticos","description":"","frontmatter":{},"headers":[],"relativePath":"fluxos.md","filePath":"fluxos.md"}'),l={name:"fluxos.md"};function c(p,a,u,m,v,A){const n=s("MermaidDiagram");return t(),d("div",null,[a[0]||(a[0]=e("h1",{id:"fluxos-criticos",tabindex:"-1"},[o("Fluxos críticos "),e("a",{class:"header-anchor",href:"#fluxos-criticos","aria-label":'Permalink to "Fluxos críticos"'},"​")],-1)),a[1]||(a[1]=e("p",null,"Sequências de referência do desenho aprovado. Passos cloud e contratos futuros permanecem pendentes de implementação e comprovação na entrega. Toda operação tenant usa uma transação; toda autorização sensível é reavaliada no momento do acesso.",-1)),a[2]||(a[2]=e("h2",{id:"identidade-mfa-e-sessao",tabindex:"-1"},[o("Identidade, MFA e sessão "),e("a",{class:"header-anchor",href:"#identidade-mfa-e-sessao","aria-label":'Permalink to "Identidade, MFA e sessão"'},"​")],-1)),r(n,{code:`sequenceDiagram
  participant C as Web ou Android
  participant I as Identity Platform
  participant A as API
  participant D as PostgreSQL
  C->>I: Login e desafio MFA TOTP
  I-->>C: ID token de identidade
  C->>A: Trocar token por sessão
  A->>I: Verificar assinatura, emissor, audiência e revogação
  A->>A: Exigir email verificado e MFA no token
  A->>D: Verificar convite e associação ativa
  D-->>A: Organização, papel e escopo persistidos
  A->>D: Criar sessão opaca revogável, guardar hash
  A-->>C: Cookie seguro web ou bearer opaco mobile
  C->>A: Operação autorizada
  A->>D: Verificar sessão e associação atuais
  A->>D: BEGIN, SET LOCAL principal, consulta, COMMIT
  A-->>C: DTO projetado sem conteúdo restrito
`}),a[3]||(a[3]=e("p",null,[o("O token de identidade não é a sessão operacional da aplicação. Sessões podem ser revogadas por dispositivo ou por usuário; revogação de associação deve valer na próxima requisição. Cookie web usa "),e("code",null,"Secure"),o(", "),e("code",null,"HttpOnly"),o(" e política "),e("code",null,"SameSite"),o(" adequada ao domínio, com CSRF nas mutações. Android usa armazenamento protegido pelo sistema operacional; não grava bearer em logs ou preferências sem proteção.")],-1)),a[4]||(a[4]=e("h2",{id:"check-in-e-avaliacao-de-pilar",tabindex:"-1"},[o("Check-in e avaliação de pilar "),e("a",{class:"header-anchor",href:"#check-in-e-avaliacao-de-pilar","aria-label":'Permalink to "Check-in e avaliação de pilar"'},"​")],-1)),r(n,{code:`sequenceDiagram
  participant C as Operador
  participant A as API
  participant D as Banco tenant
  participant K as KMS
  C->>A: Check-in, Idempotency-Key, versão e evidência
  A->>A: Validar schema e distinguir ausente de zero
  A->>D: BEGIN, principal e chave de repetição
  A->>D: Revalidar matrícula, finalidade e concessão
  alt Conteúdo pessoal autorizado
    A->>K: Cifrar envelope de conteúdo sensível
    K-->>A: Conteúdo cifrado e referência da chave
    A->>D: Salvar conteúdo separado da projeção operacional
  else Conteúdo operacional
    A->>D: Salvar avaliação com fonte e data observada
  end
  A->>D: Gravar auditoria e versão, COMMIT
  A-->>C: Resultado seguro e versão atual
  C->>A: Repetir a mesma chave e payload
  A-->>C: Mesmo resultado, não duplica avaliação
`}),a[5]||(a[5]=e("p",null,"Se o payload muda com a mesma chave, há conflito. Se a versão está antiga, a mutação é recusada e o cliente refaz a leitura; não há sobrescrita silenciosa. Conteúdo pessoal não alimenta risco comercial nem a porcentagem de execução do plano.",-1)),a[6]||(a[6]=e("h2",{id:"briefing-do-mentor",tabindex:"-1"},[o("Briefing do mentor "),e("a",{class:"header-anchor",href:"#briefing-do-mentor","aria-label":'Permalink to "Briefing do mentor"'},"​")],-1)),r(n,{code:`sequenceDiagram
  participant M as Mentor
  participant A as API
  participant D as Banco tenant
  participant K as KMS
  M->>A: Pedir briefing da matrícula
  A->>D: Sessão e escopo de responsável atuais
  A->>D: Carregar fatos, ações, plano e datas
  A->>D: Verificar concessões por finalidade e expiração
  alt Conteúdo sensível explicitamente permitido
    A->>K: Decrypt autorizado
    K-->>A: Conteúdo para projeção permitida
    A->>D: Auditar leitura sensível sem copiar conteúdo
  else Sem concessão
    A->>A: Remover valor e metadados de existência
  end
  A-->>M: Briefing factual com evidências e frescor
`}),a[7]||(a[7]=e("p",null,"Um briefing é projeção factual, não diagnóstico automático. A versão inicial não inventa análise por IA. Não buscar conteúdo pessoal para depois apenas escondê-lo no frontend: a projeção e a autorização são responsabilidade do backend.",-1)),a[8]||(a[8]=e("h2",{id:"jobs-duraveis-e-falha",tabindex:"-1"},[o("Jobs duráveis e falha "),e("a",{class:"header-anchor",href:"#jobs-duraveis-e-falha","aria-label":'Permalink to "Jobs duráveis e falha"'},"​")],-1)),r(n,{code:`sequenceDiagram
  participant A as API
  participant D as PostgreSQL
  participant W as Worker
  participant E as Efeito externo
  A->>D: BEGIN e principal atual
  A->>D: Mutação de negócio e enfileiramento pg-boss
  A->>D: COMMIT conjunto
  D-->>W: Job com IDs, finalidade e ator
  W->>D: Revalidar sessão, associação, escopo e concessão
  alt Autorização atual e efeito ainda não aplicado
    W->>E: Executar com idempotência do provedor quando disponível
    E-->>W: Resultado
    W->>D: Persistir resultado e auditar
  else Revogado ou expirado
    W->>D: Encerrar sem executar efeito
  end
  Note over W,D: Retry limitado, falha permanente vai para fila de falha
`}),a[9]||(a[9]=e("p",null,"O rollback da transação inicial deve remover também o job. Reentrega não duplica efeito no banco. Para terceiros, registrar estado de tentativa e reconciliar resultado incerto; não afirmar exactly-once. A fila de falha não deve conter texto pessoal, token ou documento.",-1)),a[10]||(a[10]=e("h2",{id:"exportacao-e-download",tabindex:"-1"},[o("Exportação e download "),e("a",{class:"header-anchor",href:"#exportacao-e-download","aria-label":'Permalink to "Exportação e download"'},"​")],-1)),r(n,{code:`sequenceDiagram
  participant C as Operador
  participant A as API
  participant D as Banco
  participant W as Worker
  participant B as Bucket privado
  C->>A: Solicitar export com filtros em allowlist
  A->>D: Autorizar e persistir job com IDs
  D-->>W: Job disponível
  W->>D: Revalidar associação e finalidade no início
  W->>D: Consultar páginas tenant com projeção segura
  W->>D: Revalidar antes de publicar o resultado
  W->>B: Salvar arquivo privado temporário
  W->>D: Registrar proprietário, escopo e expiração
  C->>A: Pedir download do resultado
  A->>D: Revalidar sessão e escopo atuais
  A->>B: Acesso autorizado
  A-->>C: Conteúdo com cache privado e prazo curto
`}),a[11]||(a[11]=e("p",null,"Exportação padrão exclui conteúdo pessoal. Valores monetários preservam unidade menor e moeda; CSV neutraliza células com fórmulas. Escopo é aplicado ao conjunto inteiro e a cada evidência. URL previamente emitida pode manter acesso até expirar se o provedor não oferecer revogação: para conteúdo sensível, preferir streaming autenticado e declarar esse limite.",-1)),a[12]||(a[12]=e("h2",{id:"revogacao-de-acesso-sensivel",tabindex:"-1"},[o("Revogação de acesso sensível "),e("a",{class:"header-anchor",href:"#revogacao-de-acesso-sensivel","aria-label":'Permalink to "Revogação de acesso sensível"'},"​")],-1)),r(n,{code:`sequenceDiagram
  participant G as Responsável autorizado
  participant A as API
  participant D as Banco
  participant W as Worker
  participant C as Cliente com sessão antiga
  G->>A: Revogar concessão ou associação
  A->>D: BEGIN, revogar, auditar, COMMIT
  C->>A: Novo briefing, decrypt ou download
  A->>D: Consultar política atual
  A-->>C: Recusar ou devolver projeção operacional permitida
  W->>D: Job pendente revalida política
  D-->>W: Concessão revogada
  W->>D: Encerrar e remover resultado indevido
  Note over C,A: Conteúdo já visto não pode ser desvisualizado
`}),a[13]||(a[13]=e("p",null,"Revogação não depende do próximo login. Frontend remove caches locais no logout, troca de organização e perda de acesso. O servidor precisa bloquear jobs, arquivos e leituras subsequentes; esconder um botão não protege o conteúdo.",-1))])}const D=i(l,[["render",c]]);export{g as __pageData,D as default};
