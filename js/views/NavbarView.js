import * as User from "../models/User.js";
import { delegate } from "../main.js";

function navbarView() {
  User.init();

  // CONSTRUIR CONTEÚDO DA NAVBAR (VERIFICAR SE USER AUTENTICADO)
  let result = `
      <a class="navbar-brand ml-2 mx-3" href="/">
        <img src="/img/logo.png" style="height:56px"/>
      </a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
          <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="collapsibleNavbar">
  `;

  result += `<!-- Botão para voltar à homepage -->
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item me-4">
            <a href="/" class="text-primary">
                Inicio
            </a>
        </li>
        <!-- Botão de adicionar novo tutorial -->
        <li class="nav-item">
            <a href="#" class="text-primary" data-bs-toggle="modal" data-bs-target="#mdlRanking">
                Ranking
            </a>
        </li>
      </ul>`;

  if (User.isLogged()) {
    const user = User.getUserByEmail(User.getUserLogged()?.email);

    if (user.isAdmin()) {
      result += `<!-- Botão para ativar a modal de gerir utilizadores -->
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item me-4">
                    <a href="#" class="text-primary" data-bs-toggle="modal" data-bs-target="#mdlGerirUtilizadores">
                        Gerir Utilizadores
                    </a>
                </li>
                <!-- Botão de adicionar novo tutorial -->
                <li class="nav-item">
                    <a href="/app/adicionar-tutorial" class="text-primary">
                        Adicionar Tutorial
                    </a>
                </li>
              </ul>`;
    }

    result += `<!-- Descrição do utilizador autenticado -->
            <ul class="navbar-nav ms-auto me-3">
              <li class="nav-item px-3">
                Olá <a href="#" data-bs-toggle="modal" data-bs-target="#mdlPerfil">${user.getNome()}</a> <br>
                Pontos: ${user.getPontos()}
              </li>
              <li class="nav-item">
                <button id="btnLogout" class="btn btn-outline-warning m-2 my-sm-0">
                  Logout
                </button>
              </li>
            </ul>`;
  } else {
    result += `

                    <!-- Botão para ativar a janela modal de login -->
                    <ul class="navbar-nav ms-auto me-3">
                      <li class="nav-item">
                          <button class="btn btn-outline-warning m-1" data-bs-toggle="modal" data-bs-target="#mdlLogin">
                              Login
                          </button>
                          <button class="btn btn-outline-warning m-1" data-bs-toggle="modal" data-bs-target="#mdlRegisto">
                              Registar
                          </button>
                      </li>
                    </ul>
                `;
  }
  result += `</div>`;

  // INJETAR CONTEÚDO NA NAVBAR
  document.querySelector("nav").innerHTML = result;

  // CLICAR NO BOTÃO DE REGISTAR
  delegate(document, 'submit', '#frmRegisto', (event) => {
    event.preventDefault();
    // Gestão do formulário de Registo
    const txtNome = document.getElementById('txtNome');
    const txtDataNascimento = document.getElementById('txtDataNascimento');
    const txtSexo = document.getElementById('txtSexo');
    const txtLocalidade = document.getElementById('txtLocalidade');
    const txtEmail = document.getElementById('txtEmail');
    const txtPassword = document.getElementById('txtPassword');
    const txtConfirmPassword = document.getElementById('txtConfirmPassword');

    try {
      if (txtPassword.value !== txtConfirmPassword.value) {
        throw Error("Password e Confirmação de Password não correspondem.");
      }
      User.add(
        txtNome.value,
        txtDataNascimento.value,
        txtSexo.value,
        txtLocalidade.value,
        txtEmail.value,
        txtPassword.value
      );

      displayMessage(
        "msgRegisto",
        "User registado com sucesso!",
        "success"
      );
      // Wait 1 second before reloading, so the user can see the login success message
      setTimeout(() => {
        location.reload();
      }, 1000);
    } catch (e) {
      displayMessage("msgRegisto", e.message, "danger");
    }
  });

  // CLICAR NO BOTÃO DE LOGIN
  delegate(document, 'submit', '#frmLogin', (event) => {
    event.preventDefault();
    try {
      User.login(
        document.getElementById("txtLoginEmail").value,
        document.getElementById("txtLoginPassword").value
      );
      displayMessage("msgLogin", "User logged efetuado com sucesso!", "success");
      // Wait 1 second before reloading, so the user can see the login success message
      setTimeout(() => {
        location.reload();
      }, 1000);
    } catch (e) {
      displayMessage("msgLogin", e.message, "danger");
    }
  });

  // CLICAR NO BOTÃO LOGOUT (O BOTÃO PODE NÃO EXISTIR POR ISSO USAR "?"" - OPTIONAL CHAINING)
  delegate(document, 'click', '#btnLogout', (event) => {
    User.logout();
    location.reload();
  });
}

function displayMessage(modal, message, type) {
  const divMessage = document.getElementById(modal);
  divMessage.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
  setTimeout(() => {
    divMessage.innerHTML = "";
  }, 2000);
}

navbarView();
