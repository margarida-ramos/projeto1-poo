import {
  ensureAdmin,
  delegate,
  showToast,
  uid,
} from "../main.js";
import * as Tutorial from "../models/Tutorial.js";

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});


ensureAdmin();

// remover tag
delegate(document, 'click', '.js-remover-tag', (event) => {
  event.target.closest('li').remove()
});

// remover exercicio
delegate(document, 'click', '.js-remover-exercicio', (event) => {
  if (event.target.closest('.nivel-wrapper').querySelectorAll('.exercicio-wrapper').length === 1) {
    // tem de ter pelo menos um exercicio
    return showToast('Cada nível tem de ter pelo menos um exercício.', 'danger');
  }

  event.target.closest('.exercicio-wrapper').remove();
});

// remover nível
delegate(document, 'click', '.js-remover-nivel', (event) => {
  if (event.target.closest('form').querySelectorAll('.nivel-wrapper').length === 1) {
    // tem de ter pelo menos um exercicio
    return showToast('Cada tutorial deve ter pelo menos um nível.', 'danger');
  }

  event.target.closest('.nivel-wrapper').remove();
});

// Adicionar tags
var button = document.querySelector(".js-nova-tag");
button.addEventListener("click", function () {
  var input = document.getElementById("txtNovaTag");
  var ul = document.querySelector("ul.tags-list-group");
  if (input.value === '') {
    return;
  }

  ul.innerHTML += `
    <li class="list-group-item">
        ${input.value}
        <i class="fa-solid fa-trash js-remover-tag" ></i>
    </li>
  `;
  input.value = '';
  input.focus();
})

// Adicionar etiqueta ao video
delegate(document, 'click', '.js-adicionar-etiqueta', (event) => {
  var input = event.target.closest('.input-group').querySelector('input.nova-etiqueta');
  var time = event.target.closest('.input-group').querySelector('input.nova-etiqueta-time');

  if (time.value.length == 0) {
    return showToast('Deve especificar o timestamp da etiqueta.', 'danger');
  }

  var ul = event.target.closest('.adicionar-etiqueta-wrapper').querySelector('ul');
  if (input.value === '') {
    return;
  }

  ul.innerHTML += `
    <li class="list-group-item" data-tempo="${time.value}" data-nome="${input.value}">
        <span>${time.value}</span>
        <span>${input.value}</span>
        <i class="fa-solid fa-trash js-remover-tag" ></i>
    </li>
  `;

  input.value = '';
  time.value = '';
  input.focus();
})


// Adicionar opção de escolha múltipla
delegate(document, 'click', '.js-adicionar-opcao', (event) => {
  var input = event.target.closest('.input-group').querySelector('input');
  var ul = event.target.closest('.pergunta-wrapper').querySelector('ul');
  if (input.value === '') {
    return;
  }

  ul.innerHTML += `
    <li class="list-group-item">
        ${input.value}
        <i class="fa-solid fa-trash js-remover-tag" ></i>
    </li>
  `;

  const fitbInput = event.target.closest('.pergunta-wrapper').querySelector('[name="nova-resposta-fitb"]');
  const emInput = event.target.closest('.pergunta-wrapper').querySelector('[name="nova-resposta-em"]');

  if (fitbInput) {
    fitbInput.value = '';
    fitbInput.focus();
  }

  if (emInput) {
    emInput.value = '';
    emInput.focus();
  }
})

