//pagina de cadastrar livros no banco (sétimo ciclo do inferno)
//READa as editoras lá, mostra aqui e CREATE livros lá

import config from './config.js';


const form_livro = document.querySelector('#form_livro');
const campo_isbn = document.querySelector('#isbn');
const campo_titulo = document.querySelector('#titulo');
const campo_descricao = document.querySelector('#descricao');
const campo_ano = document.querySelector('#ano');
const campo_editora = document.querySelector('#editora');
const mensagem = document.querySelector('#mensagem');

const endereco_livro = config.url + '/rest/v1/livro';
const endereco_editora = config.url + '/rest/v1/editora';

//mostra as editoras disponíveis
async function carregar_editoras() {

    const endereco = endereco_editora + '?select=id,nome&order=nome';

    try {
        const specs = { headers: { apikey: config.publishableKey } };
        const resposta = await fetch(endereco, specs);

        if (resposta.ok) {
            const lista_editoras = await resposta.json();

            if (lista_editoras.length === 0) {
                mensagem.textContent = 'Nenhuma editora cadastrada. Cadastre uma editora no Supabase antes de cadastrar livros.';
            } else {
                for (const editora of lista_editoras) {
                    const opcao_editora = document.createElement('option');
                    opcao_editora.value = editora.id;
                    opcao_editora.textContent = editora.nome; 
                    campo_editora.appendChild(opcao_editora);
                }
            }
        } else {
            mensagem.textContent = 'Não foi possível carregar as editoras (erro ' + resposta.status + ').';
        }
    } catch (erro) {
        mensagem.textContent = 'Não foi possível conectar ao servidor.';
    }
}


//cadastrar um livro novo no banco
async function cadastrar_livro(evento) {
    evento.preventDefault();

    const novo_livro = {
        isbn: campo_isbn.value.trim(),
        titulo: campo_titulo.value.trim(),
        descricao: campo_descricao.value.trim(),
        ano: Number(campo_ano.value),
        editora: Number(campo_editora.value)
    };
    mensagem.textContent = 'Cadastrando...';

    try {
        const specs = {
            method: 'POST',
            headers: {
                apikey: config.publishableKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novo_livro)
        };
        const resposta = await fetch(endereco_livro, specs);

        if (resposta.ok) {
            mensagem.textContent = 'Livro cadastrado com sucesso!';
            form_livro.reset();
        } else if (resposta.status === 409) {
            mensagem.textContent = 'Já existe um livro com esse ISBN (ou a editora escolhida não existe mais).';
        } else {
            const erro_server = await resposta.json();
            mensagem.textContent = 'Não foi possível cadastrar o livro: ' + erro_server.message;
        }
    } catch (erro) {
        mensagem.textContent = 'Não foi possível conectar ao servidor.';
    }
}

form_livro.addEventListener('submit', cadastrar_livro);

carregar_editoras();
