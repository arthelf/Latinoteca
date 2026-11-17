import MyComponentBase from './myComponentBase.js';

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
export default MyFooter;
