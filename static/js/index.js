document.getElementById("formQuiz").addEventListener("submit", async function (event) {
    event.preventDefault(); // Previne o recarregamento da página

    let quizData = [];
    let perguntaAtual = 0;
    let acertos = 0;
    let erros = 0;

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
            quizData = await response.json();

            // Ordenar perguntas pelo id para garantir a sequência
            quizData.sort((a, b) => a.id - b.id);

            perguntaAtual = 0;
            acertos = 0;
            erros = 0;

            // Renderizando a primeira pergunta
            renderizarQuiz(quizData[perguntaAtual]);

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

    function renderizarQuiz(pergunta) {
        // Mostrando o container do quiz
        const quizContainer = document.querySelector('.quiz-container');
        quizContainer.style.display = 'block';
    
        // Atualizando a pergunta com a numeração
        const perguntaElement = document.getElementById('pergunta');
        perguntaElement.textContent = `${perguntaAtual + 1}: ${pergunta.pergunta}`; // Adiciona a numeração
    
        // Atualizando as alternativas
        const opcoes = document.querySelectorAll('.opcao');
        pergunta.alternativas.forEach((alternativa, index) => {
            const opcaoElement = opcoes[index];
            opcaoElement.textContent = alternativa.texto; // Acessando o texto da alternativa
    
            // Limpando estilos anteriores
            opcaoElement.style.backgroundColor = ''; 
            opcaoElement.style.pointerEvents = 'auto'; // Reativando o clique em novas perguntas
    
            // Associando a verificação de resposta ao botão
            opcaoElement.onclick = () => verificarResposta(alternativa.correta, opcaoElement, pergunta.alternativas);
        });
    }
    
    function verificarResposta(correta, opcaoSelecionada, alternativas) {
        const opcoes = document.querySelectorAll('.opcao');
    
        // Desativando cliques em outras alternativas
        opcoes.forEach(opcao => opcao.style.pointerEvents = 'none');
    
        // Mostrar feedback visual
        alternativas.forEach((alternativa, index) => {
            const opcaoElement = opcoes[index];
            if (alternativa.correta) {
                opcaoElement.style.backgroundColor = 'green'; // Alternativa correta
            }
        });
    
        if (!correta) {
            erros++;
            opcaoSelecionada.style.backgroundColor = 'red'; // Alternativa incorreta
        } else {
            acertos++;
        }
    
        // Esperar 1 segundo antes de passar para a próxima pergunta
        setTimeout(() => {
            perguntaAtual++;
            if (perguntaAtual < quizData.length) {
                renderizarQuiz(quizData[perguntaAtual]);
            } else {
                mostrarResultados();
            }
        }, 1000); // Atraso de 1 segundo (1000 ms)
    }
    

    function mostrarResultados() {
        // Esconder o quiz
        const quizContainer = document.querySelector('.quiz-container');
        quizContainer.style.display = 'none';

        // Mostrar o painel de resultados
        const resultadoContainer = document.getElementById('resultadoContainer');
        resultadoContainer.style.display = 'block';

        const acertosElement = document.getElementById('acertos');
        const errosElement = document.getElementById('erros');

        acertosElement.textContent = `Acertos: ${acertos}`;
        errosElement.textContent = `Erros: ${erros}`;
    }

    function reiniciarQuiz() {
        const button = document.getElementById('reiniciarQuizButton');
        if (button) {
            console.log('Botão encontrado!');
            // Exibir o formulário
            document.getElementById('formQuiz').style.display = 'block';
            document.querySelector('.quiz-container').style.display = 'none';
            document.getElementById('resultadoContainer').style.display = 'none';
    
            // Limpar textos
            document.getElementById('pergunta').textContent = '';
            const opcoes = document.querySelectorAll('.opcao');
            opcoes.forEach(opcao => opcao.textContent = '');
        } else {
            console.log('Botão não encontrado!');
        }
    }
    

    iniciarQuiz();
});
