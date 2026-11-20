/*código da página inicial (oitavo ciclo do inferno)
entrar, criar conta e sair na tabela usuário
mostra o painel certo dependendo do user estar logado ou não
*/

import config from './config.js';
import { getUsuario, salvarUsuario, sair } from './sessao.js';
 
//elementos, muitos
const painel_acesso = document.querySelector('#painel_acesso');
const painel_oi = document.querySelector('#painel_oi');
const nome_usuario = document.querySelector('#nome_usuario');
const mensagem = document.querySelector('#mensagem');
 
const form_entrar = document.querySelector('#form_entrar');
const entrar_cpf = document.querySelector('#entrar_cpf');
 
const form_cadastro = document.querySelector('#form_cadastro');
const cadastro_cpf = document.querySelector('#cadastro_cpf');
const cadastro_nome = document.querySelector('#cadastro_nome');
const cadastro_nascimento = document.querySelector('#cadastro_nascimento');
const cadastro_genero = document.querySelector('#cadastro_genero');
 
const botao_sair = document.querySelector('#btnSair');
 
const endereco_usuario = config.url + '/rest/v1/usuario';
 
 
// se o user tá logado, mostra oi, se não, mostra cadastro
function atualizarPainel() {
    const usuario = getUsuario();
 
    if (usuario === null) {
        painel_acesso.hidden = false;
        painel_oi.hidden = true;
    } else {
        painel_acesso.hidden = true;
        painel_oi.hidden = false;
        nome_usuario.textContent = usuario.nome;
    }
}
 
 
//logar
async function fazerLogin(evento) {
    evento.preventDefault();
 
    const cpf = entrar_cpf.value.trim();
    mensagem.textContent = 'Verificando...';
 
    try {
        const endereco = endereco_usuario + '?select=cpf,nome&cpf=eq.' + cpf;
        const resposta = await fetch(endereco, {
            headers: { apikey: config.publishableKey }
        });
 
        if (resposta.ok === false) {
            mensagem.textContent = 'Não foi possível entrar (erro ' + resposta.status + ').';
        } else {
            const listaDeUsuarios = await resposta.json();
 
            if (listaDeUsuarios.length === 0) {
                mensagem.textContent = 'CPF não encontrado. Crie uma conta.';
            } else {
                const usuarioEncontrado = listaDeUsuarios[0];
                salvarUsuario(usuarioEncontrado);
                form_entrar.reset();
                mensagem.textContent = '';
                atualizarPainel();
            }
        }
    } catch (erro) {
        mensagem.textContent = 'Não foi possível conectar ao servidor.';
    }
}

//criar conta 
async function criarConta(evento) {
    evento.preventDefault();
 
    const novoUsuario = {
        cpf: cadastro_cpf.value.trim(),
        nome: cadastro_nome.value.trim(),
        nascimento: cadastro_nascimento.value,
        genero: cadastro_genero.value
    };
    mensagem.textContent = 'Criando conta...';
 
    try {
        const resposta = await fetch(endereco_usuario, {
            method: 'POST',
            headers: {
                apikey: config.publishableKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoUsuario)
        });
 
        if (resposta.ok) {
            salvarUsuario({ cpf: novoUsuario.cpf, nome: novoUsuario.nome });
            form_cadastro.reset();
            mensagem.textContent = '';
            atualizarPainel();
        } else if (resposta.status === 409) {
            mensagem.textContent = 'Já existe uma conta com esse CPF.';
        } else {
            const erroDoServidor = await resposta.json();
            mensagem.textContent = 'Não foi possível criar a conta: ' + erroDoServidor.message;
        }
    } catch (erro) {
        mensagem.textContent = 'Não foi possível conectar ao servidor.';
    }
}

//sair 
function fazerLogout() {
    sair();
    mensagem.textContent = '';
    atualizarPainel();
}
 
form_entrar.addEventListener('submit', fazerLogin);
form_cadastro.addEventListener('submit', criarConta);
botao_sair.addEventListener('click', fazerLogout);

atualizarPainel();