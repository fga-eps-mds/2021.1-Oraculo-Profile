# 2021.1-Oraculo-Profile

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/gpl-3.0.html)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=fga-eps-mds_2021.1-Oraculo-Profile&metric=alert_status)](https://sonarcloud.io/dashboard?id=fga-eps-mds_2021.1-Oraculo-Profile)

Essa API faz parte da arquitetura de microsserviços do projeto [`Oráculo`](https://github.com/fga-eps-mds/2021.1-Oraculo), sua funcionalidade é em questão de criar e editar os usuários do sistema.

## Como contribuir?

Gostaria de contribuir com nosso projeto? Acesse o nosso [guia de contribuição](https://fga-eps-mds.github.io/2021.1-Oraculo/CONTRIBUTING/) onde são explicados todos os passos.
Caso reste duvidas você também pode entrar em contato conosco criando uma issue.

## Documentação

A documentação do projeto pode ser acessada pelo nosso site em https://fga-eps-mds.github.io/2021.1-Oraculo/.

## Testes

Todas as funções adicionadas nessa API devem ser testadas, o repositŕorio aceita até 10% do total de linhas não testadas. Para rodar os testes nesse repositŕio deve ser executado o comando:

```bash
docker-compose up -d --build banco
npm install
npx sequelize-cli db:migrate --config src/Database/config/config.json
node tests/create-admin.js
npx jest --coverage --forceExit
```

## Como rodar?

O arquivo `.env` possui configurações iniciais que podem ser alteradas de acordo com a necessidade. São elas:

- SECRET: chave para criptografia das senhas
- DB_USER: usuário de acesso ao banco de dados
- DB_PASS: senha de acesso ao banco de dados
- DB_NAME: nome da base de dados
- DB_HOST: host da base de dados
- DB_PORT: porta de conexão com o banco

Veja o exemplo abaixo:

```
SECRET=chavedesegredo
DB_USER=api_user
DB_PASS=api_password
DB_NAME=api_database
DB_HOST=db_users
```

Para rodar a API é preciso usar os seguintes comandos usando o docker:

1 - Instale as dependências

```bash
yarn
```

1.1 - Certifique-se de limpar containers já existentes

```bash
yarn docker:clean
```

2 - Configure as variáveis de ambiente editando o arquivo `.env`

```
SECRET=chavedesegredo
DB_USER=api_user
DB_PASS=api_password
DB_NAME=api_database
DB_HOST=db_users
DB_PORT=8001
```

3 - Configure a variável de ambiente `DATABASE_URL`

```bash
export DATABASE_URL=postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}
```

**Importante**: os valores das variáveis DB_USER, DB_PASS, DB_HOST, DB_PORT e DB_NAME são os mesmos
do arquivo `.env` editado anteriormente.

Se o arquivo `.env` estiver com os mesmos valores do passo anterior, então a `DATABASE_URL` deverá ser exportada
da seguinte forma:

```bash
export DATABASE_URL=postgres://api_user:api_password@db_users:8001/api_database
```

3 - Suba o container

```bash
yarn all:prod
```

4 - Edite as credenciais do usuário admin no arquivo `tests/create-admin.js`

- ADMIN_MAIL
- ADMIN_NAME
- ADMIN_PASSWORD

5 - Crie o usuário admin no banco de dados

```bash
node tests/create-admin.js
```

A API estará rodando na porta especificada pela variável `DB_PORT` (padrão é a porta 8001)

## Rotas

**POST: `/register`**

Para criar um novo usuário, envie os dados nesse formato:

```json
{
  "name": "Nome do Usuário",
  "email": "usuario@email.com",
  "departmentID": "Id do departamento",
  "level": "Id da permissão de usuário",
  "sectionID": "Id da seção",
  "password": "Senha"
}
```

- Importante: apenas o _id_ da seção ou o _id_ do departamento podem ser nulos. Usuários com privilégios de administrador sempre deverão ser criados com um `departmentID > 0` e `sectionID = 0`
  enquanto que usuários comuns deverão ser criados com um `sectionID > 0` e `departmentID = 0`.

**POST: `/login/`**

Para entrar no sitema, envie os dados nesse formato:

```json
{
  "email": "usuario@email.com",
  "password": "Senha"
}
```

**GET: `/users/all`**

Para listar todos os usuários, envie os dados nesse formato:

```json
header: {
    "X-Access-Token": "token",
}
```

**GET: `/user/access-level`**

Rota para obter o nível de acesso do usuário atual

```json
header: {
    "X-Access-Token": "token",
}
```

**GET: `/user/info`**
Rota para obter informações sobre o usuário logado

```json
header: {
    "X-Access-Token": "token"
}
```

Resposta esperada:

```json
{
  "id": 1,
  "email": "",
  "created_at": "",
  "updated_at": "",
  "departments": [
    {
      "id": 1,
      "name": "",
      "user_departments": {
        "createdAt": "",
        "updatedAt": "",
        "user_id": 1,
        "department_id": 1
      }
    }
  ],
  "levels": [
    {
      "id": 1,
      "name": "admin",
      "createdAt": "2021-11-06T04:56:08.981Z",
      "updatedAt": "2021-11-06T04:56:08.981Z",
      "user_levels": {
        "createdAt": "2021-11-06T04:56:09.692Z",
        "updatedAt": "2021-11-06T04:56:09.692Z",
        "user_id": 1,
        "level_id": 1
      }
    }
  ],
  "sections": [
    {
      "id": 34,
      "name": "none",
      "is_admin": false,
      "createdAt": "2021-11-06T04:56:08.973Z",
      "updatedAt": "2021-11-06T04:56:08.973Z",
      "user_sections": {
        "createdAt": "2021-11-06T04:56:09.697Z",
        "updatedAt": "2021-11-06T04:56:09.697Z",
        "user_id": 1,
        "section_id": 34
      }
    }
  ]
}
```

**GET: `/user/:id/info`**
Rota para obter informações sobre um usuário específico a partir do seu ID

```json
header: {
    "X-Access-Token": "token"
}
```

Resposta esperada:

```json
{
  "user": {
    "id": 2,
    "name": "administrador",
    "email": "admin1@email.com",
    "password": "",
    "createdAt": "2021-11-06T15:54:14.461Z",
    "updatedAt": "2021-11-06T15:54:14.461Z",
    "departments": [
      {
        "id": 8,
        "name": "none",
        "is_admin": false,
        "createdAt": "2021-11-06T15:53:17.897Z",
        "updatedAt": "2021-11-06T15:53:17.897Z",
        "user_departments": {
          "createdAt": "2021-11-06T15:54:14.473Z",
          "updatedAt": "2021-11-06T15:54:14.473Z",
          "user_id": 2,
          "department_id": 8
        }
      }
    ],
    "levels": [
      {
        "id": 2,
        "name": "common",
        "createdAt": "2021-11-06T15:53:17.933Z",
        "updatedAt": "2021-11-06T15:53:17.933Z",
        "user_levels": {
          "createdAt": "2021-11-06T15:54:14.479Z",
          "updatedAt": "2021-11-06T15:54:14.479Z",
          "user_id": 2,
          "level_id": 2
        }
      }
    ],
    "sections": [
      {
        "id": 8,
        "name": "Seção de Comparação Facial de Imagens",
        "is_admin": false,
        "createdAt": "2021-11-06T15:53:17.920Z",
        "updatedAt": "2021-11-06T15:53:17.920Z",
        "user_sections": {
          "createdAt": "2021-11-06T15:54:14.484Z",
          "updatedAt": "2021-11-06T15:54:14.484Z",
          "user_id": 2,
          "section_id": 8
        }
      }
    ]
  }
}
```


**Importante** os arrays `departments`, `levels` e `sections` sempre irão conter apenas um objeto.

**GET: `/departments`**
Envie uma requisição nesse endpoint para obter a lista de departamentos existentes

* Resposta

```json
[
  {
    "id": 1,
    "name": ""
  },
  {
    "id": 2,
    "name": ""
  }
]
```

**GET: `/sections`**
Envie uma requisição nesse endpoint para obter a lista de seções existentes

* Resposta

```json
[
  {
    "id": 0,
    "name": "",
  },
  {
    "id": 0,
    "name": "",
  }
]
```

**GET: `/levels`**
Envie uma requisição nesse endpoint para obter a lista de níveis de acesso existentes

- Resposta

```json
[
  {
    "id": 0,
    "name": ""
  },
  {
    "id": 0,
    "name": ""
  }
]
```

**POST: `/user/edit`**

Atualiza as informações do usuário atual (email, nome e departamento)

```json
{
  "name": "",
  "email": "",
  "section_id": 0,
  "department_id": 0
}
```

- Headers

```json
header: {
    "X-Access-Token": "token"
}
```

- Resposta

```json
{
  "id": 0,
  "name": "",
  "email": "",
  "department": [
    {
      "id": 1,
      "name": "Divisão Administrativa",
      "is_admin": true,
      "createdAt": "2021-11-06T05:42:46.479Z",
      "updatedAt": "2021-11-06T05:42:46.479Z",
      "user_departments": {
        "createdAt": "2021-11-06T05:42:47.229Z",
        "updatedAt": "2021-11-06T05:42:47.229Z",
        "user_id": 1,
        "department_id": 1
      }
    }
  ],
  "level": [
    {
      "id": 1,
      "name": "admin",
      "createdAt": "2021-11-06T05:42:46.502Z",
      "updatedAt": "2021-11-06T05:42:46.502Z",
      "user_levels": {
        "createdAt": "2021-11-06T05:42:47.236Z",
        "updatedAt": "2021-11-06T05:42:47.236Z",
        "user_id": 1,
        "level_id": 1
      }
    }
  ],
  "section": [
    {
      "id": 34,
      "name": "none",
      "is_admin": false,
      "createdAt": "2021-11-06T05:42:46.492Z",
      "updatedAt": "2021-11-06T05:42:46.492Z",
      "user_sections": {
        "createdAt": "2021-11-06T05:42:47.241Z",
        "updatedAt": "2021-11-06T05:42:47.241Z",
        "user_id": 1,
        "section_id": 34
      }
    }
  ]
}
```

**POST: `/user/change-password`**

Atualiza a senha do usuário atual (usuário que está logado)

```json
{
  "password": ""
}
```

```json
header: {
    "X-Access-Token": "token"
}
```

```

```

**POST `/sections`**

Cria uma seção nova

```json
{
  "name": ""
}
```

**POST `/departments`**

Cria um departamento novo

```json
{
  "name": ""
}
```

**POST `/sections/change-section/:id`**

Edita o nome de uma seção

**id** é o id da seção a ser editada

```json
{
  "name": ""
}
```

**POST `/departments/change-department/:id`**

Edita o nome de um departamento

**id** é o id do departamento a ser editado

```json
{
  "name": ""
}
```
