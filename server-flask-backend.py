from flask import Flask, request, jsonify
from pymilvus import connections, FieldSchema, CollectionSchema, DataType, Collection
import face_recognition
import numpy as np

app = Flask(__name__)

# Função para conectar ao Milvus
def conectar_milvus():
    connections.connect("default", host="localhost", port="19530")

# Função para definir a coleção e recriá-la se necessário
def criar_colecao():
    fields = [
        FieldSchema(name="user_id", dtype=DataType.INT64, is_primary=True, auto_id=True),
        FieldSchema(name="face_encoding", dtype=DataType.FLOAT_VECTOR, dim=128)  # Assume-se que o encoding tem 128 dimensões
    ]
    schema = CollectionSchema(fields, description="Armazenamento de encodings faciais")
    collection = Collection(name="faces", schema=schema)

    # Criar um índice ANN (HNSW) para busca eficiente
    index_params = {
        "index_type": "HNSW",
        "metric_type": "L2",
        "params": {"M": 16, "efConstruction": 200}
    }
    collection.create_index("face_encoding", index_params)
    
    # Carregar a coleção na memória
    collection.load()

    return collection

# Inicializar conexão e coleção
conectar_milvus()
collection = criar_colecao()

# Rota para cadastrar um novo usuário
@app.route('/cadastrar_usuario', methods=['POST'])
def cadastrar_usuario():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    image_file = request.files['image']
    known_image = face_recognition.load_image_file(image_file)

    # Gera o encoding facial
    face_encodings = face_recognition.face_encodings(known_image)

    if len(face_encodings) > 0:
        user_encoding = face_encodings[0]

        # Inserir o encoding no Milvus
        face_encoding = [user_encoding.tolist()]
        mr = collection.insert([face_encoding])

        return jsonify({'message': 'Usuário cadastrado com sucesso', 'user_id': mr.primary_keys[0]}), 200
    else:
        return jsonify({'error': 'Nenhum rosto encontrado na imagem.'}), 400

# Rota para deletar um usuário por form-data
@app.route('/deletar_usuario', methods=['POST'])
def deletar_usuario():
    if 'user_id' not in request.form:
        return jsonify({'error': 'user_id não fornecido'}), 400

    user_id = request.form['user_id']

    # Deleta o registro com o user_id informado
    expr = f"user_id == {user_id}"
    result = collection.delete(expr)

    return jsonify({"message": f"Registro do user_id {user_id} deletado."}), 200

# Rota para limpar todos os registros e recriar a coleção
@app.route('/limpar_registros', methods=['POST'])
def limpar_registros():
    global collection  # Recarregar a coleção globalmente
    # Apagar a coleção inteira
    collection.drop()

    # Recriar a coleção para que não quebre após a limpeza
    collection = criar_colecao()  # Recria e carrega a coleção automaticamente

    return jsonify({"message": "Todos os registros foram deletados e a coleção foi recriada com sucesso."}), 200

# Rota para verificar se o user_id existe ou se o encoding facial é semelhante ao de algum usuário
@app.route('/verificar_usuario', methods=['POST'])
def verificar_usuario():
    # Se for form-data com o user_id, processe o ID
    if 'user_id' in request.form:
        user_id = request.form.get('user_id')

        if not user_id:
            return jsonify({"error": "user_id não fornecido"}), 400

        # Verifique se o user_id existe no Milvus
        expr = f"user_id == {user_id}"
        results = collection.query(expr)

        if results:
            return jsonify({"message": "Funcionário encontrado", "user_id": user_id}), 200
        else:
            return jsonify({"message": "Funcionário não encontrado"}), 404

    # Se for multipart/form-data, processe a imagem
    elif 'image' in request.files:
        image_file = request.files['image']
        unknown_image = face_recognition.load_image_file(image_file)

        # Gera o encoding facial
        unknown_encodings = face_recognition.face_encodings(unknown_image)

        if len(unknown_encodings) > 0:
            unknown_encoding = unknown_encodings[0]

            # Busca o encoding mais próximo no Milvus
            search_params = {"metric_type": "L2", "params": {"ef": 100}}
            results = collection.search([unknown_encoding.tolist()], "face_encoding", param=search_params, limit=1, expr=None)

            # Adicionar um limiar (threshold) de similaridade para considerar uma correspondência válida
            threshold = 0.6  # Ajuste conforme necessário

            # Verifica se encontrou um match e se a distância está dentro do threshold aceitável
            if results and len(results) > 0:
                similarity = round(results[0].distances[0], 4)  # Similaridade com 4 casas decimais

                if similarity < threshold:
                    matched_user_id = results[0].ids[0]
                    return jsonify({
                        'message': 'Funcionário encontrado',
                        'user_id': matched_user_id,
                        'similaridade': similarity,
                        'threshold': threshold
                    }), 200
                else:
                    return jsonify({
                        'message': 'Funcionário não encontrado',
                        'reason': 'Similaridade baixa',
                        'similaridade': similarity,
                        'threshold': threshold
                    }), 404
            else:
                return jsonify({'message': 'Funcionário não encontrado'}), 404
        else:
            return jsonify({'error': 'Nenhum rosto encontrado na imagem.'}), 400

    # Se o Content-Type não for suportado ou não houver user_id ou imagem
    else:
        return jsonify({'error': 'Formato de requisição inválido. Envie user_id ou imagem.'}), 415

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
