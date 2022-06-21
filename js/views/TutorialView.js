import {
  delegate,
  showToast,
  ensureUser,
} from "../main.js";
import * as Tutorial from "../models/Tutorial.js";
import * as User from "../models/User.js";

const user = User.getUserLogged();

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

ensureUser();



// Validar resposta
delegate(document, 'click', '.js-validar', (event) => {
  event.preventDefault();
  const tutorials = Tutorial.getTutorials();
  const tutorialId = document.querySelector('.js-nivel').dataset.tutorialId;
  const tutorial = tutorials.find(tutorial => tutorial.id === tutorialId);
  const nivelAtual = parseInt(document.querySelector('.js-nivel').dataset.nivel);
  const nivel = tutorial.getNiveis()?.[nivelAtual - 1];
  const exercicioAtual = parseInt(document.querySelector('.js-nivel').dataset.exercicioId);
  const exercicio = nivel.getExercicios()[exercicioAtual - 1];

  const temMaisExercicios = () => {
    return nivel.getExercicios().length > exercicioAtual;
  }

  const temMaisNiveis = () => {
    return tutorial.getNiveis().length > nivelAtual;
  }

  const carregaProximoNivel = () => {
    renderTutorial(params, nivelAtual + 1, 1);
  }

  const carregaProximoExercicio = () => {
    renderTutorial(params, nivelAtual, exercicioAtual + 1);
  }

  const atualizaPontosUser = () => {
    const pontos = parseInt(user.getPontos());
    const tutorialId = document.querySelector('.js-tutorial').dataset.id;
    const tutorials = Tutorial.getTutorials();
    const tutorial = tutorials.find(tutorial => tutorial.id == tutorialId);
    const nivelAtual = parseInt(document.querySelector('.js-nivel').dataset.nivel);
    const nivel = tutorial.getNiveis()?.[nivelAtual - 1];
    const experienciaNivel = parseInt(nivel.getExperiencia());

    user.setPontos(pontos + experienciaNivel);

    const tutoriaisConcluidos = user.getTutoriaisConcluidos();
    tutoriaisConcluidos[tutorialId] = tutoriaisConcluidos[tutorialId] || [];
    tutoriaisConcluidos[tutorialId].push(nivelAtual);

    User.atualizarUser(user);
  }

  const carregaProximoX = () => {
    if (temMaisExercicios()) {
      carregaProximoExercicio();
    } else if (temMaisNiveis()) {
      atualizaPontosUser();
      carregaProximoNivel();
    } else {
      // Tutorial concluido. Vamos atualizar a pontuação do player.
      atualizaPontosUser();
      alert('Parabéns! Tutorial concluido!');
      window.location = '/';
    }
  }

  switch (exercicio.getTipo()) {
    case 'pergunta-resposta':
      const resposta = document.querySelector('.js-exercicio-placeholder input[type="text"]').value;
      if (resposta == exercicio.getPerguntaRespostaResposta()) {
        showToast('Resposta correta. Parabéns!', 'success');
        carregaProximoX();
      } else {
        showToast('Resposta errada.', 'danger');
      }
      break;
    case 'escolha-multipla':
      const respostaUser = document.querySelector('.js-exercicio-placeholder select').value;
      if (respostaUser == exercicio.getEscolhaMultiplaCerta()) {
        showToast('Resposta correta. Parabéns!', 'success');
        carregaProximoX();
      } else {
        showToast('Resposta errada.', 'danger');
      }
      break;
    case 'fill-in-the-blanks':
      const respostas = [...document.querySelectorAll('.js-exercicio-placeholder input[type="text"]')]
        .map(input => input.value.toLowerCase())
        .filter(resposta => resposta.length > 0);
      const respostasCertas = exercicio.getFillTheBlanksResposta();

      if (respostas.length == respostasCertas.length) {
        if (respostasCertas.filter(el => !respostas.includes(el.toLowerCase())).length == 0) {
          // encontrou todas as respostas
          showToast('Resposta correta. Parabéns!', 'success');
          carregaProximoX();
        } else {
          showToast('Resposta errada.', 'danger');
        }
      } else {
        showToast('Tem de preencher todas as caixas de texto.', 'danger');
      }

      break;
  }
});

