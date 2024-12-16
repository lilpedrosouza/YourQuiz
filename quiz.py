from flask import Flask, render_template, request, jsonify
import json
import openai
from dotenv import load_dotenv, find_dotenv

_ = load_dotenv(find_dotenv())

app = Flask(__name__)

@app.route("/")
def pagina_principal():
    return render_template("index.html")

@app.route("/quiz", methods=["POST"])
def quiz():
    dados = request.get_json()
    tema = dados.get("tema", "Tema genérico")
    dificuldade = dados.get("dificuldade", "intermediário")
    
    prompt = f"""
    Você é um gerador de quizzes. Gere 10 perguntas de quiz sobre o tema "{tema}" com nível de dificuldade "{dificuldade}".
    Cada pergunta deve conter:
    - Um texto para a pergunta.
    - Quatro alternativas únicas e consistentes.
    - A resposta correta.
    O JSON deve seguir estritamente este formato:

    [
        {{
            "id": 1,
            "pergunta": "Aqui está a pergunta gerada para o tema '{tema}'",
            "alternativas": ["Opção 1", "Opção 2", "Opção 3", "Opção 4"],
            "correta": "Opção correta"
        }},
        {{
            "id": 2,
            "pergunta": "Outra pergunta para o tema '{tema}'",
            "alternativas": ["Opção 1", "Opção 2", "Opção 3", "Opção 4"],
            "correta": "Opção correta"
        }},
        ...
        {{
            "id": 10,
            "pergunta": "Décima pergunta para o tema '{tema}'",
            "alternativas": ["Opção 1", "Opção 2", "Opção 3", "Opção 4"],
            "correta": "Opção correta"
        }}
    ]

    Retorne apenas o JSON no formato especificado acima, sem explicações adicionais.
    """

    try:
        model = "gpt-3.5-turbo" if dificuldade in ["basico", "intermediario"] else "gpt-4-turbo"
        response = openai.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "Você é um gerador de quizzes."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5
            )

        
        # Extraindo o conteúdo do JSON
        message_content = response.choices[0].message.content.strip()
        quiz_data_raw = json.loads(message_content)
        
        # Estruturando o JSON para o front-end
        quiz_data = [
            {
                "id": pergunta["id"],
                "pergunta": pergunta["pergunta"],
                "alternativas": [
                    {"texto": alternativa, "correta": alternativa == pergunta["correta"]}
                    for alternativa in pergunta["alternativas"]
                ]
            }
            for pergunta in quiz_data_raw
        ]
        
        
        # Retornando o JSON estruturado
        print(quiz_data)
        return jsonify(quiz_data), 200

    except json.JSONDecodeError as e:
        print(f"Erro ao processar JSON gerado: {e}")
        return jsonify({"error": "Erro ao gerar o quiz. O formato do JSON gerado é inválido."}), 500

    except Exception as e:
        print(f"Erro inesperado: {e}")
        return jsonify({"error": "Erro inesperado ao gerar o quiz. Tente novamente mais tarde."}), 500

if __name__ == "__main__":
    app.run(debug=True)