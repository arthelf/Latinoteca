//excluir livros DELETE
import config from './config.js';

const mensagem = document.querySelector('#mensagem');
const lista_livros = document.querySelector('#lista_livros');

const endereco_livro = config.url + '/rest/v1/livro';


async function carregar_livros() {
    const endereco = endereco_livro + '?select=isbn,titulo,ano,editora(nome)&order=titulo';

    try {
        const resposta = await fetch(endereco, {
            headers: { apikey: config.publishableKey }
        });

        if (resposta.ok) {
            const livros = await resposta.json();
            mostrar_livros(livros);
        } else {
            lista_livros.innerHTML = '';
            mensagem.textContent = 'Não foi possível carregar os livros (erro ' + resposta.status + ').';
        }
    } catch (erro) {
        lista_livros.innerHTML = '';
        mensagem.textContent = 'Não foi possível conectar ao servidor.';
    }
}


function criar_cartao(livro) {
    const cartao = document.createElement('article');
    cartao.className = 'box livro';

    const titulo = document.createElement('h3');
    titulo.textContent = livro.titulo;

    const detalhes = document.createElement('p');
    detalhes.textContent = livro.editora.nome + ' · ' + livro.ano + ' · ISBN ' + livro.isbn;

    const botao_excluir = document.createElement('button');
    botao_excluir.type = 'button';
    botao_excluir.textContent = 'Excluir';

    botao_excluir.addEventListener('click', () => {
        excluir_livro(livro);
    });

    cartao.appendChild(titulo);
    cartao.appendChild(detalhes);
    cartao.appendChild(botao_excluir);

    return cartao;
}


function mostrar_livros(livros) {
    lista_livros.innerHTML = '';

    if (livros.length === 0) {
        mensagem.textContent = 'Nenhum livro cadastrado.';
    } else {
        for (const livro of livros) {
            const cartao = criar_cartao(livro);
            lista_livros.appendChild(cartao);
        }
    }
}


async function excluir_livro(livro) {

    const confirmou = confirm('Deseja realmente excluir o livro "' + livro.titulo + '"?');
    if (confirmou === false) {
        return;
    }

    try {
        const endereco = endereco_livro + '?isbn=eq.' + livro.isbn;

        const resposta = await fetch(endereco, {
            method: 'DELETE',
            headers: { apikey: config.publishableKey }
        });

        if (resposta.ok) {
            mensagem.textContent = 'Livro excluído com sucesso! Escolha outro livro para excluir.';
            carregar_livros();
        } else if (resposta.status === 409) {
            mensagem.textContent = 'Este livro não pode ser excluído porque está ligado a exemplares, autores ou gêneros.';
        } else {
            const erro_server = await resposta.json();
            mensagem.textContent = 'Não foi possível excluir o livro: ' + erro_server.message;
        }
    } catch (erro) {
        mensagem.textContent = 'Não foi possível conectar ao servidor.';
    }
}


carregar_livros();
