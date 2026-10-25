/*!
 * Copyright (c) 2026 Trelle Software GmbH
 * Licensed under the Fair Use License
 */

const STORAGE_KEY = 'trelle_mock_db_v3';
const ALLOWED_EMAIL = 'pablomesquitads@gmail.com';

const createDefaultDatabase = () => {
  const now = new Date();
  const d2 = new Date(now.getTime() + 86400000 * 2).toISOString();
  const d3 = new Date(now.getTime() + 86400000 * 3).toISOString();
  const d5 = new Date(now.getTime() + 86400000 * 5).toISOString();
  const dPast = new Date(now.getTime() - 86400000).toISOString();
  const sStart1 = new Date(now.getTime() + 3600000 * 2).toISOString();
  const sEnd1 = new Date(now.getTime() + 3600000 * 6).toISOString();
  const sStart2 = new Date(now.getTime() + 86400000).toISOString();
  const sEnd2 = new Date(now.getTime() + 86400000 + 7200000).toISOString();

  return {
    bootstrap: {
      version: '2.0.0',
      instanceName: 'Trelle',
      isDemoMode: false,
      isRegistrationEnabled: false,
      isSsoRegistrationEnabled: false,
    },
    user: {
      id: '1',
      email: ALLOWED_EMAIL,
      username: 'pablomesquitads',
      name: 'Pablo Mesquita',
      role: 'admin',
      avatarUrl: null,
      phone: null,
      organization: 'Trelle Inc.',
      language: 'pt-BR',
      subscribeToOwnCards: true,
      enableFavoritesByDefault: true,
      defaultHomeView: 'gridProjects',
      defaultProjectsOrder: 'alphabetically',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    projects: [
      {
        id: '1',
        name: 'Workspace Trelle 2026',
        backgroundType: 'gradient',
        backgroundImage: null,
        backgroundColor: 'board-gradient-1',
        isFavorite: true,
        isHidden: false,
        ownerProjectManagerId: '1',
        createdAt: now.toISOString(),
      },
    ],
    projectManagers: [
      {
        id: '1',
        projectId: '1',
        userId: '1',
      },
    ],
    boards: [
      {
        id: '1',
        projectId: '1',
        name: 'Quadro Trelle Premium 2026',
        type: 'board',
        view: 'kanban',
        createdAt: now.toISOString(),
      },
    ],
    boardMemberships: [
      {
        id: '1',
        boardId: '1',
        userId: '1',
        role: 'editor',
      },
    ],
    lists: [
      {
        id: 'l1',
        boardId: '1',
        type: 'active',
        name: '💡 Backlog & Ideias',
        position: 1000,
        wipLimit: null,
        isCollapsed: false,
        color: null,
      },
      {
        id: 'l2',
        boardId: '1',
        type: 'active',
        name: '📋 A Fazer',
        position: 2000,
        wipLimit: 4,
        isCollapsed: false,
        color: '#0079bf',
      },
      {
        id: 'l3',
        boardId: '1',
        type: 'active',
        name: '⚡ Em Andamento (WIP 2)',
        position: 3000,
        wipLimit: 2,
        isCollapsed: false,
        color: '#eb5a46',
      },
      {
        id: 'l4',
        boardId: '1',
        type: 'active',
        name: '🔍 Revisão & QA',
        position: 4000,
        wipLimit: 3,
        isCollapsed: false,
        color: '#ffab00',
      },
      {
        id: 'l5',
        boardId: '1',
        type: 'active',
        name: '✅ Concluído',
        position: 5000,
        wipLimit: null,
        isCollapsed: false,
        color: '#61bd4f',
      },
    ],
    labels: [
      { id: 'lb1', boardId: '1', name: 'Butler / IA', color: 'purple' },
      { id: 'lb2', boardId: '1', name: 'Urgente', color: 'red' },
      { id: 'lb3', boardId: '1', name: 'Frontend', color: 'blue' },
      { id: 'lb4', boardId: '1', name: 'Backend', color: 'green' },
    ],
    cards: [
      {
        id: 'c1',
        boardId: '1',
        listId: 'l3',
        creatorUserId: '1',
        type: 'card',
        position: 1000,
        name: '🚀 Motor de Automações Butler Híbrido',
        description: 'Motor de regras Event-Driven e Time-Driven com controle de recursão depth <= 3 e construtor AI-to-Rule em linguagem natural.',
        dueDate: d2,
        scheduledStartTime: sStart1,
        scheduledEndTime: sEnd1,
        isDueCompleted: false,
        isClosed: false,
        createdAt: now.toISOString(),
      },
      {
        id: 'c2',
        boardId: '1',
        listId: 'l3',
        creatorUserId: '1',
        type: 'card',
        position: 2000,
        name: '🧠 Atlassian Intelligence Copilot Integrado',
        description: 'Recursos nativos de IA: Extrator de action items para checklists, Resumo executivo de discussões e Refinamento de descrição estruturada.',
        dueDate: d3,
        scheduledStartTime: sStart2,
        scheduledEndTime: sEnd2,
        isDueCompleted: false,
        isClosed: false,
        createdAt: now.toISOString(),
      },
      {
        id: 'c3',
        boardId: '1',
        listId: 'l2',
        creatorUserId: '1',
        type: 'card',
        position: 1000,
        name: '📊 Multi-Views: Gantt, Timeline & Calendário',
        description: 'Visualização dinâmica alternável: Kanban, Calendário mensal/semanal, Linha do Tempo / Gantt com dependências, Tabela e Dashboard analítico.',
        dueDate: d5,
        scheduledStartTime: null,
        scheduledEndTime: null,
        isDueCompleted: false,
        isClosed: false,
        createdAt: now.toISOString(),
      },
      {
        id: 'c4',
        boardId: '1',
        listId: 'l5',
        creatorUserId: '1',
        type: 'card',
        position: 1000,
        name: '🛡️ Super-Listas com Limite WIP e Cores',
        description: 'Colunas expansíveis e recolhíveis horizontalmente com contador de cartões e alerta visual de saturação de limite WIP.',
        dueDate: dPast,
        scheduledStartTime: null,
        scheduledEndTime: null,
        isDueCompleted: true,
        isClosed: false,
        createdAt: now.toISOString(),
      },
    ],
    cardMemberships: [
      { id: 'cm1', cardId: 'c1', userId: '1' },
      { id: 'cm2', cardId: 'c2', userId: '1' },
      { id: 'cm3', cardId: 'c3', userId: '1' },
    ],
    cardLabels: [
      { id: 'cl1', cardId: 'c1', labelId: 'lb1' },
      { id: 'cl2', cardId: 'c1', labelId: 'lb2' },
      { id: 'cl3', cardId: 'c2', labelId: 'lb1' },
      { id: 'cl4', cardId: 'c3', labelId: 'lb3' },
    ],
    taskLists: [
      { id: 'tl1', cardId: 'c1', name: 'Critérios de Aceite Butler', position: 1000 },
    ],
    tasks: [
      { id: 'tk1', taskListId: 'tl1', name: 'Gatilhos Event-Driven e Cron', isCompleted: true, position: 1000, assigneeUserId: '1', dueDate: d2 },
      { id: 'tk2', taskListId: 'tl1', name: 'Prevenção de loop infinito (depth <= 3)', isCompleted: true, position: 2000, assigneeUserId: '1', dueDate: d3 },
      { id: 'tk3', taskListId: 'tl1', name: 'AI-to-Rule Builder integrado', isCompleted: false, position: 3000, assigneeUserId: '1', dueDate: null },
    ],
    customFieldGroups: [
      { id: 'cfg1', boardId: '1', name: 'Campos Customizados 2026' },
    ],
    customFields: [
      {
        id: 'cf1',
        customFieldGroupId: 'cfg1',
        name: 'Prioridade',
        type: 'dropdown',
        options: [
          { id: 'o1', value: 'Alta', color: 'red' },
          { id: 'o2', value: 'Média', color: 'yellow' },
          { id: 'o3', value: 'Baixa', color: 'green' },
        ],
        position: 1000,
      },
      {
        id: 'cf2',
        customFieldGroupId: 'cfg1',
        name: 'Story Points',
        type: 'number',
        position: 2000,
      },
    ],
    customFieldValues: [
      { id: 'cfv1', cardId: 'c1', customFieldId: 'cf1', value: 'Alta' },
      { id: 'cfv2', cardId: 'c1', customFieldId: 'cf2', value: 8 },
      { id: 'cfv3', cardId: 'c2', customFieldId: 'cf1', value: 'Alta' },
      { id: 'cfv4', cardId: 'c2', customFieldId: 'cf2', value: 5 },
    ],
    automationRules: [
      {
        id: 'ar1',
        boardId: '1',
        name: 'Mover para Concluído ao finalizar checklist',
        trigger_type: 'checklist_completed',
        trigger_config: {},
        conditions_config: [],
        actions_config: [{ type: 'move_card', list: 'Concluído' }],
        is_active: true,
      },
      {
        id: 'ar2',
        boardId: '1',
        name: 'Botão: Finalizar Tarefa',
        trigger_type: 'card_button',
        trigger_config: { button_label: 'Finalizar Tarefa' },
        conditions_config: [],
        actions_config: [{ type: 'move_card', list: 'Concluído' }, { type: 'complete_all_tasks' }],
        is_active: true,
      },
    ],
    cardDependencies: [
      { id: 'cd1', cardId: 'c2', dependsOnCardId: 'c1', type: 'blocked_by' },
    ],
    cardMirrors: [],
    inboxCards: [
      {
        id: 'inbox1',
        name: 'Captura Rápida: Alinhar roadmap Q1 com time',
        description: 'Nota rápida criada no painel Global Inbox retrátil',
        isInbox: true,
        boardId: null,
        listId: null,
        position: 1000,
        createdAt: now.toISOString(),
      },
    ],
  };
};

const getDB = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    /* empty */
  }
  const defaultDB = createDefaultDatabase();
  saveDB(defaultDB);
  return defaultDB;
};

