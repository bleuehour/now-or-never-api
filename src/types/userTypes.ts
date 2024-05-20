import { todo } from "./todoTypes";
import { Friendship } from "./friendTypes";

export type user = {
  id: number;
  username: string;
  email: string;
  password: string;
  todos: todo[];
  time: string;
  streak: number;
  friends: Friendship[];
  friendsOf: Friendship[];
};

export interface UserInput {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  token: string;
  user: UserInput;
}
