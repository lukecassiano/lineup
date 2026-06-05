export type Condition = "firing" | "fair" | "flat";
export type SpotType = "Beach" | "Reef" | "Point";

export interface TextMessage {
  id: string;
  type: "text";
  who: string;
  text: string;
  t: string;
}

export interface LogMessage {
  id: string;
  type: "log";
  who: string;
  spot: string;
  ft: string;
  wind: string;
  rating: number;
  note?: string;
  t: string;
}

export interface SpotMessage {
  id: string;
  type: "spot";
  who: string;
  spot: string;
  note?: string;
  t: string;
}

export type ThreadItem = TextMessage | LogMessage | SpotMessage;

export interface Crew {
  id: string;
  name: string;
  emblem: string;
  color: string;
  members: string[];
  thread: ThreadItem[];
}

export interface Spot {
  id: string;
  name: string;
  type: SpotType;
  x: number;
  y: number;
  secret: boolean;
  cond: Condition;
  crew?: string;
  by?: string;
  userDropped?: boolean;
  visibility?: string;
}

export interface CommunityPost {
  id: string;
  who: string;
  clip: boolean;
  mood: Condition;
  cap: string;
  likes: number;
  comments: number;
  liked: boolean;
}

export interface Session {
  id: string;
  spot: string;
  ft: string;
  wind: string;
  rating: number;
  note?: string;
  t: string;
}

export interface AppState {
  mySessions: Session[];
  userPins: Spot[];
  discovered: string[];
  crews: Crew[];
  community: CommunityPost[];
}
