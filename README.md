# Exemplo de arquitetura de frontend

Aplicação mínima que exemplifica a proposta do artigo **"Uma proposta de arquitetura de frontend"**:
tratar o frontend com a mesma disciplina arquitetural que normalmente aplicamos ao backend.

É um dashboard com widgets que podem ser redimensionados. Pequeno de propósito, para que a
estrutura apareça mais do que o produto.

## Rodando

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # Vitest: domínio, casos de uso, infraestrutura e componentes
npm run test:e2e   # Playwright: fluxo real no browser
```

Por padrão os dados ficam no `localStorage` (não precisa de backend). Para usar uma API HTTP,
defina `VITE_API_URL` — nenhuma linha de domínio, aplicação ou UI muda, só o ponto de composição.

## Estrutura

```text
src/
├── app/
│   └── composition.ts            # ponto de composição: monta as dependências (DI sem container)
├── main.tsx                      # entrada do React
└── modules/
    └── dashboard/                # um módulo = um bounded context
        ├── domain/               # entidades e regras de negócio (sem React, sem HTTP)
        │   ├── Dashboard.ts
        │   └── Widget.ts
        ├── application/          # casos de uso + contratos que eles precisam
        │   ├── DashboardRepository.ts
        │   ├── GetDashboardUseCase.ts
        │   └── ResizeWidgetUseCase.ts
        ├── infrastructure/       # conversa com o mundo externo
        │   ├── DashboardMapper.ts
        │   ├── HttpDashboardRepository.ts
        │   └── LocalStorageDashboardRepository.ts
        ├── ui/                   # React: apresentação e interação
        │   ├── DashboardPage.tsx # ponto de entrada da tela
        │   ├── DashboardView.tsx # componente de apresentação
        │   └── WidgetCard.tsx
        └── testing/              # FakeDashboardRepository e fixtures
```

## Onde cada coisa mora

| Pergunta                                      | Onde olhar                              |
| --------------------------------------------- | --------------------------------------- |
| Quais tamanhos um widget KPI pode ter?        | `domain/Widget.ts`                      |
| Como é a URL de compartilhamento?             | `domain/Dashboard.ts`                   |
| O que acontece quando redimensiono um widget? | `application/ResizeWidgetUseCase.ts`    |
| Como o dashboard é salvo?                     | `infrastructure/*Repository.ts`         |
| Como a tela começa?                           | `ui/DashboardPage.tsx`                  |
| Como um widget aparece?                       | `ui/WidgetCard.tsx`                     |
| Qual implementação está sendo usada?          | `app/composition.ts`                    |

## Um fluxo completo: redimensionar um widget

```text
Usuário clica em "Mais largo"
   ↓
WidgetCard            → só emite a intenção; o botão já vem desabilitado se o domínio não permitir
   ↓
DashboardPage         → chama o caso de uso e atualiza o estado
   ↓
ResizeWidgetUseCase   → busca, aplica a regra, persiste, devolve
   ↓
Dashboard / Widget    → decidem se o tamanho é válido
   ↓
DashboardRepository   → abstração
   ↓
LocalStorage / HTTP   → infraestrutura
```

O componente pergunta ao domínio em vez de conhecer a regra:

```tsx
<button disabled={!widget.canResizeTo(size)} onClick={() => onResize(size)}>
```

em vez de

```tsx
<button disabled={widget.type === 'kpi' && size.rows > 1}>
```

## Testes por camada

| Camada         | Ferramenta                       | Precisa de browser/HTTP? |
| -------------- | -------------------------------- | ------------------------ |
| Domain         | Vitest                           | Não                      |
| Application    | Vitest + `FakeDashboardRepository` | Não                    |
| Infrastructure | Vitest (jsdom `localStorage`)    | Não                      |
| UI             | Vitest + Testing Library com dados falsos | Não             |
| Fluxo real     | Playwright                       | Sim                      |
