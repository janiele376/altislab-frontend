# Sistema de Gerenciamento de Biblioteca

Sistema web voltado para a gestão e locação de livros, contendo interfaces específicas para Administrador e Locatário.

## Tecnologias Utilizadas no Frontend

* **HTML5:** Estruturação semântica das telas, formulários e tabelas.
* **CSS3:** Estilização visual, definição de layouts, temas claro e escuro e alinhamentos de interface.
* **JavaScript (Vanilla / ES6+):** Controle dinâmico das páginas, máscaras de campos, alternância de idiomas e controle de carrossel.
* **Web Storage API (`localStorage`):** Mecanismo de persistência local no navegador utilizado para armazenar os dados de usuários, temas selecionados e preferências de idioma.

## Descrição das Pastas

* **imgs/:** Contém todos os recursos visuais da aplicação, como ícones de navegação (livros, ajustes, setas) e fotos de perfil em formato SVG e JPG.
* **js/:** Contém os arquivos de lógica do sistema. Na raiz ficam os scripts gerais (como autenticação e máscaras de entrada) e, dentro das subpastas `admin/` e `tenant/`, ficam os scripts específicos de cada perfil de usuário.
* **pages/:** Armazena todas as páginas HTML do projeto. As telas de acesso comum (login, registro e recuperação de senha) ficam na raiz da pasta, enquanto os painéis e formulários restritos são divididos entre `admin/` e `tenant/`.
* **style/:** Reúne todos os arquivos de estilização CSS, organizados de forma espelhada à pasta de páginas para manter a correspondência visual de cada tela.

## Estrutura do Projeto

altislab-frontend/
├── README.md
├── index.html
├──src/
    ├── imgs/
    │   ├── book.svg
    │   ├── user.svg
    │   ├── key.svg
    │   ├── mail.svg
    │   ├── telephone.svg
    │   ├── calendar.svg
    │   ├── cpf.svg
    │   ├── location.svg
    │   ├── adjustments.svg
    │   ├── logout.svg
    │   └── back-arrow.svg
    │
    ├── js/
    │   ├── masks.js
    │   ├── login.js
    │   ├── register.js
    │   ├── forgout-password.js
    │   │
    │   ├── admin/
    │   │   ├── dashboard-admin.js
    │   │   ├── list-users.js
    │   │   ├── list-rentals.js
    │   │   ├── list-books.js
    │   │   ├── list-publishers.js
    │   │   └── settings.js
    │   │
    │   └── tenant/
    │       ├── dashboard-tenant.js
    │       ├── settings-profile.js
    │       ├── editing-information.js
    │       └── settings-accessibility.js
    │
    ├── pages/
    │   ├── login.html
    │   ├── register.html
    │   ├── forgout-password.html
    │   │
    │   ├── admin/
    │   │   ├── dashboard-admin.html
    │   │   ├── list-publishers.html
    │   │   ├── list-books.html
    │   │   ├── list-users.html
    │   │   ├── list-rentals.html
    │   │   └── settings.html
    │   │
    │   └── tenant/
    │       ├── dashboard-tenant.html
    │       ├── settings-profile.html
    │       ├── editing-information.html
    │       └── settings-accessibility.html
    │
    └── style/
        ├── login.css
        ├── register.css
        ├── forgout-password.css
        │
        ├── admin/
        │   ├── dashboard-admin.css
        │   ├── settings.css
        │   ├── list-users.css
        │   ├── list-rentals.css
        │   ├── list-books.css
        │   └── list-publishers.css
        │
        └── tenant/
            ├── dashboard-tenant.css
            ├── editing-information.css
            ├── settings-profile.css
            └── settings-accessibility.css