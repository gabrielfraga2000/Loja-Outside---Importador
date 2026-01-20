import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ProductData, ProductType } from "../types";

// Define the schema for strict JSON output
const productSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    tipo: {
      type: Type.STRING,
      enum: [ProductType.SIMPLES, ProductType.COMPOSICAO, ProductType.UNKNOWN],
      description: "Identifies if the product is 'simples' (single item with size variations) or 'composicao' (kit/set).",
    },
    nome: {
      type: Type.STRING,
      description: "The full name of the product extracted from the HTML.",
    },
    imagem: {
      type: Type.STRING,
      description: "URL of the main product image (e.g. from og:image meta tag or main gallery image).",
    },
    referenciaPai: {
      type: Type.STRING,
      description: "The main reference code (SKU) for the parent product.",
    },
    variacoes: {
      type: Type.ARRAY,
      description: "List of size variations, their specific SKU references, and stock quantity.",
      items: {
        type: Type.OBJECT,
        properties: {
          tamanho: {
            type: Type.STRING,
            description: "The size label (e.g., P, M, G, PPP, 38, 40).",
          },
          referencia: {
            type: Type.STRING,
            description: "The specific SKU/Reference code for this size variant.",
          },
          estoque: {
            type: Type.INTEGER,
            description: "The exact quantity in stock found in the skuJson/data-stock. Return 0 if out of stock.",
          },
        },
        required: ["tamanho", "referencia"],
      },
    },
  },
  required: ["tipo", "nome", "variacoes"],
};

const SYSTEM_INSTRUCTION = `
Atue como um especialista em extração de dados da plataforma Tray Commerce.
Sua tarefa é CORRELACIONAR dados visuais (HTML) com dados técnicos (JSON de Script) para garantir precisão absoluta no estoque.

ALGORITMO DE EXTRAÇÃO (IMPORTANTE):

1. **IDENTIFIQUE O MAPA DE IDs (HTML)**:
   - Procure no HTML por elementos de seleção de variação (dropdowns <select> ou botões/links).
   - Identifique o NOME do tamanho (ex: "P", "M") e o ID numérico associado (geralmente em atributos como 'value', 'data-id', 'rel', ou 'data-variation-id').
   - *Exemplo Mental*: Encontrei <a data-id="542">Tamanho P</a>. Logo, P = 542.

2. **CONSULTE O ESTOQUE REAL (SCRIPT JSON)**:
   - Vá até o final do código, nos scripts, e encontre a variável 'skuJson' ou 'Tray.Product'.
   - Este objeto usa os IDs numéricos como chave.
   - *Exemplo Mental*: No skuJson, a chave "542" tem { "stock": 10, "reference": "REF-P" }.

3. **CRUZE OS DADOS**:
   - Tamanho P (ID 542) -> JSON ID 542 -> Estoque 10.
   - Se você apenas ler o JSON sem cruzar com o HTML, não saberá qual ID pertence a qual Tamanho. FAÇA O CRUZAMENTO.

4. **REGRAS DE DADOS**:
   - Nome: Use o <h1> principal.
   - Referência Pai: Procure próximo ao preço ou nome.
   - Imagem: URL completa.
   - Se 'skuJson' não existir, procure atributos 'data-stock' diretamente nas tags HTML.

Seja extremamente preciso com os números. Não alucine estoques.
`;

/**
 * Cleans the HTML to remove useless bulk (CSS, SVG) but KEEPS the DOM structure
 * needed to map "Size Name" to "ID", and the SCRIPTS needed for "ID" to "Stock".
 */
const prepareContext = (html: string): string => {
  // 1. Remove Styles and SVGs (Save ~40-50% size without losing data structure)
  let clean = html
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gim, "")
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gim, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  // 2. Collapse whitespace
  clean = clean.replace(/\s+/g, " ").trim();

  // 3. Truncate safely, but generously. 
  // Gemini 1.5 Flash supports 1M tokens. 150k chars is tiny for it.
  // The goal is to ensure we have the 'buy box' (HTML) AND the 'footer' (Script).
  
  if (clean.length > 150000) {
    const head = clean.substring(0, 75000); // Increased to cover HTML body/structure
    const tail = clean.substring(clean.length - 75000); // Cover scripts
    return `${head} ... [TRUNCATED MIDDLE] ... ${tail}`;
  }
  
  return clean;
};

export const parseProductHtml = async (htmlContent: string): Promise<ProductData> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Prepare clean context containing both HTML Structure (for IDs) and Scripts (for Data)
  const finalContent = prepareContext(htmlContent);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: [
        {
          role: "user",
          parts: [{ text: `Analise este código fonte de loja Tray. CRUZE o ID do HTML com o skuJson para garantir o estoque correto de cada tamanho:\n\n${finalContent}` }],
        },
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: productSchema,
        temperature: 0,
      },
    });

    const textResponse = response.text;
    if (!textResponse) {
      throw new Error("No response generated from the model.");
    }

    const parsedData = JSON.parse(textResponse) as ProductData;
    return parsedData;

  } catch (error: any) {
    console.error("Gemini Parsing Error:", error);
    throw new Error(error.message || "Failed to parse product data.");
  }
};

export const parseProductUrl = async (url: string): Promise<ProductData> => {
  try {
    try {
      new URL(url);
    } catch {
      throw new Error("Formato de URL inválido.");
    }

    const proxies = [
      `https://corsproxy.io/?${encodeURIComponent(url)}`,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}&timestamp=${Date.now()}`
    ];

    let lastError: Error | null = null;

    for (const proxyUrl of proxies) {
      const controller = new AbortController();
      // Increased timeout slightly to account for larger download size
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      try {
        console.log(`Tentando fetch via: ${proxyUrl}`);
        const response = await fetch(proxyUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
           throw new Error(`Proxy retornou status: ${response.status}`);
        }

        const htmlContent = await response.text();
        
        if (!htmlContent || htmlContent.length < 100) {
          throw new Error("O conteúdo retornado parece vazio.");
        }

        return await parseProductHtml(htmlContent);

      } catch (fetchError: any) {
         clearTimeout(timeoutId);
         console.warn(`Falha com proxy ${proxyUrl}:`, fetchError);
         
         if (fetchError.name === 'AbortError') {
           lastError = new Error("O site demorou para responder (20s).");
         } else {
           lastError = fetchError;
         }
      }
    }

    throw lastError || new Error("Falha ao acessar a URL. Verifique se o link está correto.");

  } catch (error: any) {
    console.error("URL Fetch Error:", error);
    throw new Error(error.message || "Falha ao buscar conteúdo da URL.");
  }
};
