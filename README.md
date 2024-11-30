📚 Book Manager - Story Cloud
Book Manager é um projeto de gerenciamento de usuários e livros, desenvolvido com foco em simplicidade e eficiência. Ele é alimentado por um servidor JSON local que simula uma API para o armazenamento de dados de usuários e livros.

🚀 Tecnologias Utilizadas
React para a interface do usuário.
TypeScript para tipagem estática e maior segurança no código.
JSON Server para simular um servidor RESTful para armazenar dados.
React Router para navegação entre as páginas.
🛠️ Como Executar o Projeto
1. Clone o repositório:

git clone https://github.com/seu-usuario/book-manager.git
cd book-manager
2. Instale as dependências:

npm install
3. Inicie o servidor JSON Server:
Certifique-se de ter o JSON Server instalado globalmente. Caso não tenha, instale com o seguinte comando:

npm install -g json-server
Em seguida, inicie o servidor com:

npx json-server --watch db.json --port 3001
4. Execute o projeto React:
Em outro terminal, execute o comando para iniciar o servidor de desenvolvimento do React:
npm start

📂 Estrutura do Projeto

book-manager/
│
├── public/
│   └── index.html
│
├── src/
│   ├── context/      # Contém o contexto de autenticação
│   ├── pages/        # Páginas da aplicação (ex: Login, Register)
│   ├── components/   # Componentes reutilizáveis
│   ├── App.tsx       # Componente principal
│   └── index.tsx     # Ponto de entrada da aplicação
│
├── db.json           # Banco de dados fictício para o JSON Server
└── README.md         # Este arquivo de documentação

🌐 Endpoints da API
O projeto utiliza o JSON Server para emular uma API com as seguintes rotas:

1. /users
Método: GET, POST
Descrição: Retorna todos os usuários cadastrados. Permite também a adição de novos usuários.
2. /books
Método: GET, POST
Descrição: Retorna todos os livros cadastrados. Permite também a adição de novos livros.
✨ Funcionalidades
Login de usuários: Interface de login com autenticação simulada.
Registro de novos usuários: Tela de registro para criar contas de usuários.
Listagem de livros: Exibição de uma lista de livros cadastrados.
Adição de livros: Interface para cadastrar novos livros.
Edição de livros e usuários
Delete de livros e usuários