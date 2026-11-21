/*
localStorage
um "objeto" de informações que o navegador guarda pra um endereço
aqui o codigo cria a chave 'latinoteca_usuario' no localStorage, o qual tem um objeto em forma de string com as infos do usuário
exemplo visual
localStorage = 
{
    'latinoteca_usuario': '{"cpf":"123", "nome":"Ana"}',
    'outra_chave': 'outro valor'
}
*/

//guarda quem tá logado no site em forma de texto no localStorage

const CHAVE = 'latinoteca_usuario';

//seta a chave como um um objeto stringificado
export function salvar_usuario(usuario) {
    localStorage.setItem(CHAVE, JSON.stringify(usuario));
}

//retorna o usuario em json
export function get_usuario() {
    const texto = localStorage.getItem(CHAVE);
    return texto ? JSON.parse(texto) : null;
}

//tira a chave, sai da conta
export function sair() {
    localStorage.removeItem(CHAVE);
}
