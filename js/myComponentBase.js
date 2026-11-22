//arquivos css pros componentes
const arquivosCSS = [
  'style/modern-normalize.css',
  'style/base.css',
  'style/components.css'
];

const folhasDeEstilo = arquivosCSS.map(() => new CSSStyleSheet());

const carregarEstilosGlobais = Promise.all(
  arquivosCSS.map((caminho) => fetch(caminho).then(res => res.text()))
).then((textosCSS) => { 
  textosCSS.forEach((css, index) => {
    folhasDeEstilo[index].replaceSync(css);
  });
});

//classe base pra ser herdada pelos componentes
class MyComponentBase extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = folhasDeEstilo;
  }
}
export default MyComponentBase;