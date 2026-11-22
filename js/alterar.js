//pagina para alterar livros que já estão no banco (quinquagésimo terceiro ciclo do inferno)
//UPDATE os livros que estão no banco

import config from './config.js';


const mensagem = document.querySelector('#mensagem');

const painel_lista = document.querySelector('#painel_lista');
const lista_livros = document.querySelector('#lista_livros');

const painel_edicao = document.querySelector('#painel_edicao');
const form_livro = document.querySelector('#form_livro');
const texto_isbn = document.querySelector('#isbn_livro');
const campo_titulo = document.querySelector('#titulo');
const campo_descricao = document.querySelector('#descricao');
const campo_ano = document.querySelector('#ano');
const campo_editora = document.querySelector('#editora');
const botao_cancelar = document.querySelector('#botao_cancelar');

const endereco_livro = config.url + '/rest/v1/livro';
const endereco_editora = config.url + '/rest/v1/editora';
const specs = { headers: { apikey: config.publishableKey } };

let isbn_atual = '';



function criar_opcao(valor, texto) {
    const opcao = document.createElement('option');
    opcao.value = valor;
    opcao.textContent = texto;
    return opcao;
}


async function carregar_editoras() {
    const endereco = endereco_editora + '?select=id,nome&order=nome';

    try {
        const resposta = await fetch(endereco, specs);

        if (resposta.ok) {
            const lista_editoras = await resposta.json();

            campo_editora.innerHTML = '';
            campo_editora.appendChild(criar_opcao('', 'Selecione a editora'));

            for (const editora of lista_editoras) {
                campo_editora.appendChild(criar_opcao(editora.id, editora.nome));
            }
        } else {
            mensagem.textContent = 'Não foi possível carregar as editoras (erro ' + resposta.status + ').';
        }
    } catch (erro) {
        mensagem.textContent = 'Não foi possível conectar ao servidor.';
    }
}


function preparar_edicao(livro) {
    isbn_atual = livro.isbn;

    texto_isbn.textContent = livro.isbn;
    campo_titulo.value = livro.titulo;
    campo_descricao.value = livro.descricao;
    campo_ano.value = livro.ano;
    campo_editora.value = livro.editora.id;

    painel_lista.hidden = true;
    painel_edicao.hidden = false;
    mensagem.textContent = 'Altere os dados que quiser e clique em Salvar alterações.';
}


function criar_cartao(livro) {
    const cartao = document.createElement('section');
    cartao.className = 'box livro';

    const titulo = document.createElement('h3');
    titulo.textContent = livro.titulo;

    const detalhes = document.createElement('p');
    detalhes.textContent = livro.editora.nome + ' · ' + livro.ano + ' · ISBN ' + livro.isbn;

    const botao_alterar = document.createElement('button');
    botao_alterar.type = 'button';
    botao_alterar.textContent = 'Alterar';

    botao_alterar.addEventListener('click', () => { preparar_edicao(livro); });

    cartao.appendChild(titulo);
    cartao.appendChild(detalhes);
    cartao.appendChild(botao_alterar);

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


async function carregar_livros() {
    const endereco = endereco_livro + '?select=isbn,titulo,descricao,ano,editora(id,nome)&order=titulo';

    try {
        const resposta = await fetch(endereco, specs);

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


function voltarP_lista() {
    isbn_atual = '';
    painel_edicao.hidden = true;
    painel_lista.hidden = false;
}

function cancelar_edicao() {
    voltarP_lista();
    mensagem.textContent = 'Escolha um livro para alterar.';
}


async function salvar_alteracoes(evento) {
    evento.preventDefault();

    const dados_alterados = {
        titulo: campo_titulo.value.trim(),
        descricao: campo_descricao.value.trim(),
        ano: Number(campo_ano.value),
        editora: Number(campo_editora.value)
    };
    mensagem.textContent = 'Salvando...';

    try {
        const endereco = endereco_livro + '?isbn=eq.' + isbn_atual;

        const resposta = await fetch(endereco, {
            method: 'PATCH',
            headers: {
                apikey: config.publishableKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados_alterados)
        });

        if (resposta.ok) {
            voltarP_lista();
            mensagem.textContent = 'Livro alterado com sucesso! Escolha outro livro para alterar.';
            carregar_livros();
        } else {
            const erro_server = await resposta.json();
            mensagem.textContent = 'Não foi possível alterar o livro: ' + erro_server.message;
        }
    } catch (erro) {
        mensagem.textContent = 'Não foi possível conectar ao servidor.';
    }
}


form_livro.addEventListener('submit', salvar_alteracoes);
botao_cancelar.addEventListener('click', cancelar_edicao);

carregar_editoras();
carregar_livros();
