# ADR-001: Gerenciamento de Estado com Zustand

## Status
Aceito

## Contexto
O projeto FinTrack Mobile precisa de uma solução de gerenciamento de estado para:
- Armazenar lista de metas financeiras
- Gerenciar estados de loading/erro
- Coordenar operações CRUD com persistência
- Permitir acesso global ao estado

Alternativas consideradas:
1. **Redux Toolkit**: Muito popular, mas verboso para um MVP
2. **Context API**: Nativo, mas problems de performance para atualizações frequentes
3. **Zustand**: Leve, simples, hooks-based
4. **MobX**: Powerfull, mas curva de aprendizado maior

## Decisão
Escolhemos **Zustand**.

## Justificativa
- **Tamanho mínimo**: ~1KB gzipped
- **Sem boilerplate**: Não precisa de actions, reducers, dispatchers
- **TypeScript-first**: Tipagem excelente out-of-the-box
- **Performance**: Padrão de atualização por seleção, evita re-renders
- **DevTools**: Suporte a Redux DevTools se necessário
- **Simplicidade**: Curva de aprendizado baixa

## Consequências

### Positivas
- Código mais limpo e menos verboso
- Facilita onboarding de novos devs
- Atualizações granulares evitam re-renders desnecessários
- Integração nativa com hooks

### Negativas
- Menor ecosistema que Redux
-_time-travel debugging não tão robusto

### Riscos
- Mitigados: Padrão bem documentado e estabelecido