//Form submit
delegate(document, 'submit', '.js-criar-tutorial-form', (event) => {
  event.preventDefault();

  const tutorial = {
    titulo: document.querySelector('form #txtTitulo').value?.trim(),
    descricao: document.querySelector('form #txtDescricao').value?.trim(),
    imagem: document.querySelector('form #txtImagem').value?.trim(),
    tags: [...document.querySelectorAll('.tags-list-group li')].map(tag => tag.textContent.trim()),
    niveis: [...document.querySelectorAll('.nivel-wrapper')].map(nivel => {
      return {
        intro: nivel.querySelector('.nivel-introducao').value?.trim(),
        experiencia: nivel.querySelector('.nivel-experiencia').value?.trim(),
        video: {
          url: nivel.querySelector('.video-url').value?.trim(),
          titulo: nivel.querySelector('.video-titulo').value?.trim(),
          etiquetas: [...document.querySelectorAll('.adicionar-etiqueta-wrapper .list-group li')].map(tag => ({
            nome: tag.dataset?.nome?.trim(),
            tempo: tag.dataset?.tempo?.trim(),
          })),
        },
        exercicios: [...nivel.querySelectorAll('.exercicio-wrapper')].map(exercicio => {
          return {
            tipo: exercicio.querySelector('.js-tipo-pergunta').value?.trim(),
            perguntaRespostaPergunta: exercicio.querySelector('input[name="pergunta-resposta-pergunta"]').value?.trim(),
            perguntaRespostaResposta: exercicio.querySelector('input[name="pergunta-resposta-resposta"]').value?.trim(),
            escolhaMultiplaPergunta: exercicio.querySelector('input[name="escolha-multipla-pergunta"]').value?.trim(),
            escolhaMultiplaOpcoes: [...exercicio.querySelectorAll('.escolha-multipla-wrapper li')].map(tag => tag.textContent.trim()),
            escolhaMultiplaCerta: exercicio.querySelector('input[name="escolha-multipla-certa"]').value?.trim(),
            fillTheBlanksPergunta: exercicio.querySelector('textarea[name="fill-the-blanks-pergunta"]')?.value?.trim(),
            fillTheBlanksResposta: [...exercicio.querySelectorAll('.fill-in-the-blanks-wrapper li')].map(tag => tag.textContent.trim()),

          };
        })
      };
    }),
  }

  if (!isFormularioValido(tutorial)) {
    return;
  }

  if (params.edit) {
    Tutorial.addTutorial(tutorial, params.edit);
  } else {
    Tutorial.addTutorial(tutorial);
  }
});

// Add nivel
delegate(document, 'click', '.js-add-nivel', (event) => {
  event.preventDefault();
  addNivel();
});

// Add exercicio
delegate(document, 'click', '.js-add-exercicio', (event) => {
  event.preventDefault();
  const nivelId = event.target.closest('.nivel-wrapper').dataset.nivelId;
  addExercicio(nivelId);
});

// Remover tutorial
delegate(document, 'click', '.js-btn-remover-tutorial', (event) => {
  event.preventDefault();

  const confirmar = confirm('Está prestes a remover este tutorial. Tem a certeza que pretende continuar?');
  if (confirmar) {
    Tutorial.remover(params.edit);
  }
});


const onTipoPerguntaChange = event => {
  //event.preventDefault();
  const exercicioId = event.target.dataset.exercicio;
  const tipoExercicio = event.target.value;
  const nivelId = event.target.closest('.nivel-wrapper').dataset.nivelId;
  const wrapper = `.nivel-wrapper-${nivelId} .exercicio-wrapper-${exercicioId}`;

  // Esconde todos os campos por defeito
  [...document.querySelectorAll(`${wrapper} .pergunta-resposta-wrapper, ${wrapper} .escolha-multipla-wrapper, ${wrapper} .fill-in-the-blanks-wrapper`)]
    .forEach(v => v.classList.add('hide'))

  switch (tipoExercicio) {
    case "pergunta-resposta":
      document.querySelector(`${wrapper} .pergunta-resposta-wrapper`).classList.remove('hide');
      break;
    case "escolha-multipla":
      document.querySelector(`${wrapper} .escolha-multipla-wrapper`).classList.remove('hide');
      break;
    case "fill-in-the-blanks":
      document.querySelector(`${wrapper} .fill-in-the-blanks-wrapper`).classList.remove('hide');
      break;
  }
}

// Alternar entre tipos de perguntas
delegate(document, 'click', '.js-tipo-pergunta', onTipoPerguntaChange);
delegate(document, 'change', '.js-tipo-pergunta', onTipoPerguntaChange);


