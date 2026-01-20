export enum ProductType {
  SIMPLES = 'simples',
  COMPOSICAO = 'composicao',
  UNKNOWN = 'desconhecido'
}

export interface Variation {
  tamanho: string;
  referencia: string;
  estoque: number | null;
}

export interface ProductData {
  tipo: ProductType;
  nome: string;
  imagem: string | null;
  referenciaPai: string | null;
  variacoes: Variation[];
}

export interface ParserState {
  isLoading: boolean;
  data: ProductData | null;
  error: string | null;
}
