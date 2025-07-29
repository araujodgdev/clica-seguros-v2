
# Guia Técnico do Sistema de Simulação de Seguro Automotivo

Este documento fornece uma visão geral técnica do sistema de simulação de seguro de automóveis, detalhando a arquitetura, o fluxo de dados, os componentes e as principais funcionalidades.

## Arquitetura e Fluxo de Dados

O sistema de simulação é construído como um fluxo de várias etapas, guiando o usuário desde a entrada de dados iniciais até a apresentação das cotações de seguro. O fluxo é orquestrado pelo componente `SimulationForm`, que gerencia o estado e a transição entre as etapas.

O fluxo de dados pode ser resumido da seguinte forma:

1.  **Coleta de Dados Iniciais**: O usuário insere seu nome, e-mail e placa do veículo no `InitialForm`.
2.  **Validação e Envio**: Os dados são validados em tempo real e, após o envio, são passados para o `SimulationForm`.
3.  **Busca de Detalhes do Veículo**: O `SimulationForm` utiliza o `getCarDetailsByPlate` para obter os detalhes do veículo (marca, modelo, ano, etc.) com base na placa fornecida.
4.  **Confirmação do Usuário**: Os detalhes do veículo são exibidos no componente `CarDetailsConfirmation` para que o usuário os verifique.
5.  **Geração de Cotações**: Após a confirmação, o sistema exibe um `LoadingState` enquanto as cotações são geradas.
6.  **Redirecionamento para Resultados**: Uma vez que as cotações são geradas, o usuário é redirecionado para a página de cotações com os dados da simulação passados como parâmetros de URL.

## Componentes Principais

O sistema de simulação é composto pelos seguintes componentes principais:

### `SimulationForm`

-   **Responsabilidade**: Orquestrar todo o fluxo de simulação, gerenciando o estado, a transição entre as etapas e o tratamento de erros.
-   **Estado Gerenciado**:
    -   `currentStep`: A etapa atual no fluxo de simulação (`INITIAL_FORM`, `CAR_DETAILS_CONFIRMATION`, `LOADING`).
    -   `formData`: Os dados inseridos pelo usuário no formulário inicial.
    -   `carDetails`: Os detalhes do veículo obtidos a partir da placa.
    -   `isLoading`: Um booleano que indica se uma operação assíncrona está em andamento.
    -   `error`: Uma mensagem de erro, caso ocorra algum problema.
-   **Lógica de Transição**:
    -   `handleInitialFormSubmit`: Chamado quando o formulário inicial é enviado. Ele busca os detalhes do veículo e avança para a etapa de confirmação.
    -   `handleCarDetailsConfirm`: Avança para a etapa de carregamento após o usuário confirmar os detalhes do veículo.
    -   `handleEditRequest`: Retorna à etapa do formulário inicial, permitindo que o usuário edite suas informações.
    -   `handleLoadingComplete`: Chamado após a conclusão do carregamento. Ele constrói a URL dos resultados da cotação e redireciona o usuário.

### `InitialForm`

-   **Responsabilidade**: Coletar e validar os dados iniciais do usuário (nome, e-mail e placa do veículo).
-   **Validação**:
    -   Utiliza as funções de `form-validation.ts` para validar os campos em tempo real.
    -   Fornece feedback visual imediato para o usuário (ícones de sucesso/erro e mensagens).
    -   O botão de envio permanece desabilitado até que todos os campos sejam preenchidos corretamente.
-   **Usabilidade**:
    -   Oferece uma experiência de usuário aprimorada com sanitização de entrada, formatação automática da placa e navegação por teclado.

### `CarDetailsConfirmation`

-   **Responsabilidade**: Exibir os detalhes do veículo recuperados e solicitar a confirmação do usuário.
-   **Funcionalidades**:
    -   Apresenta os detalhes do veículo de forma clara e organizada.
    -   Fornece botões para o usuário confirmar os detalhes ou voltar para editá-los.
    -   Inclui informações contextuais, como a fonte dos dados (FIPE).

### `LoadingState`

-   **Responsabilidade**: Fornecer feedback visual durante as operações assíncronas (por exemplo, geração de cotações).
-   **Funcionalidades**:
    -   Exibe uma barra de progresso animada.
    -   Mostra mensagens dinâmicas que mudam ao longo do tempo para manter o usuário engajado.
    -   Chama uma função de `onComplete` quando o processo de carregamento termina.

### `ErrorRecovery`

-   **Responsabilidade**: Lidar com erros que podem ocorrer durante o fluxo de simulação.
-   **Funcionalidades**:
    -   Exibe uma mensagem de erro amigável para o usuário.
    -   Oferece opções para tentar novamente a operação ou reiniciar o fluxo de simulação.
    -   Fornece sugestões sobre como o usuário pode resolver o problema.

## Serviços de Suporte

O sistema de simulação depende dos seguintes serviços:

### `mock-data.ts`

-   **Responsabilidade**: Simular a comunicação com um backend, fornecendo dados fictícios para os detalhes do veículo e ofertas de seguro.
-   **Funções Principais**:
    -   `getCarDetailsByPlate`: Retorna os detalhes de um veículo com base em uma placa.
    -   `getInsuranceOffers`: Gera uma lista de ofertas de seguro com base nos detalhes do veículo.
-   **Simulação de Erro**:
    -   Este serviço também simula vários cenários de erro (erros de rede, placas inválidas, etc.) para garantir que o tratamento de erros seja robusto.

### `navigation.ts`

-   **Responsabilidade**: Gerenciar a navegação e o manuseio de parâmetros de URL.
-   **Funções Principais**:
    -   `createQuoteResultsUrl`: Cria a URL para a página de resultados da cotação, codificando os dados da simulação como parâmetros de consulta.
    -   `validateQuoteResultsParams`: Valida os parâmetros da URL na página de resultados para garantir a integridade dos dados.

### `form-validation.ts`

-   **Responsabilidade**: Fornecer funções para validar e sanitizar os dados do formulário.
-   **Funções Principais**:
    -   `validateName`, `validateEmail`, `validateLicensePlate`: Funções de validação individuais para cada campo.
    -   `sanitizeString`, `sanitizeLicensePlate`: Funções para limpar e formatar a entrada do usuário.
    -   `formatLicensePlateForDisplay`: Formata a placa do veículo para exibição.

## Testes

O sistema de simulação é coberto por um conjunto abrangente de testes, incluindo:

-   **Testes de Unidade**: Para funções de validação e serviços.
-   **Testes de Integração**: Para garantir que os componentes interajam corretamente.
-   **Testes de Acessibilidade**: Para garantir a conformidade com as diretrizes de acessibilidade.
-   **Testes de Desempenho**: Para monitorar e otimizar os tempos de carregamento e renderização.
-   **Testes E2E (End-to-End)**: Para simular a jornada completa do usuário e garantir que todo o fluxo funcione como esperado.

Este guia fornece uma base sólida para entender a arquitetura e o funcionamento do sistema de simulação. Para obter mais detalhes sobre a implementação de cada componente ou serviço, consulte o código-fonte correspondente.