function isFormularioValido(tutorial) {
  let valido = true;
  tutorial.niveis.forEach(nivel => {
    nivel.exercicios.forEach(ex => {
      switch (ex.tipo) {
        case "pergunta-resposta":
          valido = (ex.perguntaRespostaPergunta != '' && ex.perguntaRespostaResposta != '')
          if (!valido) {
            showToast('Pergunta e Resposta são campos obrigatórios.', 'danger');
          }
          break;
        case "escolha-multipla":
          valido = (ex.escolhaMultiplaPergunta != '' && ex.escolhaMultiplaOpcoes.length != 0 && ex.escolhaMultiplaCerta != '')
          if (!valido) {
            showToast('Os campos de escolha múltipla são obrigatórios.', 'danger');
          }
          break;
        case "fill-in-the-blanks":
          valido = (ex.fillTheBlanksPergunta != '' && ex.fillTheBlanksResposta.length != 0)
          if (!valido) {
            showToast('Os campos de Fill In The Blanks são obrigatórios.', 'danger');
            break;
          }

          valido = valido && (ex.fillTheBlanksPergunta.split('##').length - 1 == ex.fillTheBlanksResposta.length);
          if (!valido) {
            showToast('Número de respostas de FITB inválido', 'danger');
          }
          break;
        default:
          valido = false;
          showToast('Seleccione o tipo de exercício.', 'danger');
          break;
      }
    });
  })
  return valido;
}

function addExercicio(nivelId) {
  const exercicioId = uid(); //document.querySelectorAll(`.nivel-wrapper-${nivelId} .exercicios-placeholder .exercicio-wrapper`).length + 1;
  var exerciciosPlaceholder = document.querySelector(`.nivel-wrapper-${nivelId} .exercicios-placeholder`);
  exerciciosPlaceholder.appendChild(createElementFromHTML(`<div class="exercicio-wrapper exercicio-wrapper-${exercicioId} card">
    <h3>Exercício<i class="fa-solid fa-trash js-remover-exercicio" data-exercicio-id="${exercicioId}"></i></h3>
    <div class="row mb-3">
      <div class="col-12">
        <div class="form-group">
          <label for="tipo-pergunta-${exercicioId}">Tipo de exercício</label>
          <select name="tipo-pergunta" class="form-control js-tipo-pergunta" data-exercicio="${exercicioId}" id="tipo-pergunta-${exercicioId}">
            <option value="">Tipo de exercício</option>
            <option value="pergunta-resposta">Pergunta-Resposta</option>
            <option value="escolha-multipla">Escolha múltipla</option>
            <option value="fill-in-the-blanks">Fill-in-the-blanks</option>
          </select>
        </div>
        <!-- Pergunta / Resposta -->
        <div class="pergunta-wrapper pergunta-resposta-wrapper hide">
          <div class="form-group">
            <label for="txtPerguntaRespostaPergunta-${exercicioId}">Pergunta</label>
            <input name="pergunta-resposta-pergunta" type="text" class="form-control"
              id="txtPerguntaRespostaPergunta-${exercicioId}" placeholder="Pergunta" />
          </div>
          <div class="form-group">
            <label for="txtPerguntaRespostaResposta-${exercicioId}">Resposta</label>
            <input name="pergunta-resposta-resposta" type="text" class="form-control"
              id="txtPerguntaRespostaResposta-${exercicioId}" placeholder="Resposta" />
          </div>
        </div>
        <!-- Escolha múltipla -->
        <div class="pergunta-wrapper escolha-multipla-wrapper hide">
          <div class="form-group">
            <label for="txtEscolhaMultiplaPergunta-${exercicioId}">Pergunta de escolha múltipla</label>
            <input name="escolha-multipla-pergunta" type="text" class="form-control"
              id="txtEscolhaMultiplaPergunta-${exercicioId}" placeholder="Pergunta" />
          </div>
          <div class="col-12">
            <label>Opções de respostas</label>
            <div class="input-group mb-3">
              <input name="nova-resposta-em" type="text" class="form-control nova-resposta-em"
                placeholder="Adiciona uma resposta..." />
              <div class="input-group-append">
                <button class="btn btn-outline-info js-adicionar-opcao" type="button" style="height: 100%;">Adicionar
                  Opção</button>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12 mb-3">
              <ul class="list-group">
              </ul>
            </div>
          </div>
          <div class="form-group">
            <label for="txtEscolhaMultiplaCerta-${exercicioId}">Resposta correta</label>
            <input name="escolha-multipla-certa" type="text" class="form-control"
              id="txtEscolhaMultiplaCerta-${exercicioId}" placeholder="Resposta correta" />
          </div>
        </div>
        <!-- Fill-in-the-blanks -->
        <div class="pergunta-wrapper fill-in-the-blanks-wrapper hide">
          <div class="form-group">
            <label for="txtFillTheBlanksPergunta-${exercicioId}">Pergunta de fill-in-the-blanks</label>
            <textarea type="text" name="fill-the-blanks-pergunta" class="form-control"
              id="txtFillTheBlanksPergunta-${exercicioId}"
              placeholder="Utilize ## para definir onde deve aparecer uma caixa de texto"></textarea>
          </div>
          <div class="col-12">
            <label>Respostas para fill-in-the-blanks</label>
            <div class="input-group mb-3">
              <input name="nova-resposta-fitb" type="text" class="form-control nova-resposta-fitb"
                placeholder="Adiciona uma palavra..." />
              <div class="input-group-append">
                <button class="btn btn-outline-info js-adicionar-opcao" type="button" style="height: 100%;">Adicionar
                  Palavra</button>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12 mb-3">
              <ul class="list-group">
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`));
}

