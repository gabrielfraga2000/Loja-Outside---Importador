# LojaOutside Parser

O **LojaOutside Parser** é uma ferramenta web desenvolvida para automatizar a criação de pedidos de compra a partir de URLs do site `lojaoutside.com.br`.

A aplicação utiliza a **Google Gemini API** (modelo `gemini-3-flash-preview`) para analisar o código HTML da página do produto e extrair informações estruturadas.

## Tecnologias

*   **Frontend**: React (Vite), TypeScript.
*   **Estilização**: Tailwind CSS (CDN).
*   **IA**: SDK `@google/genai`.

## Instalação e Uso Local

1.  **Clone o repositório**:
    ```bash
    git clone https://github.com/seu-usuario/lojaoutside-parser.git
    cd lojaoutside-parser
    ```

2.  **Instale as dependências**:
    ```bash
    npm install
    ```

3.  **Configure a API Key**:
    *   Crie um arquivo `.env` na raiz do projeto (use `.env.example` como base).
    *   Adicione sua chave do Google Gemini:
    ```env
    API_KEY=sua_chave_aqui_AIzaSy...
    ```

4.  **Execute o projeto**:
    ```bash
    npm run dev
    ```

## Como Usar

1.  Copie a URL de um produto no site da Loja Outside.
2.  Cole no campo "URL do Produto".
3.  Clique em "Adicionar à Lista".
4.  Ajuste as quantidades e clique em "Imprimir Pedido".

## Estrutura do Projeto

*   `/services`: Lógica de extração e comunicação com Gemini.
*   `/components`: Componentes visuais (Tabela, Header, Botões).
*   `/types`: Definições de tipos TypeScript.
