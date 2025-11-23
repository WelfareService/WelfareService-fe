export interface User {
  id: number;
  name: string;
  age: number;
  residence: string;
  baseTags: string[];
  createdAt: string;
}

export interface RegisterUserPayload {
  name: string;
  age: number;
  residence: string;
  baseTags: string[];
}
