# ADR-002: Arquitetura em Camadas

## Status
Aceito

## Contexto
O FinTrack Mobile é um MVP que servirá como base para um time escalar. O código precisa:
- Separar responsabilidades claramente
- Permitir testes isolados de cada parte
- Facilitar troca de implementações (ex: persistência, analytics)
- Servir como referência para futuros desenvolvedores

## Decisão
Adotamos arquitetura em 4 camadas:

```
┌─────────────────────────────────────────┐
│           UI Layer (app/)               │
│  Screens, Components, Navigation        │
├─────────────────────────────────────────┤
│         State Layer (state/)            │
│  Zustand stores, State management       │
├─────────────────────────────────────────┤
│        Domain Layer (domain/)           │
│  Business logic, Calculations, Models   │
├─────────────────────────────────────────┤
│    Infrastructure/Data Layer            │
│  Repositories, Storage, Analytics       │
└─────────────────────────────────────────┘
```

### Camadas

**UI Layer (`app/`, `components/`)**
- Telas e componentes visuais
- Consome estado via hooks
- Sem lógica de negócio

**State Layer (`state/`)**
- Zustand store
- Coordena operações entre UI e Data
- Gerencia estados de loading/erro

**Domain Layer (`domain/`)**
- Lógica de negócio PURA
- Zero dependências externas
- Fácil de testar isoladamente
- Funções puras de cálculo

**Infrastructure/Data Layer (`data/`, `infrastructure/`)**
- Persistência (AsyncStorage)
- Repositórios (padrão Repository)
- Analytics e Feature Flags

## Justificativa
- **Testabilidade**: Cada camada pode ser testada isoladamente
- **Substituibilidade**: Trocar AsyncStorage por SQLite = mudar apenas Repository
- **Clareza**: Nova feature = adicionar em cada camada
- **Clean Architecture**: Regras de negócio independentes de framework

## Dependências
- UI → State
- State → Domain + Data
- Domain → Nenhuma (pura)
- Data → Domain (interfaces)
- Infrastructure → Domain (interfaces)

## Consequências

### Positivas
- Código organizado e previsível
- Testes de UI mocks apenas de State
- Testes de Domain sem dependências
- Nova persistência = novo Repository

### Negativas
- Mais arquivos iniciais
- Curva de aprendizado para devs acostumados com "tudo em um lugar"

### Riscos
- Mitigados: Documentação clara de estrutura

## Exemplos de Uso

```typescript
// UI consome estado
const { goals, fetchGoals } = useGoalsStore();

// State chama Domain e Data
const progress = calculateGoalWithProgress(goal);
const saved = await goalRepository.create(data);

// Domain é função pura
export function calculateProgress(goal: Goal): number {
  return (goal.current / goal.target) * 100;
}
```
