# Uma proposta de arquitetura de frontend

> Este repositório é um exemplo mínimo da proposta descrita abaixo: um dashboard com widgets
> redimensionáveis, organizado por domínio. Depois do texto há um [guia de como o código
> aplica cada ideia](#este-repositório).

O primeiro ponto de partida de todo desenvolvedor costuma ser o frontend.

A primeira coisa que a gente aprende é HTML e CSS. Depois vem JavaScript, algum framework, componentes, estado, chamadas para API e, quando percebe, estamos construindo aplicações enormes dentro do navegador.

Passei muitos anos trabalhando com frontend. Trabalhei com PHP, jQuery, JavaScript, React e vi bastante coisa.

Sempre gostei muito de frontend e, principalmente, de design. Não sou muito bom nesse último hehehe.

Mas depois de alguns anos comecei a ficar incomodado com uma coisa: **a facilidade com que o frontend vira um lugar sem padrão.**

Componentes começam a buscar dados diretamente.

Regras de negócio aparecem dentro de `onClick`.

Uma função começa a formatar uma informação, fazer uma chamada HTTP, alterar estado e decidir como renderizar alguma coisa.

Depois de algum tempo, ninguém sabe mais exatamente onde uma regra deveria estar.

Foi aí que comecei a me afastar um pouco do frontend e me voltar para backend e arquitetura.

Comecei a estudar DDD, TDD, DI, SOLID, arquitetura em camadas, separação de responsabilidades e outros conceitos que normalmente associamos ao backend.

E depois de entender melhor essas ideias, comecei a olhar para o frontend de outra maneira.

Talvez o problema não seja que frontend seja desorganizado por natureza.

Talvez a gente simplesmente tenha aceitado durante muito tempo que **frontend é apenas uma camada de apresentação**.

Só que aplicações frontend modernas deixaram de ser isso há bastante tempo.

Elas possuem regras de negócio, estado, persistência, integração com APIs, autenticação, autorização, cache, workflows, validações e cada vez mais inteligência.

Então por que não tratá-las como software de verdade?

Recentemente, desenvolvendo uma aplicação do zero, tive a oportunidade de experimentar isso.

O padrão ainda está sendo testado e validado, mas consegui chegar em uma arquitetura que gostei bastante.

A ideia principal é simples:

> **Tratar o frontend com a mesma disciplina arquitetural que normalmente aplicamos ao backend.**

Não quero transformar React em Java.

Quero separar responsabilidades.

## Modularizar por domínio

A primeira decisão foi parar de pensar no frontend como um conjunto de páginas.

Em vez disso, comecei pelo domínio do produto.

No meu projeto de dashboard, por exemplo, existem:

```text
conversation/
dashboard/
widget/
semantic-model/
workspace/
sharing/
authentication/
shared/
```

Cada um desses módulos representa uma parte do negócio.

São os meus bounded contexts.

A primeira dúvida que pode surgir é:

"Por que não separar por página?"

Porque página é uma consequência da interface.

Domínio é uma consequência do negócio.

Uma página pode mudar.

Hoje posso ter:

`/dashboard`

Amanhã:

`/workspaces/:id/dashboard`

Ou posso colocar dashboard, conversa e widgets na mesma tela.

O domínio continua existindo.

Por isso prefiro que a estrutura do código acompanhe o **modelo mental do produto**, e não a estrutura atual das URLs.

## Estrutura vertical

Dentro de cada módulo, mantenho as responsabilidades separadas:

```text
dashboard/
├── domain/
├── application/
├── infrastructure/
└── ui/
```

Isso é diferente de criar:

```text
src/
├── domain/
├── application/
├── infrastructure/
└── ui/
```

para toda a aplicação.

Prefiro a organização vertical porque, quando estou trabalhando em uma funcionalidade de dashboard, consigo encontrar praticamente tudo relacionado àquele contexto dentro de `dashboard/`.

O módulo vira uma unidade de evolução.

## Domain

O `domain` é onde ficam as entidades e as regras que pertencem ao negócio.

Não quero que meu domínio saiba que estou usando React.

Não quero que ele saiba que existe um browser.

Não quero que ele saiba como uma API funciona.

E principalmente, não quero JSX dentro dele.

Por exemplo, um `Widget` pode saber que determinado tipo de visualização possui determinadas regras.

Um `Dashboard` pode saber como construir sua URL de compartilhamento.

Um `QueryResult` pode saber como interpretar um resultado de KPI.

Uma entidade `SemanticModel` pode saber validar suas próprias regras.

A ideia é:

> **a regra pertence ao objeto que possui o conhecimento necessário para tomar aquela decisão.**

Isso também muda a responsabilidade dos componentes.

Em vez de:

```typescript
if (widget.type === 'KPI') {
  // um monte de regra
}
```

o componente pode simplesmente perguntar:

```typescript
widget.title()
widget.csvFileName()
widget.visualization()
```

O React deixa de ser responsável por conhecer o negócio.

## Application

Se o domínio contém as regras, a camada `application` contém os **casos de uso**.

É onde descrevo o que o sistema faz.

Por exemplo:

```text
CreateDashboard
ComposeDashboard
ResizeWidget
MoveWidget
GetDashboard
ShareDashboard
GroupConversations
```

Um caso de uso coordena as coisas.

Ele pode:

1. buscar dados através de um repository;
2. executar regras do domínio;
3. combinar entidades;
4. persistir alguma alteração;
5. devolver o resultado para a UI.

Por exemplo:

```text
ComposeDashboardUseCase
        ↓
buscar Dashboard
        ↓
buscar plano da conversa
        ↓
resolver análises
        ↓
executar queries
        ↓
criar Widgets
        ↓
posicionar Widgets
        ↓
retornar Dashboard
```

O caso de uso conhece o fluxo.

As entidades conhecem as regras.

E a UI não precisa conhecer nenhum dos dois detalhes.

## Infrastructure

A infraestrutura é a parte que conversa com o mundo externo.

HTTP.
GraphQL.
gRPC.
LocalStorage.
Cookies.
APIs externas.
Banco local.

Qualquer tecnologia que possa ser trocada sem alterar a regra de negócio.

Por exemplo:

```text
infrastructure/
├── http/
├── repositories/
└── clients/
```

Eu gosto de colocar uma abstração entre o caso de uso e a tecnologia.

Por exemplo:

```typescript
interface DashboardRepository {
  get(id: string): Promise<Dashboard>
  save(dashboard: Dashboard): Promise<void>
}
```

O `application` conhece `DashboardRepository`.

Ele não conhece `fetch`.

Ele não conhece Axios.

Ele não conhece `/api/v1/dashboards`.

Quem sabe como buscar o dashboard é a infraestrutura.

Isso também facilita testes.

No teste posso simplesmente passar:

```typescript
FakeDashboardRepository
```

e executar o caso de uso sem browser, sem HTTP e sem backend.

Isso me leva para outra decisão: DI.

Não usei um container de dependências.

Não precisei de decorators.

Não precisei de reflection.

As dependências são recebidas explicitamente.

Por exemplo:

```typescript
const composeDashboard = new ComposeDashboardUseCase(
  dashboardRepository,
  widgetRepository,
  queryRepository
)
```

E existe um ponto de composição da aplicação que monta essas dependências.

A vantagem é simples:

**olhando para o construtor eu sei do que aquele caso de uso depende.**

E, novamente, nos testes posso substituir qualquer implementação.

Não estou dizendo que containers são ruins.

Nesse projeto, simplesmente não achei que precisava deles.

## UI

Aqui entra o React.

Mas React não é a aplicação inteira.

React é a camada responsável pela apresentação e interação.

A UI:

- recebe eventos;
- chama casos de uso;
- apresenta dados;
- controla estado visual;
- reage às mudanças.

Ela não deveria saber como uma query funciona.

Não deveria saber como um token é renovado.

Não deveria saber como montar uma URL de API.

E não deveria carregar regras de negócio complexas dentro de componentes.

A ideia é fazer o componente voltar a ser relativamente "burro".

Algo próximo de:

```text
evento do usuário
      ↓
UI
      ↓
Use Case
      ↓
Domain
      ↓
Repository
      ↓
Infrastructure
```

## Ponto de entrada da aplicação

Outra decisão que gosto bastante é ter um ponto de entrada para cada tela.

Esse ponto de entrada é responsável por iniciar o fluxo da aplicação.

Ele recebe os parâmetros necessários, chama os casos de uso e, depois que os dados estão preparados, entrega para o componente de apresentação exatamente o que ele precisa.

Por exemplo:

```tsx
export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null)

  useEffect(() => {
    getDashboard().then(setDashboard)
  }, [])

  if (!dashboard) {
    return <Loading />
  }

  return (
    <DashboardPageComponent
      dashboard={dashboard}
    />
  )
}
```

O importante aqui não é o número de linhas desse componente.

É a responsabilidade dele.

Ele não precisa saber como o dashboard é buscado, como os dados são transformados ou quais regras precisam ser aplicadas.

Ele apenas coordena o fluxo:

```text
Ponto de entrada
      ↓
  Use Case
      ↓
   Domain
      ↓
 Repository
      ↓
    Dados
      ↓
Componente de apresentação
```

Isso cria uma separação que considero importante:

**o ponto de entrada coordena, o domínio decide e o componente apresenta.**

## O componente recebe o que precisa

Também gosto da ideia de o componente receber apenas aquilo que precisa para funcionar.

Se o componente precisa de um `Dashboard`, ele recebe um `Dashboard`.

Se precisa de uma lista de `Widget`, recebe uma lista de `Widget`.

Se precisa executar uma ação, recebe a operação necessária.

Ele não precisa conhecer o repository, o cliente HTTP ou qualquer outra dependência da aplicação.

Por exemplo:

```tsx
<DashboardPageComponent
  dashboard={dashboard}
  widgets={widgets}
  onResizeWidget={resizeWidget}
/>
```

Em vez de entregar para o componente toda a aplicação:

```tsx
<DashboardPageComponent
  api={api}
  repositories={repositories}
  services={services}
  config={config}
/>
```

A ideia é reduzir o conhecimento necessário para renderizar uma tela.

O componente não precisa saber **de onde veio a informação**.

Ele precisa saber apenas **qual informação recebeu e como apresentá-la**.

## Por que gosto desse modelo?

Porque ele cria uma fronteira muito clara.

Quando preciso entender como uma tela começa, olho para o ponto de entrada.

Quando preciso entender uma regra de negócio, vou para o domínio.

Quando preciso entender o fluxo de uma operação, vou para o caso de uso.

Quando preciso entender uma integração, vou para a infraestrutura.

Quando preciso entender como algo aparece para o usuário, vou para a UI.

Cada coisa tem um lugar.

## Testabilidade como consequência da arquitetura

E isso também significa que posso testar essas partes separadamente.

Posso testar o caso de uso sem renderizar uma tela.

Posso testar o domínio sem HTTP.

E posso testar o componente de apresentação usando dados falsos, sem precisar subir toda a aplicação.

Posso testar:

```text
Domain
    ↓
Vitest
```

Posso testar:

```text
Use Case
    ↓
Fake Repository
    ↓
Vitest
```

E deixo o Playwright para testar aquilo que realmente precisa de browser:

```text
Browser
    ↓
API
    ↓
Fluxo real
```

Ou seja:

**não tento usar um único tipo de teste para tudo.**

Cada camada possui um tipo de teste adequado.

## Um fluxo completo

Talvez a melhor forma de entender toda essa arquitetura seja acompanhar uma ação.

Imagine que o usuário redimensiona um widget.

```text
Usuário
   ↓
React / UI
   ↓
ResizeWidgetUseCase
   ↓
Widget
   ↓
Dashboard
   ↓
DashboardRepository
   ↓
HTTP
   ↓
API
```

Cada parte possui uma responsabilidade.

A UI sabe que o usuário arrastou alguma coisa.

O Use Case sabe que existe uma operação de redimensionamento.

O domínio sabe quais tamanhos são válidos.

O Repository sabe como persistir.

A infraestrutura sabe como fazer HTTP.

E nenhuma dessas responsabilidades precisa estar dentro de um único componente React.

## Ainda estou validando

Não considero isso uma arquitetura definitiva.

Ela ainda está sendo usada, testada e modificada.

Inclusive, algumas decisões provavelmente vão mudar.

O objetivo não é construir uma arquitetura bonita no papel.

É descobrir se essa separação realmente torna o frontend:

- mais fácil de testar;
- mais fácil de entender;
- mais fácil de modificar;
- menos acoplado ao React;
- menos dependente de infraestrutura;
- mais previsível conforme cresce.

No final, acho que essa é a parte mais interessante.

Durante muito tempo eu pensei que arquitetura era principalmente uma preocupação de backend.

Hoje eu penso diferente.

**Frontend também é software.**

E quanto mais complexo o produto fica, menos faz sentido tratá-lo apenas como uma camada visual.

Talvez a pergunta não seja:

> "Qual framework devo usar no frontend?"

Mas:

> **"Como quero que esse software continue sendo compreensível daqui a dois anos?"**

---

# Este repositório

Aplicação mínima que exemplifica a proposta acima: um dashboard de vendas com widgets
redimensionáveis. Pequeno de propósito, para que a estrutura apareça mais do que o produto.
Tem um único módulo (`dashboard/`), mas cada camada descrita no texto está presente.

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
