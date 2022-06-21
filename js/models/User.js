import { showToast } from "../main.js";

/**
 * CLASSE QUE MODELA UM UTILIZADOR NA APLICAÇÃO
 */
let users;

// CARREGAR UTILIZADORES DA LOCALSTORAGE
export function init() {
    const userObjects = localStorage.users ? JSON.parse(localStorage.users) : [];
    users = userObjects.map(user => new User(
        user.nome,
        user.dataNascimento,
        user.sexo,
        user.localidade,
        user.email,
        user.password,
        user.role,
        user.favoritos,
        user.activo,
        user.pontos,
        user.tutoriaisConcluidos,
        user.id,
    ));
}

export function removerUser(userId) {
    // abortar se tentar remover a ele próprio
    if (getUserLogged().id == userId) {
        showToast('Não é possível remover o seu próprio utilizador.', 'danger');
        return false;
    }

    const nUsers = users.length;
    users = users.filter(user => user.getId() != userId);
    if (nUsers == users.length) {
        // Id não encontrado
        showToast('Ocorreu um erro ao remover o utilizador.', 'danger');
        return false;
    }
    guardarLocalStorage();
    showToast('Utilizador removido com sucesso', 'success');
    return true;
}

export function atualizarUser(user) {
    users = users.filter(u => u.id !== user.id);
    users.push(user);
    guardarLocalStorage();
}

class User {
    constructor(nome, dataNascimento, sexo, localidade, email, password, role = 'user', favoritos = [], activo = true, pontos = 0, tutoriaisConcluidos = {}, id) {
        this.nome = nome;
        this.dataNascimento = dataNascimento;
        this.sexo = sexo;
        this.localidade = localidade;
        this.email = email;
        this.password = password;
        this.role = role; // admin || user
        this.favoritos = favoritos;
        this.activo = activo;
        this.pontos = pontos;
        this.tutoriaisConcluidos = tutoriaisConcluidos;
        this.id = id || uid();
    }

    // Getters
    getNome() {
        return this.nome;
    }
    getDataNascimento() {
        return this.dataNascimento;
    }
    getSexo() {
        return this.sexo;
    }
    getLocalidade() {
        return this.localidade;
    }
    getEmail() {
        return this.email;
    }
    getPassword() {
        return this.password;
    }
    getRole() {
        return this.role;
    }
    getFavoritos() {
        return this.favoritos;
    }
    getActivo() {
        return this.activo;
    }
    getId() {
        return this.id;
    }
    getPontos() {
        return this.pontos;
    }
    getTutoriaisConcluidos() {
        return this.tutoriaisConcluidos;
    }

    // Setters
    setNome(val) {
        this.nome = val;
    }
    setDataNascimento(val) {
        this.dataNascimento = val;
    }
    setSexo(val) {
        this.sexo = val;
    }
    setLocalidade(val) {
        this.localidade = val;
    }
    setEmail(val) {
        this.email = val;
    }
    setPassword(val) {
        this.password = val;
    }
    setRole(val) {
        this.role = val;
    }
    setFavoritos(val) {
        this.favoritos = val;
    }
    setActivo(val) {
        this.activo = val;
    }
    setPontos(val) {
        this.pontos = val;
    }
    setTutoriaisConcluidos(val) {
        this.tutoriaisConcluidos = val;
    }

    // Métodos
    isAdmin() {
        return this.role === 'admin';
    }

    addFavorito(tutorialId) {
        this.favoritos.push(tutorialId);
        guardarLocalStorage();
    }

    removeFavorito(tutorialId) {
        this.favoritos = this.favoritos.filter(favorito => favorito != tutorialId);
        guardarLocalStorage();
    }
}

export function getUserByEmail(email) {
    return users.find(user => user.getEmail() === email);
}

const uid = () => (performance.now().toString(36) + Math.random().toString(36)).replace(/\./g, "");
const guardarLocalStorage = () => localStorage.setItem("users", JSON.stringify(users));

// ADICIONAR UTILIZADOR
export function add(nome, dataNascimento, sexo, localidade, email, password) {
    if (users.some((user) => user.email === email)) {
        throw Error(`Utilizador com email "${email}" já existe!`);
    } else {
        users.push(new User(nome, dataNascimento, sexo, localidade, email, password));
        guardarLocalStorage();
    }
}

// LOGIN DO UTILIZADOR
export function login(email, password) {
    const user = users.find(
        (user) => user.email === email && user.password === password
    );
    if (user) {
        sessionStorage.setItem("loggedUser", JSON.stringify(user));
        return true;
    } else {
        throw Error("Invalid login!");
    }
}

// LOGOUT DO UTILIZADOR
export function logout() {
    sessionStorage.removeItem("loggedUser");
}

// VERIFICA EXISTÊNCIA DE ALGUÉM AUTENTICADO
export function isLogged() {
    return sessionStorage.getItem("loggedUser") ? true : false;
}

// DEVOLVE UTILZIADOR AUTENTICADO
export function getUserLogged() {
    const storedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
    return users.find(user => user.id == storedUser?.id);
}

export function getAllUsers() {
    return users;
}

export function saveAllUsers(override) {
    localStorage.setItem("users", JSON.stringify(override || users));
}
