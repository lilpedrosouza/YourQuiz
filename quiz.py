from flask import Flask, render_template, request
import json
import openai
from openai import OpenAIError
from dotenv import load_dotenv, find_dotenv

_ = load_dotenv(find_dotenv())

app = Flask(__name__)

client = openai.Client()


@app.route("/")
def pagina_principal():
    return render_template("index.html")




@app.route("/quiz", methods=["POST"])
def quiz():
    dados = request.get_json()
    tema = dados.get("tema")
    dificuldade = dados.get("dificuldade")
    
    prompt = f"""
    Gere uma pergunta de quiz sobre o tema "{tema}" de nível "{dificuldade}".
    Retorne no formato JSON:
    {{
      "pergunta": "Aqui está a pergunta gerada",
      "alternativas": ["Opção 1", "Opção 2", "Opção 3", "Opção 4"],
      "correta": "Opção correta"
    }}
    """
    try:
        response = openai.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "system", "content": "Você é um gerador de quizzes."},
                        {"role": "user", "content": prompt}],
            temperature=0.7
        )
        
        print(response)
        # Acessando o conteúdo correto do objeto retornado
        message_content = response.choices[0].message.content
        
        # Obtemos o JSON inicial gerado pela API
        quiz_data_raw = json.loads(message_content)
        
        quiz_data = {
            "pergunta": quiz_data_raw["pergunta"],
            "alternativas": [
                { "texto": alternativa, "correta": alternativa == quiz_data_raw["correta"] }
                for alternativa in quiz_data_raw["alternativas"]
            ]
        }
        # Passar dados para o HTML
        return json.dumps(quiz_data, ensure_ascii=False), 200, {'Content-Type': 'application/json'}
    
    except OpenAIError as e:
        print(f"Erro: {e}")
        return json.dumps({"error": "Erro ao gerar o quiz. Tente novamente."}, ensure_ascii=False), 500, {'Content-Type': 'application/json'}
 
















if __name__ == "__main__":
    app.run(debug=True)