// import * as User from "../models/UserModel.js";
import * as User from "../models/User.js";
import * as Tutoriais from "../models/Tutorial.js";
import { delegate, showToast } from "../main.js";

function catalogView() {
  renderCatalog(Tutoriais.getTutorials());

  // CLICAR NO BOTÃO FILTRAR
  document.querySelector("#btnFilter").addEventListener("click", () => {
    const tutoriais = Tutoriais.getTutorials();
    const titulo = document.querySelector("#txtTituloFiltro").value;
    renderCatalog(tutoriais.filter(tutorial => tutorial.getTitulo().toUpperCase().indexOf(titulo.toUpperCase()) !== -1));
  });

  // CLICAR NO BOTÃO ORDENAR
  document.querySelector("#btnSort").addEventListener("click", () => {
    Tutoriais.sortTutorials();
    renderCatalog(Tutoriais.getTutorials());
  });
}

// EXIBIR O CATÁLOGO DE TUTORIALS
function renderCatalog(tutorials = []) {
  let result = "";
  for (const tutorial of tutorials) {
    result += generateCard(tutorial);
  }
  // Atribuição de todos os cards gerados ao elemento com id listagem-tutoriais
  document.querySelector("#listagem-tutoriais").innerHTML = result;
}

// GERAR CARTÃO COM O TUTORIAL
function generateCard(tutorial) {
  const user = User.getUserLogged();
  const favorito = user?.favoritos?.includes(tutorial.id);

  const tags = `<div class="tutorial-tags-wrapper">
                  ${tutorial.tags.map(tag => {
    return `<button type="button" class="btn btn-sm btn-outline-secondary tutorial-tag js-tutorial-tag" data-tutorial-tag=${tag}>${tag}</button>`
  }).join('')}
                </div>`;
  const editar = user && user.isAdmin()
    ? `<a href="/app/adicionar-tutorial/?edit=${tutorial.id}"><i class="fa-solid fa-pen-to-square"></i></a>`
    : '';

  const concluido = user && tutorial.getNiveis().length == user.getTutoriaisConcluidos()?.[tutorial.id]?.length;

  let result = `
        <div class="col">
            <div class="card mb-3" style="widht: 300px; ">
                <img src="${tutorial.imagem}" class="card-img-top" style="height: 300px;">
                <div class="tutorial-condluido js-tutorial-concluido ${concluido ? '' : 'hide'}">Tutorial Concluido</div>
                ${editar}
                <i class="fa-solid js-add-favoritos fa-heart ${favorito ? 'active' : ''}" data-tutorial-id="${tutorial.id}"></i>
                <div class="card-body">
                    <h5 class="card-title">
                      <a href="/app/tutorial?id=${tutorial.id}">
                        ${tutorial.titulo}
                      </a>
                    </h5>
                    <p class="card-text">${tutorial.descricao}</p>
                    ${tags || ''}
                    <a href="/app/tutorial?id=${tutorial.id}" id="${tutorial.titulo}" class="btn btn-primary view">Ver mais</a>
                </div>
            </div>
        </div> `;
  return result;
}

// Adicionar tutorial aos favoritos
delegate(document, 'click', '.js-add-favoritos', (event) => {
  const tutorialId = event.target.dataset.tutorialId;
  const user = User.getUserLogged();
  if (!user) {
    return showToast('Por favor inicie sessão para adicionar favoritos.', 'danger');
  }

  if (user.getFavoritos().includes(tutorialId)) {
    user.removeFavorito(tutorialId);
    event.target.classList.remove('active');
  } else {
    user.addFavorito(tutorialId);
    event.target.classList.add('active');
  }
});

// Filtrar os resultados pelos favoritos
delegate(document, 'click', '.js-button-favoritos', (event) => {
  event.preventDefault();
  const button = event.target.closest('button');
  const user = User.getUserLogged();
  const tutoriais = Tutoriais.getTutorials();

  if (!user) {
    return;
  }

  if (button.classList.contains('active')) {
    button.classList.remove('active');
    renderCatalog(tutoriais);
  } else {
    button.classList.add('active');
    renderCatalog(tutoriais.filter(tutorial => user.getFavoritos().includes(tutorial.id)));
  }
});

// Filtrar os resultados pelo tags select
delegate(document, 'change', '#sltTags', event => {
  event.preventDefault();
  const tag = event.target.closest('select').value;
  const tutoriais = Tutoriais.getTutorials();

  if (tag.length == 0) {
    return renderCatalog(tutoriais);
  }

  renderCatalog(tutoriais.filter(tutorial => tutorial.tags.includes(tag)));
});

// Filtrar os resultados pelo tags do card
delegate(document, 'click', '.js-tutorial-tag', (event) => {
  event.preventDefault();
  const tag = event.target.closest('button').dataset.tutorialTag;
  const tutoriais = Tutoriais.getTutorials();

  // atualizar o select
  document.querySelector('#sltTags').value = tag;
  document.querySelector('#sltTags').click();

  renderCatalog(tutoriais.filter(tutorial => tutorial.tags.includes(tag)));
});


const tags = Tutoriais.getTutorials()
  .map(tutorial => tutorial.getTags()) // extrair tags
  .reduce((acc, curr) => [...acc, ...curr], []) // flatten array
  .reduce((acc, curr) => { // remover duplicados
    if (acc.indexOf(curr) === -1) {
      acc.push(curr)
    }
    return acc;
  }, []);

document.querySelector('#sltTags').innerHTML = '<option value="">Tags</option>';
document.querySelector('#sltTags').innerHTML += tags.map(tag => `<option value="${tag}">${tag}</option>`);


catalogView();
