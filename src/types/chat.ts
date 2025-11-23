export type Sender = 'user' | 'bot';

export interface Location {
  lat: number;
  lng: number;
}

export interface RecommendationItem {
  benefitId: string;
  title: string;
  category: string;
  score: number;
  summary: string;
  location?: Location;
}

export interface ChatResponse {
  assistantMessage: string;
  recommendations?: RecommendationItem[];
  riskLevel?: string;
  userName?: string;
  residence?: string;
  baseTags?: string[];
  recommendationIssued?: boolean;
}

export interface Message {
  sender: Sender;
  text: string;
  recommendations?: RecommendationItem[];
}

export interface ConversationTurn {
  role: 'user' | 'assistant';
  message: string;
}
