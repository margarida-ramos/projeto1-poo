import {
  addTutorial
} from "./models/Tutorial.js";

initdata();

function initdata() {
  // USERS
  if (!localStorage.users) {
    const users = [
      {
        activo: true,
        dataNascimento: "1992-07-29",
        email: "a",
        favoritos: [],
        id: "9rlllln1hy40apn2bljm8312",
        localidade: "Póvoa de Varzim",
        nome: "Utilizador Admin",
        password: "a",
        role: "admin",
        sexo: "female",
        pontos: 30,
      },
      {
        activo: true,
        dataNascimento: "1992-07-29",
        email: "b",
        favoritos: [],
        id: "9rlllln1hy40apn2bljm8313",
        localidade: "Póvoa de Varzim",
        nome: "Utilizador normal",
        password: "b",
        role: "user",
        sexo: "male",
        pontos: 10,
      },
    ];

    localStorage.setItem("users", JSON.stringify(users));
  }

  if (!localStorage.tutorials) {
    addTutorial({
      "titulo": "Git Tutorial for Beginners",
      "imagem": "/img/tut1.png",
      "descricao": "Git tutorial for beginners - Learn Git for a career in DevOps/Software Engineering. This Git tutorial teaches you everything you need to learn Git basics.",
      "tags": [
        "Git",
        "DevOps",
        "Programming"
      ],
      "niveis": [{
        "intro": `Git is a fast, scalable, distributed revision control system with an unusually rich command set that provides both high-level operations and full access to internals.<br><br>        See gittutorial to get started, then see giteveryday for a useful minimum set of commands. The Git User’s Manual has a more in-depth introduction.<br><br>        After you mastered the basic concepts, you can come back to this page to learn what commands Git offers. You can learn more about individual Git commands with "git help command". gitcli manual page gives you an overview of the command-line command syntax.<br><br>        A formatted and hyperlinked copy of the latest Git documentation can be viewed at https://git.github.io/htmldocs/git.html or https://git-scm.com/docs.`,
        "experiencia": "10",
        "video": {
          "url": "LearnGit.mp4",
          "titulo": "Learn Git In 15 Minutes",
          "etiquetas": [{
            "nome": "Introduction",
            "tempo": "00:00:00"
          },
          {
            "nome": "What is Git?",
            "tempo": "00:00:35"
          },
          {
            "nome": "Using Git",
            "tempo": "00:03:07"
          },
          {
            "nome": "Installing Git",
            "tempo": "00:06:11"
          },
          {
            "nome": "Configuring Git",
            "tempo": "00:07:38"
          },
          {
            "nome": "Getting Help",
            "tempo": "00:12:43"
          },
          {
            "nome": "Cheat Sheet",
            "tempo": "00:13:35"
          },
          {
            "nome": "Taking Snapshots",
            "tempo": "00:14:05"
          },
          {
            "nome": "Initializing a Repository",
            "tempo": "00:14:38"
          },
          {
            "nome": "Git Workflow",
            "tempo": "00:17:10"
          },
          {
            "nome": "Staging Files",
            "tempo": "00:21:46"
          },
          {
            "nome": "Committing Changes",
            "tempo": "00:25:24"
          },
          {
            "nome": "Committing Best Practices",
            "tempo": "00:27:37"
          },
          {
            "nome": "Skipping the Staging Area",
            "tempo": "00:30:21"
          },
          {
            "nome": "Removing Files",
            "tempo": "00:31:46"
          },
          {
            "nome": "Renaming or Moving Files",
            "tempo": "00:33:48"
          },
          {
            "nome": "Ignoring Files",
            "tempo": "00:36:06"
          },
          {
            "nome": "Short Status",
            "tempo": "00:42:41"
          },
          {
            "nome": "Viewing the Staged and Unstaged Changes",
            "tempo": "00:45:33"
          },
          {
            "nome": "Visual Diff Tools",
            "tempo": "00:50:33"
          },
          {
            "nome": "Viewing the History",
            "tempo": "00:55:27"
          },
          {
            "nome": "Viewing a Commit",
            "tempo": "00:57:39"
          },
          {
            "nome": "Unstaging Files",
            "tempo": "01:01:37"
          },
          {
            "nome": "Discarding Local Changes",
            "tempo": "01:04:28"
          },
          {
            "nome": "Restoring a File to an Earlier Version",
            "tempo": "01:06:17"
          }
          ],
        },
        "exercicios": [{
          "tipo": "pergunta-resposta",
          "perguntaRespostaPergunta": "Quando foi criado o GIT?",
          "perguntaRespostaResposta": "2005",
          "escolhaMultiplaPergunta": "",
          "escolhaMultiplaOpcoes": [],
          "escolhaMultiplaCerta": "",
          "fillTheBlanksPergunta": "",
          "fillTheBlanksResposta": []
        },
        {
          "tipo": "fill-in-the-blanks",
          "perguntaRespostaPergunta": "",
          "perguntaRespostaResposta": "",
          "escolhaMultiplaPergunta": "",
          "escolhaMultiplaOpcoes": [],
          "escolhaMultiplaCerta": "",
          "fillTheBlanksPergunta": "Para criar um novo branch, utilizamos o comando `git ## -b NOME_DO_BRANCH`",
          "fillTheBlanksResposta": ["checkout"]
        },
        {
          "tipo": "escolha-multipla",
          "perguntaRespostaPergunta": "",
          "perguntaRespostaResposta": "",
          "escolhaMultiplaPergunta": "Qual é a resposta certa?",
          "escolhaMultiplaOpcoes": ["resposta 1", "resposta 2", "resposta 3"],
          "escolhaMultiplaCerta": "resposta 1",
          "fillTheBlanksPergunta": "",
          "fillTheBlanksResposta": []
        }
        ]
      },]
    });

    addTutorial({
      "titulo": "Tutorial exemplo",
      "imagem": "/img/tut2.jpeg",
      "descricao": "Aprenda GIT em menos de 10 minutos com este guia prático de como manter o seu repositório estável.",
      "tags": [
        "Git",
        "Easy",
      ],
      "niveis": [{
        "intro": "Uma introdução para o tutorial exemplo",
        "experiencia": "20",
        "video": {
          "url": "Muppets.mp4",
          "titulo": "Learn Git In 20 Minutes"
        },
        "exercicios": [{
          "tipo": "pergunta-resposta",
          "perguntaRespostaPergunta": "Quando foi criado o GIT?",
          "perguntaRespostaResposta": "2005",
          "escolhaMultiplaPergunta": "",
          "escolhaMultiplaOpcoes": [],
          "escolhaMultiplaCerta": "",
          "fillTheBlanksPergunta": "",
          "fillTheBlanksResposta": []
        },
        {
          "tipo": "fill-in-the-blanks",
          "perguntaRespostaPergunta": "",
          "perguntaRespostaResposta": "",
          "escolhaMultiplaPergunta": "",
          "escolhaMultiplaOpcoes": [],
          "escolhaMultiplaCerta": "",
          "fillTheBlanksPergunta": "Para criar um novo branch, utilizamos o comando `git ## -b NOME_DO_BRANCH`",
          "fillTheBlanksResposta": ["checkout"]
        }
        ]
      },
      {
        "intro": "Mais uma voltinha no tutorial 2",
        "experiencia": "20",
        "video": {
          "url": "World.mp4",
          "titulo": "Learn Git In 20 Minutes - Parte 2"
        },
        "exercicios": [{
          "tipo": "pergunta-resposta",
          "perguntaRespostaPergunta": "O que começa com COMM e acaba em IT?",
          "perguntaRespostaResposta": "COMMIT",
          "escolhaMultiplaPergunta": "",
          "escolhaMultiplaOpcoes": [],
          "escolhaMultiplaCerta": "",
          "fillTheBlanksPergunta": "",
          "fillTheBlanksResposta": []
        },
        ]
      },]
    });
  }
}
