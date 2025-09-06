import { User } from "./user";

export interface ApiResponse {
  data?: any;
  message?: string;
}

export interface Identity extends Partial<User>{};
