# ADR-003: Sistema de Feature Flags

## Status
Aceito

## Contexto
O time de produto precisa:
- Rodar experimentos controlados
- Ativar/desativar funcionalidades sem deploy
- Preparar para futura integração com serviço remoto de feature flags

Requisito específico do MVP:
> Feature flag `show_milestone_celebration` controla card motivacional aos 50%

## Decisão
Sistema de feature flags com:
- **Interface genérica** (`FeatureFlagsProvider`)
- **Provider local** (`LocalFeatureFlagsProvider`) usando JSON
- **Service** que registra avaliações no analytics

```typescript
interface FeatureFlagsProvider {
  isEnabled(flagName: FeatureFlagName): boolean;
  getFlag(flagName: FeatureFlagName): FeatureFlag | undefined;
  getAllFlags(): FeatureFlag[];
}
```

### Configuração via JSON
```json
{
  "flags": [
    {
      "name": "show_milestone_celebration",
      "enabled": true,
      "description": "Card motivacional aos 50%"
    }
  ],
  "version": "1.0.0"
}
```

## Justificativa

### Provider Strategy
- Permite trocar para serviço remoto (LaunchDarkly, Firebase, etc.)
- Não muda código de negócio
- Testes podem injetar provider mock

### JSON Local
- Simples para MVP
- Configurável sem rebuild
- Versionável

### Analytics Integration
- Rastreamento de quais flags foram avaliadas
- Útil para debugging e análise

## Uso

```typescript
import { featureFlagsService } from './infrastructure/feature-flags';

if (featureFlagsService.isEnabled('show_milestone_celebration')) {
  // Mostrar card
}
```

## Futura Integração Remota

```typescript
class LaunchDarklyProvider implements FeatureFlagsProvider {
  async isEnabled(flagName: FeatureFlagName): Promise<boolean> {
    return await ldClient.variation(flagName, false);
  }
}

featureFlagsService.setProvider(new LaunchDarklyProvider());
```

## Consequências

### Positivas
- Configuração externa ao código
- Preparado para feature flags remotas
- Analytics integrado automaticamente
- Testes podem controlar flags facilmente

### Negativas
- JSON local não suporta segmentação de usuários
- Não há atualização em tempo real

### Riscos
- Mitigados: Interface preparada para providers remotos

## Alternativas Consideradas

1. **Variáveis de ambiente**: Não permitem troca sem rebuild
2. **Remote Config (Firebase)**: Overkill para MVP, requer setup
3. **LaunchDarkly**: Custo, complexidade desnecessária para primeira versão

## Próximos Passos
- [ ] Dashboard admin para gerenciar flags
- [ ] Integração com serviço remoto
- [ ] Segmentação por usuário/cohort
