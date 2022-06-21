/**
 * CLASSE QUE MODELA UM NIVEL DE UM TUTORIAL NA APLICAÇÃO
 */
export class Nivel {
    constructor(video, exercicios, experiencia, intro) {
        this.video = video;
        this.exercicios = exercicios;
        this.experiencia = experiencia;
        this.intro = intro;
        this.id = uid();
    }

    // Getters
    getVideo() { return this.video; }
    getExercicios() { return this.exercicios; }
    getExperiencia() { return this.experiencia; }
    getIntro() { return this.intro; }

    // Setters
    setVideo(val) { this.video = val; }
    setExercicios(val) { this.exercicios = val; }
    setExperiencia(val) { this.experiencia = val; }
    setIntro(val) { this.intro = val; }
}

const uid = () => (performance.now().toString(36) + Math.random().toString(36)).replace(/\./g, "");
