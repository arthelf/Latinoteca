/*código da página inicial (oitavo ciclo do inferno)
entrar, criar conta e sair na tabela usuário
mostra o painel certo dependendo do user estar logado ou não
*/

import config from './config.js';
import { get_usuario, salvar_usuario, sair } from './sessao.js';
 
//elementos, e muitos
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
 
const botao_sair = document.querySelector('#btn_sair');
 
//endereço da tabela no API do Supabase
const endereco_tabelaUsuario = config.url + '/rest/v1/usuario';
 

//muda o que aparece se tiver logado ou não
function atualizar_painel() {
    const usuario = get_usuario();
 
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
async function fazer_login(evento) {
    evento.preventDefault();
    
    const cpf = entrar_cpf.value.trim();
    mensagem.textContent = 'Verificando...';

    try {
        //é tipo um select cpf, nome where cpf = cpf do cpf do usuário atual na tabela usuario
        const endereco = endereco_tabelaUsuario + '?select=cpf,nome&cpf=eq.' + cpf;
        const specs = { headers: { apikey: config.publishableKey } };
        const resposta = await fetch(endereco, specs);
 
        if (resposta.ok === false) {
            mensagem.textContent = 'Não foi possível entrar (erro ' + resposta.status + ').';
        } else {
            const lista_usuarios = await resposta.json();
 
            if (lista_usuarios.length === 0) {
                mensagem.textContent = 'CPF não encontrado. Crie uma conta.';
            } else {
                const usuario_encontrado = lista_usuarios[0];
                salvar_usuario(usuario_encontrado);
                form_entrar.reset();
                mensagem.textContent = '';
                atualizar_painel();
            }
        }
    } catch (erro) {
        mensagem.textContent = 'Não foi possível conectar ao servidor.';
    }
}

//criar conta 
async function criar_conta(evento) {
    evento.preventDefault();
 
    const novo_usuario = {
        cpf: cadastro_cpf.value.trim(),
        nome: cadastro_nome.value.trim(),
        nascimento: cadastro_nascimento.value,
        genero: cadastro_genero.value
    };
    mensagem.textContent = 'Criando conta...';
 
    try {
        const resposta = await fetch(endereco_tabelaUsuario, {
            method: 'POST',
            headers: {
                apikey: config.publishableKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novo_usuario)
        });
 
        if (resposta.ok) {
            salvar_usuario({ cpf: novo_usuario.cpf, nome: novo_usuario.nome });
            form_cadastro.reset();
            mensagem.textContent = '';
            atualizar_painel();
        } else if (resposta.status === 409) {
            mensagem.textContent = 'Já existe uma conta com esse CPF.';
        } else {
            const erro_servidor = await resposta.json();
            mensagem.textContent = 'Não foi possível criar a conta: ' + erro_servidor.message;
        }
    } catch (erro) {
        mensagem.textContent = 'Não foi possível conectar ao servidor.';
    }
}

//sair 
function fazer_logout() {
    sair();
    mensagem.textContent = '';
    atualizar_painel();
}
 
form_entrar.addEventListener('submit', fazer_login);
form_cadastro.addEventListener('submit', criar_conta);
botao_sair.addEventListener('click', fazer_logout);

atualizar_painel();