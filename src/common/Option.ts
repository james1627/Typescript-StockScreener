export type BasicOption = {
  ticker: string;
  price: number;
};

export type Option = BasicOption & {
  volume?: number;
  bid?: number;
  ask?: number;
  displayName?: string;
};
