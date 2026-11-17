import MyComponentBase from './myComponentBase.js';

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
    </nav>
    `;
  }
}
customElements.define('my-header', MyHeader);

export default MyHeader;
