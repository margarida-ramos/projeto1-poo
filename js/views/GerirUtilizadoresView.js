import * as User from "../models/User.js";
import { delegate, showToast } from "../main.js";

const renderTabelaUtilizadores = () => {
  const users = User.getAllUsers();

  const tableRows = users.map(user => {
    return `
      <tr>
        <td>${user.getNome()}</td>
        <td>${user.getEmail()}</td>
        <td>
          <input
            type="checkbox"
            data-user-id="${user.getId()}"
            class="activate-user"
            ${user.getActivo() === true && 'checked' || ''}>
          </input>
        </td>
        <td><i class="fa-solid fa-trash js-remover-utilizador" data-user-id="${user.getId()}"></i></td>
      </tr>
    `;
  }).join('');

  document.querySelector('#tabelaGerirUtilizadores tbody').innerHTML = '';
  document.querySelector('#tabelaGerirUtilizadores tbody')?.insertAdjacentHTML('beforeend', tableRows);
}

const toggleUserActivo = (userId) => {
  const users = User.getAllUsers();
  const user = users.find(user => user.getId() === userId);
  user.setActivo(!user.getActivo());

  User.saveAllUsers();
  showToast('Utilizador modificado com sucesso', 'success');
}

delegate(document, 'click', '.activate-user', (event) => {
  toggleUserActivo(event.target?.dataset?.userId);
});

delegate(document, 'click', '.js-remover-utilizador', (event) => {
  if (User.removerUser(event.target?.dataset?.userId)) {
    // remover linha da tabela
    event.target.closest('tr').remove();
  }
});

renderTabelaUtilizadores();
