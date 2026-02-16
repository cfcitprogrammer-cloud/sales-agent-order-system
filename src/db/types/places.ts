// db/types/location.ts
export type Province = {
  name: string;
  region: string;
  key: string;
};

export type City = {
  name: string;
  province: string; // province key
  city?: boolean;
};
