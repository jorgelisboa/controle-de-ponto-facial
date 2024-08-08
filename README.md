# controle-de-ponto-facial

## Descrição

Projeto de controle de ponto facial através de aplicativo mobile.

## Tecnologias

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.io/)
- [Laravel](https://laravel.com/)
- [Docker](https://www.docker.com/)
- [Python](https://www.python.org/)

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