// Saltar para timestamp do video
delegate(document, 'click', '.js-etiqueta', (event) => {
  event.preventDefault();
  const tempo = event.target.dataset?.tempo?.split(':');
  const horas = parseInt(tempo[0]) * 3600;
  const minutos = parseInt(tempo[1]) * 60;
  const segundos = parseInt(tempo[2]);
  const totalSegundos = (horas + minutos + segundos)

  document.querySelector('.js-video').currentTime = totalSegundos;
})

// Atualizar página com dados do tutorial
const renderTutorial = (params, nivelAtual = 1, exercicioAtual = 1) => {
  const tutorials = Tutorial.getTutorials();
  const tutorial = tutorials.find(tutorial => tutorial.id === params.id);

  if (tutorial) {
    const nivel = tutorial.getNiveis()?.[nivelAtual - 1];
    const video = nivel.getVideo();

    if (!nivel) {
      window.location = '/';
    }

    console.log('tutorial', tutorial);
    console.log('nivel', nivel);

    document.querySelector('.js-tutorial').dataset.id = tutorial.id;
    document.querySelector('.js-tutorial-banner').style.backgroundImage = `url(${tutorial.getImagem()}`;
    document.querySelector('.js-titulo-tutorial').innerHTML = tutorial.getTitulo();
    document.querySelector('.js-nivel').innerHTML = `Nível ${nivelAtual}/${tutorial.getNiveis().length}`;
    document.querySelector('.js-nivel').dataset.nivel = nivelAtual;
    document.querySelector('.js-nivel').dataset.tutorialId = tutorial.id;
    document.querySelector('.js-nivel').dataset.exercicioId = exercicioAtual;
    document.querySelector('.js-descricao-tutorial').innerHTML = tutorial.getDescricao();

    tutorial.getTags().forEach(tag => {
      document.querySelector('.js-tutorial-tags-wrapper').innerHTML += `
        <button type="button" class="btn btn-sm btn-outline-secondary tutorial-tag">${tag}</button>
      `;
    });

    document.querySelector('.js-introducao-tutorial').innerHTML = nivel.getIntro();

    // Video
    const videoUrl = (video.getUrl().startsWith('http') ? '' : '/videos/') + video.getUrl();
    document.querySelector('.js-tutorial-video-placeholder').innerHTML = `
      <video controls class="js-video">
        <source src="${videoUrl}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    `;

    // Etiquetas
    document.querySelector('.js-etiquetas ul').innerHTML += (video.getEtiquetas() || [])?.map(etiqueta => {
      return `<li><a href="#" class="js-etiqueta" data-tempo="${etiqueta.tempo}">[${etiqueta.tempo}] - ${etiqueta.nome}</a></li>`;
    }).join('');

    const exercicio = nivel.getExercicios()[exercicioAtual - 1];

    console.log('exercicio', exercicio);
    document.querySelector('.js-exercicio-placeholder').classList.remove('escolha-multipla');
    switch (exercicio.getTipo()) {
      case 'pergunta-resposta':
        document.querySelector('.js-exercicio-placeholder').innerHTML = `
          <h1>${exercicio.getPerguntaRespostaPergunta()}</h1>
          <input type="text" />
          <input type="submit" class="btn btn-primary js-validar" value="Validar">
        `;
        break;
      case 'escolha-multipla':
        document.querySelector('.js-exercicio-placeholder').innerHTML = `
          <h1>${exercicio.getEscolhaMultiplaPergunta()}</h1>
          <select name="resposta">
            <option value="">Escolha a resposta</option>
            ${exercicio.getEscolhaMultiplaOpcoes().map(resposta => `<option value="${resposta}">${resposta}</option>`)}
          </select>
          <input type="submit" class="btn btn-primary js-validar" value="Validar">
        `;
        document.querySelector('.js-exercicio-placeholder').classList.add('escolha-multipla');
        break;
      case 'fill-in-the-blanks':
        document.querySelector('.js-exercicio-placeholder').innerHTML = `
          <h1>Preencha os espaços em branco</h1>
          <p>Para criar um novo branch, utilizamos o comando 'git <input type="text" /> -b NOME_DO_BRANCH'</p>
          <input type="submit" class="btn btn-primary js-validar" value="Validar">
        `;
        break;
    }
  }
}


if (params.id) {
  renderTutorial(params);
}
