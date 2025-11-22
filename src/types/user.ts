export interface User {
  id: number;
  name: string;
  age: number;
  residence: string;
  baseTags: string; // 백엔드가 JSON 문자열로 내려주므로 문자열로 받습니다.
  createdAt: string;
}

export interface RegisterUserPayload {
  name: string;
  age: number;
  residence: string;
  baseTags: string[];
}