function addNivel() {
  const nivelId = uid();
  var niveisPlaceholder = document.querySelector(".niveis-placeholder");
  niveisPlaceholder.appendChild(createElementFromHTML(`
    <div
      class="nivel-wrapper nivel-wrapper-${nivelId} mb-4 card"
      data-nivel-id="${nivelId}"
    >
      <h3>Nível<i class="fa-solid fa-trash js-remover-nivel" data-nivel-id="${nivelId}"></i></h3>
      <div class="video-wrapper card">
        <h3>Sumário</h3>
        <div class="row mb-3">
          <div class="col-6">
            <div class="form-group">
              <label for="txtIntroducao-${nivelId}">Introdução</label>
              <textarea name="introducao" required min="3" class="form-control nivel-introducao" id="txtIntroducao-${nivelId}"
                placeholder="Introdução"></textarea>
            </div>
          </div>
          <div class="col-6">
            <div class="form-group">
              <label for="txtExperiencia-${nivelId}">Experiência</label>
              <input name="experiencia" type="number" required class="form-control nivel-experiencia" id="txtExperiencia-${nivelId}"
                placeholder="Experiência" />
            </div>
          </div>
        </div>
      </div>
      <div class="video-wrapper card">
        <h3>Vídeo</h3>
        <div class="row mb-3">
          <div class="col-6">
            <div class="form-group">
              <label for="txtVideoUrl-${nivelId}">Url</label>
              <input name="videoUrl" type="text" required min="3" class="form-control video-url" id="txtVideoUrl-${nivelId}"
                placeholder="Url" />
            </div>
            <div class="form-group">
              <label for="txtVideoTitulo-${nivelId}">Título</label>
              <input name="videoTitulo" type="text" required min="3" class="form-control video-titulo" id="txtVideoTitulo-${nivelId}"
                placeholder="Título" />
            </div>
          </div>
        </div>
        <div class="adicionar-etiqueta-wrapper">
          <div class="row">
            <div class="col-12">
              <label>Etiquetas</label>
              <div class="input-group mb-3">
                <input name="nova-etiqueta" type="text" class="form-control nova-etiqueta" placeholder="Adiciona uma etiqueta..." />
                <input name="nova-etiqueta-time" class="form-control nova-etiqueta-time" value="00:00:00" type="time" step="1">
                <div class="input-group-append">
                  <button class="btn btn-outline-info js-adicionar-etiqueta" type="button" style="height: 100%;">Adicionar
                    Opção</button>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12 mb-3">
              <ul class="list-group">
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="exercicios-placeholder"></div>
      <div class="row novo-exercicio-row">
        <div class="col-12 mb-3">
          <button class="btn btn-primary js-add-exercicio">Novo exercicio</button>
        </div>
      </div>
    </div>
  `));
  addExercicio(nivelId);
};

addNivel();

