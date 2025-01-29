# YourQuiz

YourQuiz é uma aplicação web interativa que gera quizzes personalizados com base no tema e no nível de dificuldade escolhido pelo usuário. O projeto utiliza Flask no backend e integra a API da OpenAI para gerar as perguntas e respostas dinamicamente.

![YourQuiz](YourQuiz/YourQuiz-Made-with-Clipchamp.gif)

## Tecnologias Utilizadas

- **Flask** - Framework web para Python.
- **OpenAI API** - Para gerar perguntas e respostas do quiz.
- **HTML, CSS e JavaScript** - Para a interface do usuário.
- **JSON** - Formato de resposta estruturada para os quizzes.

## Como Funciona

1. O usuário acessa a página principal e insere um tema e um nível de dificuldade.
2. O backend processa os dados e faz uma requisição à API da OpenAI para gerar as perguntas.
3. A API retorna um conjunto de perguntas com alternativas e a resposta correta.
4. O frontend exibe o quiz para o usuário responder.

## Como Executar o Projeto

1. Clone este repositório:
   ```sh
   git clone https://github.com/lilpedrosouza/YourQuiz.git
   cd YourQuiz
   ```
2. Crie um ambiente virtual e instale as dependências:
   ```sh
   python -m venv venv
   source venv/bin/activate  # No Windows use: venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Configure suas variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto e adicione:
     ```env
     OPENAI_API_KEY=sua_chave_aqui
     ```
4. Execute a aplicação:
   ```sh
   python app.py
   ```
5. Acesse no navegador: `http://127.0.0.1:5000`

## Estrutura do Projeto
```
YourQuiz/
│── templates/
│   └── index.html   # Página principal
│── static/
│   ├── styles.css   # Estilos da aplicação
│   └── script.js    # Interações do frontend
│── app.py           # Servidor Flask
│── requirements.txt # Dependências do projeto
│── .env             # Variáveis de ambiente (adicionar manualmente)
│── README.md        # Documentação do projeto
```

## API Endpoints

### `POST /quiz`
**Descrição:** Gera um quiz com base no tema e dificuldade escolhidos pelo usuário.

**Requisição:**
```json
{
  "tema": "Espaço sideral",
  "dificuldade": "difícil"
}
```

**Resposta:**
```json
[
  {
    "id": 1,
    "pergunta": "Qual é o maior planeta do sistema solar?",
    "alternativas": [
      {"texto": "Terra", "correta": false},
      {"texto": "Marte", "correta": false},
      {"texto": "Júpiter", "correta": true},
      {"texto": "Saturno", "correta": false}
    ]
  }
]
```


## Licença
Este projeto está licenciado sob a [MIT License](LICENSE).

---

Criado por [Pedro Souza](https://github.com/lilpedrosouza) 🚀

