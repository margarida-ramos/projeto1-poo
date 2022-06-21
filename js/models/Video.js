/**
 * CLASSE QUE MODELA UM VIDEO DE UM NIVEL DE UM TUTORIAL NA APLICAÇÃO
 */
export class Video {
    constructor(titulo, url, etiquetas) {
        this.titulo = titulo;
        this.url = url;
        this.etiquetas = etiquetas;
        this.id = uid();
    }

    // Getters
    getTitulo() { return this.titulo; }
    getUrl() { return this.url; }
    getEtiquetas() { return this.etiquetas; }

    // Setters
    setTitulo(val) { this.titulo = val; }
    setUrl(val) { this.url = val; }
    setEtiquetas(val) { this.etiquetas = val; }
}

const uid = () => (performance.now().toString(36) + Math.random().toString(36)).replace(/\./g, "");
