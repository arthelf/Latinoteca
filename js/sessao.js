//guarda quem tá logado no site em forma de texto (JSON.stringify e parse)

const CHAVE = 'latinoteca_usuario';

// devolve {cpf, nome} de quem entrou, ou null se não tiver ninguém
export function getUsuario() {
    const texto = localStorage.getItem(CHAVE);
    return texto ? JSON.parse(texto) : null;
}

export function salvarUsuario(usuario) {
    localStorage.setItem(CHAVE, JSON.stringify(usuario));
}

export function sair() {
    localStorage.removeItem(CHAVE);
}
