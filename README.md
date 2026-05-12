# FinTrack Mobile

Sistema de Acompanhamento de Metas Financeiras com Experimentação.

Um aplicativo mobile para ajudar usuários a definirem e acompanharem metas financeiras pessoais, com suporte a feature flags e analytics.

## Setup

```bash
npm install
npm start
```

Para rodar em plataforma específica:
```bash
npm run ios     # iOS
npm run android # Android
npm run web     # Web
```

## Funcionalidades

- **RF01**: Criar metas financeiras com nome, valor-alvo, prazo e categoria
- **RF02**: Registrar aportes (depósitos) em metas existentes
- **RF03**: Visualizar lista de metas com indicador visual de progresso
- **RF04**: Visualizar detalhes de uma meta com histórico e projeção
- **RF05**: Excluir metas com confirmação
- **RF06**: Sistema de feature flags para funcionalidade experimental (card motivacional aos 50%)
- **RF07**: Instrumentação de analytics em memória

## Decisões Arquiteturais (ADRs)

### ADR-001: Gerenciamento de Estado com Zustand

**Status**: Aceito

**Contexto**: Precisávamos escolher uma solução de gerenciamento de estado que fosse simples, performática e adequada para um MVP.

**Decisão**: Escolhemos Zustand pela simplicidade, TypeScript-friendly, sem boilerplate, e tamanho reduzido do bundle.

**Consequências**:
- ✅ Menos boilerplate que Redux
- ✅ Mais simples que Context API para estado global
- ✅ Excelente integração com TypeScript
- ✅ Devtools disponíveis

### ADR-002: Arquitetura em Camadas

**Status**: Aceito

**Contexto**: O código precisa ser extensível e servir como base para um time crescer.

**Decisão**: Arquitetura com separação clara de camadas:
- **UI (app/)**: Telas e componentes visuais
- **Domain (domain/)**: Lógica de negócio pura, sem dependências externas
- **Data (data/)**: Persistência e repositórios
- **Infrastructure (infrastructure/)**: Módulos transversais (analytics, feature flags)

**Consequências**:
- ✅ Testabilidade isolada de cada camada
- ✅ Facilita troca de implementações (ex: trocar AsyncStorage por outra persistência)
- ✅ Regras de negócio independentes de framework

### ADR-003: Feature Flags Desacopladas

**Status**: Aceito

**Contexto**: Precisamos controlar funcionalidades experimentais com possibilidade de integração futura com serviço remoto.

**Decisão**: Sistema de feature flags baseado em interface com provider local (JSON configurável), preparado para providers remotos.

**Consequências**:
- ✅ Configuração via arquivo JSON local
- ✅ Interface que permite futura integração com LaunchDarkly, Firebase, etc.
- ✅ Avaliação de flags registrada no analytics

### ADR-004: Provider Strategy para Analytics

**Status**: Aceito

**Contexto**: Precisamos instrumentar eventos mas não podemos depender de um provider específico.

**Decisão**: Padrão Strategy com interface genérica `track(event, properties)`. Implementação atual é console/memória, facilmente substituível.

**Consequências**:
- ✅ Troca de provider SEM mudar código de negócio
- ✅ Testes podem verificar eventos sem backend
- ✅ Preparado para Mixpanel, Amplitude, etc.

## Trade-offs Considerados

1. **AsyncStorage vs Realm/SQLite**: AsyncStorage é mais simples mas limitado. Para volumes maiores de dados, Realm seria melhor.

2. **Navegação nativa vs expo-router**: Usamos react-navigation nativa. Expo Router seria mais moderno mas introduz mais complexidade inicial.

3. **Zustand vs Redux Toolkit**: Zustand ganhou pela simplicidade. Redux Toolkit seria melhor para apps muito complexos com middleware elaborado.

## Melhorias com Mais Tempo

1. **Testes E2E**: Detox ou Maestro para testes de integração completa
2. **CI/CD**: GitHub Actions para lint, testes e build
3. **Forms**: React Hook Form + Zod para validação robusta
4. ** Internacionalização**: i18n para múltiplos idiomas
5. **Gestão de datas**: Date picker nativo ao invés de input manual
6. **Offline-first**: Sincronização quando online para persistência remota
7. **Gráficos**: Charts para visualização do progresso ao longo do tempo
8. **Notificações**: Push notifications para lembretes de metas

## Estrutura do Projeto

```
src/
├── app/                    # Telas/Pages
│   ├── GoalListScreen.tsx
│   ├── GoalDetailScreen.tsx
│   └── CreateGoalScreen.tsx
├── components/             # Componentes reutilizáveis de UI
│   ├── ProgressBar.tsx
│   ├── EmptyState.tsx
│   ├── LoadingIndicator.tsx
│   └── MilestoneCelebration.tsx
├── domain/                 # Lógica de negócio pura
│   ├── models/             # Tipos e interfaces
│   ├── calculations.ts     # Cálculos financeiros
│   └── services/           # Serviços de domínio
├── data/                   # Persistência e repositórios
│   ├── repositories/       # Padrão Repository
│   └── storage/            # AsyncStorage wrapper
├── infrastructure/         # Módulos transversais
│   ├── analytics/          # Sistema de analytics
│   └── feature-flags/      # Sistema de feature flags
├── state/                  # Zustand store
└── navigation/             # React Navigation config
```

## Licença

MIT
