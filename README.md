# LojaOutside Parser

O **LojaOutside Parser** é uma ferramenta web desenvolvida para automatizar a criação de pedidos de compra a partir de URLs do site `lojaoutside.com.br`.

A aplicação utiliza a **Google Gemini API** (modelo `gemini-3-flash-preview`) para analisar o código HTML da página do produto e extrair informações estruturadas, eliminando a necessidade de cadastro manual de referências e variações.

## Funcionalidades Principais

*   **Importação via URL**: Basta colar o link do produto. O sistema utiliza um proxy para baixar o HTML e processá-lo.
*   **Extração Inteligente (IA)**:
    *   Identifica o Nome do Produto e Imagem Principal.
    *   Captura a Referência Pai (SKU).
    *   Lista todas as Variações de Tamanho.
    *   Identifica o SKU específico de cada variação.
    *   Verifica o Estoque disponível.
*   **Gestão de Pedido**:
    *   Adicionar múltiplos produtos a uma única lista.
    *   Inserir quantidades manualmente para cada variação.
    *   Cálculo automático do total de peças.
*   **Modo de Impressão**:
    *   Interface limpa otimizada para papel A4.
    *   Remove botões e menus.
    *   Adiciona cabeçalho com Logo da empresa.
    *   Campos de quantidade formatados para conferência.

## Tecnologias Utilizadas

*   **Frontend**: React (Vite), TypeScript.
*   **Estilização**: Tailwind CSS.
*   **IA**: SDK `@google/genai` (Gemini 1.5 Pro/Flash).
*   **Proxy**: `allorigins.win` (para contornar CORS ao buscar o HTML do e-commerce).

## Como Usar

1.  **Configuração da API Key**:
    A aplicação exige uma chave de API do Google Gemini configurada no ambiente (`process.env.API_KEY`).

2.  **Adicionar Produtos**:
    *   Copie a URL de um produto no site da Loja Outside.
    *   Cole no campo "URL do Produto" na lateral esquerda.
    *   Clique em "Adicionar à Lista".

3.  **Montar Pedido**:
    *   O produto aparecerá na lista principal.
    *   Verifique as variações e o estoque.
    *   Digite a quantidade desejada para cada tamanho na coluna "Qtd Pedido".

4.  **Imprimir**:
    *   Clique no botão "Imprimir Pedido" no topo da lista.
    *   A janela de impressão do navegador será aberta com o layout formatado.

## Tratamento de Erros e Performance

*   **Limpeza de HTML**: Antes de enviar para a IA, o sistema remove scripts, estilos e SVGs do HTML original. Isso reduz drasticamente o tempo de processamento e evita timeouts.
*   **Timeouts**: Requisições de URL que demoram mais de 15 segundos são canceladas automaticamente para não travar a interface.

---
*Este projeto é uma ferramenta auxiliar e depende da estrutura HTML do site alvo. Mudanças drásticas no layout do e-commerce podem afetar a precisão da extração.*
