import * as User from "../models/User.js";

const renderTabelaRanking = () => {
  const sortedUsers = User.getAllUsers()?.sort((userA, userB) => userB.pontos - userA.pontos);

  const tableRows = sortedUsers.map((user, idx) => {
    return `
      <tr>
        <th>${idx + 1}</td>
        <td>${user.getNome()}</td>
        <td>${user.getPontos()}</td>
      </tr>
    `;
  }).join('');

  document.querySelector('#tabelaRanking tbody').innerHTML = '';
  document.querySelector('#tabelaRanking tbody')?.insertAdjacentHTML('beforeend', tableRows);
}

renderTabelaRanking();
