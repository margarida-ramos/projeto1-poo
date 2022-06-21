/**
 * CLASSE QUE MODELA UM TUTORIAL NA APLICAÇÃO
 */

import { Exercicio } from "./Exercicio.js";
import { Video } from "./Video.js";
import { Nivel } from "./Nivel.js";
import { showToast } from "../main.js";

let tutorials;

// CARREGAR TUTORIAIS DA LOCALSTORAGE
function init() {
    if (!tutorials) {
        const tutorialsObject = localStorage.tutorials ? JSON.parse(localStorage.tutorials) : [];
        tutorials = tutorialsObject.map(tutorial => createTutorialFromData(tutorial, tutorial.id));
    }
}

// ORDENAR TUTORIAIS
export function sortTutorials() {
    tutorials.sort((a, b) => a.titulo.localeCompare(b.titulo));
}

class Tutorial {
    constructor(titulo = '', niveis = [], tags = [], descricao = '', imagem = '', id) {
        this.titulo = titulo;
        this.niveis = niveis;
        this.tags = tags;
        this.descricao = descricao;
        this.imagem = imagem;
        this.id = id || uid();
        this.data_criacao = unixTimestamp();
    }

    // Getters
    getTitulo() { return this.titulo; }
    getNiveis() { return this.niveis; }
    getTags() { return this.tags; }
    getDescricao() { return this.descricao; }
    getImagem() { return this.imagem; }

    // Setters
    setTitulo(val) { this.titulo = val; }
    setNiveis(val) { this.niveis = val; }
    setTags(val) { this.tags = val; }
    setDescricao(val) { this.descricao = val; }
    setImagem(val) { this.imagem = val; }
}

export function getTutorials() {
    return tutorials;
}

export function remover(tutorialId) {
    tutorials = tutorials.filter(tutorial => tutorial.id !== tutorialId);
    localStorage.setItem("tutorials", JSON.stringify(tutorials));
}

// devolve uma instancia de tutorial em vez de um simples objeto
// isto permite depois invocar metodos como tutorial.getNiveis()[0].getIntro()
export function createTutorialFromData(tutorial, tutorialId) {
    const { tags, titulo, imagem, descricao } = tutorial;
    const niveis = tutorial.niveis.map(nivel => {
        const { experiencia, intro } = nivel;
        const { titulo, url, etiquetas } = nivel.video;
        const exercicios = nivel.exercicios.map(ex => {
            const {
                tipo,
                perguntaRespostaPergunta,
                escolhaMultiplaCerta,
                escolhaMultiplaOpcoes,
                escolhaMultiplaPergunta,
                perguntaRespostaResposta,
                fillTheBlanksResposta,
                fillTheBlanksPergunta
            } = ex;

            return new Exercicio(
                tipo,
                perguntaRespostaPergunta,
                escolhaMultiplaCerta,
                escolhaMultiplaOpcoes,
                escolhaMultiplaPergunta,
                perguntaRespostaResposta,
                fillTheBlanksResposta,
                fillTheBlanksPergunta
            );
        })
        const video = new Video(titulo, url, etiquetas);

        return new Nivel(video, exercicios, experiencia, intro);
    });

    const ret = new Tutorial(titulo, niveis, tags, descricao, imagem);

    if (tutorialId) {
        ret.id = tutorialId;
    }

    return ret;
}

export function addTutorial(tutorial, editId) {
    const novoTutorial = createTutorialFromData(tutorial);
    tutorials = tutorials || [];

    if (editId) {
        tutorials = tutorials.filter(tutorial => tutorial.id != editId);
        novoTutorial.id = editId;
        showToast('Tutorial editado com sucesso.', 'success');
    }
    tutorials.push(novoTutorial);
    localStorage.setItem("tutorials", JSON.stringify(tutorials));

    return novoTutorial;
}

const uid = () => (performance.now().toString(36) + Math.random().toString(36)).replace(/\./g, "");
const unixTimestamp = () => Math.round((new Date()).getTime() / 1000);

init();
