document.getElementById("formQuiz").addEventListener("submit", async function (event) {
    event.preventDefault(); // Previne o recarregamento da página

    async function iniciarQuiz() {
        try {
            // Escondendo o formulário
            const formQuiz = document.getElementById('formQuiz');
            if (formQuiz) {
                formQuiz.style.display = 'none';
            }
            exibirCarregando(true); // Mostrar mensagem de carregamento

            const tema = document.getElementById("tema").value;
            const dificuldade = document.querySelector("input[name='dificuldade']:checked").value;

            // Fazendo a requisição ao endpoint Flask
            const response = await fetch('/quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tema, dificuldade })
            });

            if (!response.ok) {
                throw new Error('Erro ao carregar o quiz');
            }

            // Recebendo o JSON do backend
            const quizData = await response.json();

            // Renderizando o quiz no frontend
            renderizarQuiz(quizData);

        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao carregar o quiz. Tente novamente.');
            reiniciarQuiz();
        } finally {
            exibirCarregando(false); // Esconder mensagem de carregamento
        }
    }

    function exibirCarregando(mostrar) {
        const carregandoElement = document.getElementById("carregando");
        if (mostrar) {
            carregandoElement.style.display = "flex";
        } else {
            carregandoElement.style.display = "none";
        }
    }

    function renderizarQuiz(quizData) {
        // Mostrando o container do quiz
        const quizContainer = document.querySelector('.quiz-container');
        quizContainer.style.display = 'block';

        // Atualizando a pergunta
        const perguntaElement = document.getElementById('pergunta');
        perguntaElement.textContent = quizData.pergunta;

        // Atualizando as alternativas
        const opcoes = document.querySelectorAll('.opcao');
        quizData.alternativas.forEach((alternativa, index) => {
            const opcaoElement = opcoes[index];
            opcaoElement.textContent = alternativa.texto;
            opcaoElement.onclick = () => verificarResposta(alternativa.correta);
        });
    }

    function verificarResposta(correta) {
        if (correta) {
            alert('Resposta correta!');
        } else {
            alert('Resposta incorreta.');
        }

        // Reiniciar ou carregar novo quiz (opcional)
        reiniciarQuiz();
    }

    function reiniciarQuiz() {
        document.getElementById('formQuiz').style.display = 'block';
        document.querySelector('.quiz-container').style.display = 'none';

        // Opcional: limpar os textos das perguntas e alternativas
        document.getElementById('pergunta').textContent = '';
        const opcoes = document.querySelectorAll('.opcao');
        opcoes.forEach(opcao => opcao.textContent = '');
    }

    iniciarQuiz();
});
