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

```plaintext
altislab-frontend/
├── README.md
├── index.html
└── src/
    ├── imgs/
    │   ├── adjustments.svg
    │   ├── back-arrow.svg
    │   ├── book.svg
    │   ├── calendar.svg
    │   ├── cpf.svg
    │   ├── key.svg
    │   ├── location.svg
    │   ├── logout.svg
    │   ├── mail.svg
    │   ├── telephone.svg
        ├── visibility.svg
    │   ├── visibility_off.svg
    │   └── user.svg
    ├── js/
    │   ├── admin/
    │   │   ├── dashboard-admin.js
    │   │   ├── list-books.js
    │   │   ├── list-publishers.js
    │   │   ├── list-rentals.js
    │   │   ├── list-users.js
    │   │   └── settings.js
    │   ├── tenant/
    │   │   ├── dashboard-tenant.js
    │   │   ├── editing-information.js
    │   │   ├── settings-accessibility.js
    │   │   └── settings-profile.js
    │   ├── forgout-password.js
    │   ├── login.js
    │   ├── masks.js
    │   └── register.js
    ├── pages/
    │   ├── admin/
    │   │   ├── dashboard-admin.html
    │   │   ├── list-books.html
    │   │   ├── list-publishers.html
    │   │   ├── list-rentals.html
    │   │   ├── list-users.html
    │   │   └── settings.html
    │   ├── tenant/
    │   │   ├── dashboard-tenant.html
    │   │   ├── editing-information.html
    │   │   ├── settings-accessibility.html
    │   │   └── settings-profile.html
    │   ├── forgout-password.html
    │   ├── login.html
    │   └── register.html
    └── style/
        ├── admin/
        │   ├── dashboard-admin.css
        │   ├── list-books.css
        │   ├── list-publishers.css
        │   ├── list-rentals.css
        │   ├── list-users.css
        │   └── settings.css
        ├── tenant/
        │   ├── dashboard-tenant.css
        │   ├── editing-information.css
        │   ├── settings-accessibility.css
        │   └── settings-profile.css
        ├── forgout-password.css
        ├── login.css
        └── register.css
```