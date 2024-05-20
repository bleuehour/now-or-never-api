export type todo = {
  id: number;
  text: string;
  createdAt: string;
  userId: number;
  isComplete: boolean;
  isRecurring:boolean;
};

export interface CreateTodoArgs {
  text: string;
}

export interface DeleteTodoArgs {
  id: number;
}

export interface UpdateDoneArgs {
  id: number;
  isComplete: boolean;
}

export interface UpdateRecurringArgs{
  id:number;
  isRecurring:boolean;
}
