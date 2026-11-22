import MyComponentBase from './myComponentBase.js';

//custom header e nav
class MyHeader extends MyComponentBase {
  constructor() {
    super();
    this.shadowRoot.innerHTML = `
    <style>
    .box-header {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 5px 10px;
    }
    .box-header .logo {
        width: 1.5rem;
        height: auto;
    }
    .box-nav {
        display: flex;
        gap: 20px;
        margin-top: 5px;
        padding: 5px 10px;
    }
    .box-nav a:hover {
        color: var(--highlight-color);
    }
    </style>
    <header class="box box-header">
        <a href="index.html">
            <img src="img/logo.svg" width="200" height="300" alt="Logo da Latinoteca" class="logo">
        </a>
        <h1>Latinoteca</h1>
    </header>
    <nav class="box box-nav">
        <a href="index.html">Principal</a>
        <a href="acervo.html">Acervo</a>
        <a href="cadastrar.html">Cadastrar</a>
        <a href="alterar.html">Alterar</a>
        <a href="delete.html">Excluir</a>
        <a href="index.html#sobre">Sobre</a>
    </nav>
    `;
  }
}
customElements.define('my-header', MyHeader);


//custom footer
class MyFooter extends MyComponentBase {
  constructor() {
    super();
    this.shadowRoot.innerHTML = `
    <style>
    .box-footer {
      padding: 10px;
      margin-top: 10px;
      text-align: center;
    }
    </style>
    <footer class="box box-footer">
        <p>
          2026, Latinoteca. Projeto Escolar. Contato: arthurcacoilo@gmail.com
        </p>
    </footer>
    `;
  }
}
customElements.define('my-footer', MyFooter);


export { MyHeader, MyFooter };