# Sistema de Gestão de Frotas - Interface Frontend

Esta é a interface de usuário (UI) para o Sistema de Gestão de Frotas, desenvolvida com Angular (v17+). É uma Single-Page Application (SPA) que consome a API de backend para fornecer uma experiência interativa e reativa para administradores e motoristas.

## Funcionalidades Principais

-   **Tela de Login:** Autenticação segura com a API backend usando tokens JWT.
-   **Roteamento Protegido:** Uso de Guardas de Rota (`AuthGuard`) para proteger páginas internas e garantir que apenas usuários autenticados e com o papel correto possam acessá-las.
-   **Dashboard de Administrador:** Painel de controle central para visualizar e gerenciar listas de veículos, motoristas, agendamentos e ocorrências.
-   **Formulários Interativos:** Formulários completos para criar e editar veículos e motoristas, com validação em tempo real e máscaras de campo (`ngx-mask`).
-   **Dashboard de Motorista:** Visão personalizada para o motorista, onde ele pode ver seus agendamentos e interagir com eles (iniciar/finalizar viagens).
-   **Integração com APIs:** Comunicação com a API de backend e com a API externa ViaCEP para autopreenchimento de endereço.
-   **Componentes Standalone:** Projeto estruturado com a arquitetura moderna de componentes standalone do Angular.

## Tecnologias Utilizadas

-   **Angular 17+**
-   **TypeScript**
-   **HTML5 / CSS3**
-   **ngx-mask** (para máscaras de formulário)
-   **Server-Side Rendering (SSR)** (configurado por padrão pelo Angular CLI)

## Como Iniciar a Aplicação

### Pré-requisitos

-   Node.js (versão LTS recomendada).
-   Angular CLI instalado globalmente (`npm install -g @angular/cli`).

### Executando

1.  Clone este repositório para sua máquina local.
2.  Abra um terminal na pasta raiz do projeto.
3.  Instale as dependências do projeto:
    ```bash
    npm install
    ```
4.  Execute o servidor de desenvolvimento:
    ```bash
    ng serve
    ```
5.  Abra seu navegador e acesse `http://localhost:4200`.

### Comunicação com o Backend

**Importante:** Para que a aplicação frontend funcione corretamente, o **backend (API) deve estar em execução** no endereço `http://localhost:8080`.
