import * as User from "../models/User.js";
import { delegate, showToast } from "../main.js";

const updateFormulario = () => {
  const user = User.getUserLogged();
  if (user) {
    const form = document.querySelector('.js-perfil-form');
    form.querySelector('.js-pontos').innerHTML = user.getPontos();
    form.querySelector('.js-tutoriais-concluidos').innerHTML = Object.keys(user.getTutoriaisConcluidos()).length;
    form.querySelector('#txtNomeEdit').value = user.getNome();
    form.querySelector('#txtDataNascimentoEdit').value = user.getDataNascimento();
    form.querySelector('#txtSexoEdit').value = user.getSexo();
    form.querySelector('#txtLocalidadeEdit').value = user.getLocalidade();
    form.querySelector('#txtEmailEdit').value = user.getEmail();
  }
}

updateFormulario();


// CLICAR NO BOTÃO DE GUARDAR
delegate(document, 'submit', '.js-perfil-form', (event) => {
  event.preventDefault();
  const user = User.getUserLogged();

  // Guardar os dados de utilizador
  if (user) {
    const form = document.querySelector('.js-perfil-form');
    user.setNome(form.querySelector('#txtNomeEdit').value.trim());
    user.setDataNascimento(form.querySelector('#txtDataNascimentoEdit').value.trim());
    user.setSexo(form.querySelector('#txtSexoEdit').value.trim());
    user.setLocalidade(form.querySelector('#txtLocalidadeEdit').value.trim());
    user.setEmail(form.querySelector('#txtEmailEdit').value.trim());

    // Atualizar password caso tenha sido alterada
    const password = form.querySelector('#txtPasswordEdit').value.trim();
    const passwordConfirm = form.querySelector('#txtConfirmPasswordEdit').value.trim();
    if (password.length > 0) {
      if (password == passwordConfirm) {
        user.setPassword(password);
      } else {
        return showToast('A password e confirmação de password devem ser iguais.', 'danger');
      }
    }

    User.atualizarUser(user);
  }

  showToast('Dados atualizados com sucesso.', 'success');
  window.setTimeout(() => window.location.reload(), 2000);
});