const saveDB = (db) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    /* empty */
  }
};

export const generateMockJwt = () => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      userId: '1',
      email: ALLOWED_EMAIL,
      exp: Math.floor(Date.now() / 1000) + 365 * 86400,
    }),
  );
  return `${header}.${payload}.mock_signature`;
};

export const handleMockRequest = async (method, url, data) => {
  const cleanUrl = url.split('?')[0];
  const queryStr = url.includes('?') ? url.split('?')[1] : '';
  const searchParams = new URLSearchParams(queryStr);
  const db = getDB();

  // 1. Bootstrap
  if (cleanUrl === '/bootstrap') {
    return { item: db.bootstrap };
  }

  // 2. Access Tokens (Login)
  if (cleanUrl === '/access-tokens' && method === 'POST') {
    let emailOrUsername = '';
    if (data instanceof FormData) {
      emailOrUsername = data.get('emailOrUsername') || '';
    } else if (data && typeof data === 'object') {
      emailOrUsername = data.emailOrUsername || '';
    }
    emailOrUsername = emailOrUsername.trim().toLowerCase();

    if (emailOrUsername !== ALLOWED_EMAIL && emailOrUsername !== 'pablomesquitads') {
      throw {
        code: 'E_UNAUTHORIZED',
        message: 'Apenas pablomesquitads@gmail.com possui permissão de acesso ao Trelle.',
      };
    }

    sessionStorage.removeItem('trelle_explicit_logout');
    return { item: generateMockJwt() };
  }

  if (cleanUrl === '/access-tokens/me' && method === 'DELETE') {
    sessionStorage.setItem('trelle_explicit_logout', 'true');
    return { item: true };
  }

  // 3. Current User
  if (cleanUrl === '/users/me') {
    return {
      item: db.user,
      included: { notificationServices: [] },
    };
  }

  // 4. Config & Webhooks
  if (cleanUrl === '/config') {
    return { item: { googleAnalyticsId: null } };
  }

  if (cleanUrl === '/webhooks') {
    return { items: [] };
  }

  if (cleanUrl === '/notifications') {
    return { items: [], included: { users: [] } };
  }

  if (cleanUrl === '/users') {
    return { items: [db.user] };
  }

  // 5. Projects
  if (cleanUrl === '/projects' && method === 'GET') {
    return {
      items: db.projects,
      included: {
        projectManagers: db.projectManagers,
        backgroundImages: [],
        baseCustomFieldGroups: [],
        boards: db.boards,
        users: [db.user],
        boardMemberships: db.boardMemberships,
        customFields: db.customFields,
        notificationServices: [],
      },
    };
  }

  if (cleanUrl.startsWith('/projects/') && method === 'GET') {
    const id = cleanUrl.replace('/projects/', '');
    const proj = db.projects.find((p) => p.id === id) || db.projects[0];
    return { item: proj };
  }

  // 6. Boards
  if (cleanUrl.startsWith('/boards/') && method === 'GET') {
    const board = db.boards[0];
    return {
      item: {
        ...board,
        isSubscribed: true,
      },
      included: {
        projects: db.projects,
        boardMemberships: db.boardMemberships,
        labels: db.labels,
        lists: db.lists,
        cards: db.cards.map((c) => ({ ...c, isSubscribed: true })),
        cardMemberships: db.cardMemberships,
        cardLabels: db.cardLabels,
        taskLists: db.taskLists,
        tasks: db.tasks,
        attachments: [],
        customFieldGroups: db.customFieldGroups,
        customFields: db.customFields,
        customFieldValues: db.customFieldValues,
        automationRules: db.automationRules,
        cardMirrors: db.cardMirrors,
        cardDependencies: db.cardDependencies,
        users: [db.user],
      },
    };
  }

  // 7. Global Inbox
  if (cleanUrl === '/cards/inbox' && method === 'GET') {
    return { items: db.inboxCards || [] };
  }

  if (cleanUrl === '/cards/inbox' && method === 'POST') {
    const newInboxCard = {
      id: `inbox_${Date.now()}`,
      name: data?.name || 'Novo item na Caixa de Entrada',
      description: data?.description || '',
      isInbox: true,
      boardId: null,
      listId: null,
      position: (db.inboxCards?.length || 0) + 1000,
      createdAt: new Date().toISOString(),
    };
    db.inboxCards = [...(db.inboxCards || []), newInboxCard];
    saveDB(db);
    return { item: newInboxCard };
  }

  // 8. AI Endpoints (Atlassian Intelligence clone)
  if (cleanUrl.endsWith('/ai-summarize') && method === 'POST') {
    return {
      summary: `### 🤖 Resumo Executivo (Atlassian Intelligence 2026)
- **Status do Cartão:** Em andamento ativo com prioridade aprovada.
- **Principais Decisões:** Arquitetura validada com paridade total ao Trello Premium.
- **Próximos Passos:** Finalizar testes das automações do Butler e sincronização de dependências.
- **Bloqueios Identificados:** Nenhum impedimento crítico.`,
    };
  }

  if (cleanUrl.endsWith('/ai-extract-checklist') && method === 'POST') {
    return {
      actionItems: [
        'Configurar gatilho e condições no motor Butler',
        'Validar limite WIP e alertas na coluna correspondente',
        'Verificar renderização na Linha do Tempo / Gantt',
        'Testar sincronização de cartões espelhados',
      ],
    };
  }

  if (cleanUrl.endsWith('/ai-refine-description') && method === 'POST') {
    return {
      refinedDescription: `## 🎯 Objetivo & Contexto
Implementar e validar funcionalidades de paridade Trello Premium 2026.

## ✅ Critérios de Aceite
- [ ] Interface reativa sem latência
- [ ] Suporte a Multi-Views (Gantt, Calendário, Tabela, Dashboard)
- [ ] Validação estrita de usuário: apenas pablomesquitads@gmail.com

## 🛠️ Detalhes de Implementação
1. Sincronização de estado com Redux e persistência local
2. Prevenção de loop infinito no motor de regras (depth <= 3)`,
    };
  }

  if (cleanUrl === '/automation-rules/ai-build' && method === 'POST') {
    const prompt = data?.prompt || 'regra de exemplo';
    return {
      trigger_config: { type: 'card_moved', target_list: 'Concluído' },
      conditions_config: [],
      actions_config: [{ type: 'complete_all_tasks' }],
      summary: `Regra gerada via IA para "${prompt}": Quando um cartão for movido para a lista 'Concluído', marcar todas as tarefas como concluídas.`,
    };
  }

  // 9. Card updates & creation
  if (cleanUrl.startsWith('/lists/') && cleanUrl.endsWith('/cards') && method === 'POST') {
    const listId = cleanUrl.split('/')[2];
    const newCard = {
      id: `c_${Date.now()}`,
      boardId: '1',
      listId,
      creatorUserId: '1',
      type: 'card',
      position: db.cards.length * 1000 + 1000,
      name: data?.name || 'Novo Cartão',
      description: data?.description || '',
      dueDate: data?.dueDate || null,
      scheduledStartTime: data?.scheduledStartTime || null,
      scheduledEndTime: data?.scheduledEndTime || null,
      isDueCompleted: false,
      isClosed: false,
      createdAt: new Date().toISOString(),
    };
    db.cards.push(newCard);
    saveDB(db);
    return { item: newCard };
  }

  if (cleanUrl.startsWith('/cards/') && method === 'PATCH') {
    const id = cleanUrl.replace('/cards/', '');
    const cardIndex = db.cards.findIndex((c) => c.id === id);
    if (cardIndex !== -1) {
      db.cards[cardIndex] = { ...db.cards[cardIndex], ...data };
      saveDB(db);
      return { item: db.cards[cardIndex] };
    }
  }

  // 10. List updates & creation
  if (cleanUrl.startsWith('/boards/') && cleanUrl.endsWith('/lists') && method === 'POST') {
    const newList = {
      id: `l_${Date.now()}`,
      boardId: '1',
      type: 'active',
      name: data?.name || 'Nova Lista',
      position: db.lists.length * 1000 + 1000,
      wipLimit: data?.wipLimit || null,
      isCollapsed: false,
      color: data?.color || null,
    };
    db.lists.push(newList);
    saveDB(db);
    return { item: newList };
  }

  if (cleanUrl.startsWith('/lists/') && method === 'PATCH') {
    const id = cleanUrl.replace('/lists/', '');
    const listIndex = db.lists.findIndex((l) => l.id === id);
    if (listIndex !== -1) {
      db.lists[listIndex] = { ...db.lists[listIndex], ...data };
      saveDB(db);
      return { item: db.lists[listIndex] };
    }
  }

  // 11. Automation rules CRUD
  if (cleanUrl === '/automation-rules' && method === 'POST') {
    const newRule = {
      id: `ar_${Date.now()}`,
      boardId: data?.boardId || '1',
      name: data?.name || 'Nova Automação Butler',
      trigger_type: data?.trigger_type || 'card_moved',
      trigger_config: data?.trigger_config || {},
      conditions_config: data?.conditions_config || [],
      actions_config: data?.actions_config || [],
      is_active: true,
    };
    db.automationRules.push(newRule);
    saveDB(db);
    return { item: newRule };
  }

  if (cleanUrl.startsWith('/automation-rules/') && method === 'DELETE') {
    const id = cleanUrl.replace('/automation-rules/', '');
    db.automationRules = db.automationRules.filter((r) => r.id !== id);
    saveDB(db);
    return { item: { id } };
  }

  // Fallback default
  return { item: { id: `item_${Date.now()}`, ...data } };
};

