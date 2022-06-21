

/**
 * CLASSE QUE MODELA UM EXERCICIO NA APLICAÇÃO
 */
export class Exercicio {
    constructor(tipo, perguntaRespostaPergunta, escolhaMultiplaCerta, escolhaMultiplaOpcoes, escolhaMultiplaPergunta, perguntaRespostaResposta, fillTheBlanksResposta, fillTheBlanksPergunta) {
        /*
            Tipos:
            1 - escolha-multipla;
            2 - fill-in-the-blanks;
            3 - pergunta-resposta;
        */
        this.tipo = tipo;
        this.perguntaRespostaPergunta = perguntaRespostaPergunta; // pergunta-resposta
        this.escolhaMultiplaCerta = escolhaMultiplaCerta; // escolha multipla
        this.escolhaMultiplaOpcoes = escolhaMultiplaOpcoes; // escolha multipla
        this.escolhaMultiplaPergunta = escolhaMultiplaPergunta; // pergunta escolha multipla
        this.perguntaRespostaResposta = perguntaRespostaResposta; // pergunta-resposta
        this.fillTheBlanksResposta = fillTheBlanksResposta; // fill-in-the-blanks string[]
        this.fillTheBlanksPergunta = fillTheBlanksPergunta; // fill-in-the-blanks pergunta
        this.id = uid();
    }

    // Getters
    getTipo() { return this.tipo; }
    getPerguntaRespostaPergunta() { return this.perguntaRespostaPergunta; }
    getEscolhaMultiplaCerta() { return this.escolhaMultiplaCerta; }
    getEscolhaMultiplaOpcoes() { return this.escolhaMultiplaOpcoes; }
    getEscolhaMultiplaPergunta() { return this.escolhaMultiplaPergunta; }
    getPerguntaRespostaResposta() { return this.perguntaRespostaResposta; }
    getFillTheBlanksResposta() { return this.fillTheBlanksResposta; }
    getFillTheBlanksPergunta() { return this.fillTheBlanksPergunta; }

    // Setters
    setTipo(val) { this.tipo = val; }
    setPerguntaRespostaPergunta(val) { this.perguntaRespostaPergunta = val; }
    setEscolhaMultiplaCerta(val) { this.escolhaMultiplaCerta = val; }
    setEscolhaMultiplaOpcoes(val) { this.escolhaMultiplaOpcoes = val; }
    setEscolhaMultiplaPergunta(val) { this.escolhaMultiplaPergunta = val; }
    setPerguntaRespostaResposta(val) { this.perguntaRespostaResposta = val; }
    setFillTheBlanksResposta(val) { this.fillTheBlanksResposta = val; }
    setFillTheBlanksPergunta(val) { this.fillTheBlanksPergunta = val; }
}

const uid = () => (performance.now().toString(36) + Math.random().toString(36)).replace(/\./g, "");
