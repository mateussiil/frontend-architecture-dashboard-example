# Frontend Architecture — Dashboard Example

Exemplo mínimo de uma arquitetura de frontend organizada **por domínio**, com camadas separadas
dentro de cada módulo. O app é um dashboard de vendas com widgets redimensionáveis — pequeno de
propósito, para que a estrutura apareça mais do que o produto.

## A ideia

Tratar o frontend com a mesma disciplina que normalmente aplicamos ao backend:

- **Módulos por domínio, não por página.** Cada módulo (`dashboard/`, `widget/`) é um bounded
  context. Páginas e URLs mudam; o domínio continua.
- **Camadas dentro de cada módulo** (organização vertical):
  - `domain/` — entidades e regras de negócio. Sem React, sem browser, sem HTTP.
  - `application/` — casos de uso. Coordenam o fluxo e dependem de interfaces (repositories).
  - `infrastructure/` — implementações concretas: HTTP, `localStorage`, mappers de DTO.
  - `ui/` — React. Apresenta dados, recebe eventos e chama casos de uso.
- **DI explícita, sem container.** Dependências entram pelo construtor e são montadas em um único
  ponto de composição (`src/app/composition.ts`).
- **O ponto de entrada coordena, o domínio decide e o componente apresenta.**

## Estrutura

```text
src/
├── app/composition.ts           # escolhe as implementações e cria os casos de uso
├── main.tsx
└── modules/
    ├── dashboard/
    │   ├── domain/              # Dashboard: nome, URL de compartilhamento
    │   ├── application/         # DashboardRepository, GetDashboardUseCase
    │   ├── infrastructure/      # Http / InMemory DashboardRepository
    │   ├── ui/                  # DashboardPage (ponto de entrada), DashboardHeader
    │   └── testing/             # FakeDashboardRepository, fixtures
    └── widget/
        ├── domain/              # Widget: tamanhos válidos por tipo, CSV, visualização
        ├── application/         # WidgetRepository, ListDashboardWidgets, ResizeWidget
        ├── infrastructure/      # Http / LocalStorage WidgetRepository, WidgetMapper
        ├── ui/                  # WidgetGrid, WidgetCard
        └── testing/             # FakeWidgetRepository, fixtures
```

A dependência entre módulos tem um sentido só: a tela do `dashboard` usa o `widget`; o `widget`
não conhece o `dashboard` (guarda apenas o `dashboardId`).

## Como funciona: redimensionar um widget

```text
WidgetCard            emite a intenção; o botão já vem desabilitado se widget.canResizeTo() for false
   ↓
DashboardPage         chama o caso de uso e atualiza o estado da tela
   ↓
ResizeWidgetUseCase   busca o widget, aplica a regra, persiste, devolve
   ↓
Widget                decide se o tamanho é válido para o seu tipo
   ↓
WidgetRepository      interface
   ↓
LocalStorage / HTTP   infraestrutura
```

O componente pergunta ao domínio em vez de conhecer a regra:

```tsx
<button disabled={!widget.canResizeTo(size)} onClick={() => onResize(size)}>
```

## Trocando a infraestrutura

Por padrão os dados ficam em memória e no `localStorage`, sem backend. Definindo `VITE_API_URL`,
o ponto de composição passa a usar os repositórios HTTP — nenhuma linha de domínio, aplicação ou
UI muda.

## Testes por camada

| Camada                      | Como é testada                                      |
| --------------------------- | --------------------------------------------------- |
| Domain                      | Vitest puro                                         |
| Application                 | Vitest + repositórios falsos                        |
| Infrastructure              | Vitest com `localStorage` do jsdom                  |
| Componentes                 | Vitest + Testing Library com dados falsos           |
| Ponto de entrada (página)   | casos de uso reais + repositórios falsos, sem HTTP  |
| Fluxo real                  | Playwright no browser                               |

## Rodando

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # Vitest
npm run test:e2e   # Playwright
```
