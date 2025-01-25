export type BasicStock = {
  ticker: string;
  price: number;
};

export type Stock = BasicStock & {
  beta?: number;
  pe?: number;
  eps?: number;
};
