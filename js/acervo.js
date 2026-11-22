/* consulta READ (quinto ciclo do inferno)
mostra os livros que tem na biblioteca
a pessoa busca e pode filtrar
*/
import config from './config.js';


const form_busca = document.querySelector('#form_busca');
const campo_busca = document.querySelector('#busca');
const lista_livros = document.querySelector('#lista');
const mensagem = document.querySelector('#mensagem');

//cria o cartãozinho do livro que vai aparecer
function criar_cartao(livro) {
    const cartao = document.createElement('article');
    cartao.className = 'box livro';

    const titulo = document.createElement('h3');
    titulo.textContent = livro.titulo;

    const detalhes = document.createElement('p');
    detalhes.textContent = livro.editora.nome + ' · ' + livro.ano + ' · ISBN ' + livro.isbn;

    const descricao = document.createElement('p');
    descricao.textContent = livro.descricao;

    cartao.appendChild(titulo);
    cartao.appendChild(detalhes);
    cartao.appendChild(descricao);

    return cartao;
}


//muda os livros que aparecem na busca atual
async function carregar_livros(texto_busca) {
    let endereco = config.url + '/rest/v1/livro';
    endereco = endereco + '?select=isbn,titulo,descricao,ano,editora(nome)&order=titulo';

    if (texto_busca !== '') {
        endereco = endereco + '&titulo=ilike.*' + encodeURIComponent(texto_busca) + '*';
    } 
    mensagem.textContent = 'Carregando...';

    try {
        const specs = { headers: { apikey: config.publishableKey } };
        const resposta = await fetch(endereco, specs);

        if (resposta.ok) {
            const livros = await resposta.json();
            mostrar_livros(livros);
        } else {
            lista_livros.innerHTML = '';
            mensagem.textContent = 'Não foi possível carregar o acervo (erro ' + resposta.status + ')';
        }
    } catch (erro) {
        lista_livros.innerHTML = '';
        mensagem.textContent = 'Não foi possível conectar ao Supabase. Confira a chave do Supabase e a internet.';
    }
}


//autoexplicativa
function mostrar_livros(livros) {
    lista_livros.innerHTML = '';

    if (livros.length === 0) {
        mensagem.textContent = 'Nenhum livro encontrado.';
    } else {
        mensagem.textContent = livros.length + ' livro(s) encontrado(s).';

        for (const livro of livros) {
            const cartao = criar_cartao(livro);
            lista_livros.appendChild(cartao);
        }
    }
}


function buscar_noForm(evento) {
    evento.preventDefault();

    const texto_busca = campo_busca.value.trim();
    carregar_livros(texto_busca);
}

form_busca.addEventListener('submit', buscar_noForm);


carregar_livros('');
