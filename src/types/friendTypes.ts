export type Friendship = {
  id: number;
  userId: number;
  friendId: number;
  isPending: boolean;
};


export interface sendRequestArgs {
  username: string;
}



export interface acceptRequestArgs {
  id: number;
}