if (params.edit) {
  document.querySelector('.js-criar-tutorial-titulo').innerHTML = 'Editar Tutorial';
  document.querySelector('.js-criar-tutorial-descricao').innerHTML = 'Utilize este formulário para editar o tutorial.';
  document.querySelector('.js-btn-criar-tutorial').innerHTML = 'Editar tutorial';
  document.querySelector('.js-btn-remover-tutorial').classList.remove('hide');



  const tutorials = Tutorial.getTutorials();
  const tutorial = tutorials.find(tutorial => tutorial.id === params.edit);
  if (tutorial) {
    console.log('tutorial', tutorial);
    document.querySelector('#txtTitulo').value = tutorial.titulo;
    document.querySelector('#txtDescricao').value = tutorial.descricao;
    document.querySelector('#txtImagem').value = tutorial.imagem;
    tutorial.tags.forEach(tag => {
      document.querySelector('#txtNovaTag').value = tag;
      document.querySelector('.js-nova-tag').click();
    })

    tutorial.niveis.forEach((nivel, idx) => {
      if (idx > 0) {
        document.querySelector('.js-add-nivel').click();
      }

      const nivelWrapper = document.querySelector(`.niveis-placeholder > :nth-child(${idx + 1})`);
      nivelWrapper.querySelector('textarea[name="introducao"]').innerHTML = nivel.intro;
      nivelWrapper.querySelector('input[name="experiencia"]').value = nivel.experiencia;
      nivelWrapper.querySelector('input[name="videoUrl"]').value = nivel.video.url;
      nivelWrapper.querySelector('input[name="videoTitulo"]').value = nivel.video.titulo;

      nivel.video.etiquetas.forEach(opcao => {
        nivelWrapper.querySelector('.nova-etiqueta').value = opcao.nome;
        nivelWrapper.querySelector('.nova-etiqueta-time').value = opcao.tempo;
        nivelWrapper.querySelector('.js-adicionar-etiqueta').click();
      });

      nivel.exercicios.forEach((exercicio, idx) => {
        if (idx > 0) {
          nivelWrapper.querySelector('.js-add-exercicio').click();
        }

        const exercicioWrapper = nivelWrapper.querySelector(`.exercicios-placeholder > :nth-child(${idx + 1})`);
        exercicioWrapper.querySelector('.js-tipo-pergunta').value = exercicio.tipo;
        exercicioWrapper.querySelector('.js-tipo-pergunta').click();

        // escolha multipla
        const escolhaMultiplaWrapper = exercicioWrapper.querySelector('.escolha-multipla-wrapper');
        escolhaMultiplaWrapper.querySelector('input[name="escolha-multipla-pergunta"]').value = exercicio.escolhaMultiplaPergunta || '';
        escolhaMultiplaWrapper.querySelector('input[name="escolha-multipla-certa"]').value = exercicio.escolhaMultiplaCerta || '';
        exercicio.escolhaMultiplaOpcoes.forEach(opcao => {
          escolhaMultiplaWrapper.querySelector('.nova-resposta-em').value = opcao;
          escolhaMultiplaWrapper.querySelector('.js-adicionar-opcao').click();
        });

        // Fill in the blanks
        const FITBWrapper = exercicioWrapper.querySelector('.fill-in-the-blanks-wrapper');
        FITBWrapper.querySelector('textarea[name="fill-the-blanks-pergunta"]').innerHTML = exercicio.fillTheBlanksPergunta || '';
        exercicio.fillTheBlanksResposta.forEach(opcao => {
          FITBWrapper.querySelector('.nova-resposta-fitb').value = opcao;
          FITBWrapper.querySelector('.js-adicionar-opcao').click();
        });

        // Pergunta/Resposta
        const perguntaRespostaWrapper = exercicioWrapper.querySelector('.pergunta-resposta-wrapper');
        perguntaRespostaWrapper.querySelector('input[name="pergunta-resposta-pergunta"]').value = exercicio.perguntaRespostaPergunta || '';
        perguntaRespostaWrapper.querySelector('input[name="pergunta-resposta-resposta"]').value = exercicio.perguntaRespostaResposta || '';
      });
    });
  }

  document.querySelector('#txtTitulo').focus();
}

function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes.
  return div.firstChild;
}
