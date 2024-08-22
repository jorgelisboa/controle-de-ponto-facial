# controle-de-ponto-facial

## Descrição

Projeto de controle de ponto facial através de aplicativo mobile.

## Tecnologias

<div align="center">
	<table>
		<tr>
			<td><img width="50" src="https://user-images.githubusercontent.com/25181517/117447155-6a868a00-af3d-11eb-9cfe-245df15c9f3f.png" alt="JavaScript" title="JavaScript"/></td>
			<td><img width="50" src="https://user-images.githubusercontent.com/25181517/183897015-94a058a6-b86e-4e42-a37f-bf92061753e5.png" alt="React" title="React"/></td>
			<td><img width="50" src="https://user-images.githubusercontent.com/25181517/183423507-c056a6f9-1ba8-4312-a350-19bcbc5a8697.png" alt="Python" title="Python"/></td>
			<td><img width="50" src="https://user-images.githubusercontent.com/25181517/183423775-2276e25d-d43d-4e58-890b-edbc88e915f7.png" alt="Flask" title="Flask"/></td>
			<td><img width="50" src="https://github.com/marwin1991/profile-technology-icons/assets/76662862/dbbc299a-8356-45e4-9d2e-a6c21b4569cf" alt="php (elephpant)" title="php (elephpant)"/></td>
			<td><img width="50" src="https://github.com/marwin1991/profile-technology-icons/assets/25181517/afcf1c98-544e-41fb-bf44-edba5e62809a" alt="Laravel" title="Laravel"/></td>
			<td><img width="50" src="https://user-images.githubusercontent.com/25181517/183896128-ec99105a-ec1a-4d85-b08b-1aa1620b2046.png" alt="MySQL" title="MySQL"/></td>
			<td><img width="50" src="https://user-images.githubusercontent.com/25181517/182884177-d48a8579-2cd0-447a-b9a6-ffc7cb02560e.png" alt="mongoDB" title="mongoDB"/></td>
			<td><img width="50" src="https://user-images.githubusercontent.com/25181517/117207330-263ba280-adf4-11eb-9b97-0ac5b40bc3be.png" alt="Docker" title="Docker"/></td>
		</tr>
	</table>
</div>
## Setup

Para rodar o ambiente você deve rodar o **aplicativo mobile** e o **backend**.

### Aplicativo Mobile

1. Entre na pasta `sistema-ponto-facial`:

```bash
cd sistema-ponto-facial
```

2. Instale as dependências:

```bash
npm install
```

3. Rode o aplicativo:

```bash
npm start
```

4. Abra o aplicativo Expo Go no seu celular e escaneie o QR Code.
5. Pronto, o aplicativo estará rodando no seu celular.

### Backend

1. Entre na pasta `sistema-ponto-facial-backend`:

```bash
cd sistema-ponto-facial-backend
```

2. Rode os containers:

```bash
./vendor/bin/sail up
```

3. Abra outro terminal e rode o backend:

```bash
./vendor/bin/sail php artisan serve
```

4. Rode as migrations:

```bash
./vendor/bin/sail php artisan migrate
```

5. Pronto, o backend estará rodando no endereço `localhost`.
6. Api está disponível em `localhost/api`.
7. Healthcheck está disponível em `localhost/api/health`.

#### Cheatset para laravel
- Criar ApiController `./vendor/bin/sail artisan make:controller ControllerNameController --api`
- Criar Model `./vendor/bin/sail artisan make:model ModelName`
- Criar Tabela `./vendor/bin/sail artisan make:migration create_table_name_table`
- Update tabela já existentes `./vendor/bin/sail artisan make:migration add_column_name_to_table_name_table`
- Rodar Migrations `./vendor/bin/sail artisan migrate`
- Listar rotas `./vendor/bin/sail artisan route:list`
