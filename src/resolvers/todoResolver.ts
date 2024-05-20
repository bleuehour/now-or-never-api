import { Todo } from "@prisma/client";

import { prisma } from "../../prisma/db";
import { CreateTodoArgs, DeleteTodoArgs, UpdateDoneArgs, UpdateRecurringArgs } from "src/types/todoTypes";

export const todoResolver = {
  Query: {
    getTodos: async (_: any, __: any, context: any): Promise<Todo[]> => {
      if (!context.user) {
        throw new Error("Authentication required");
      }

      const userId = context.user?.userId;

      const getAllTodos = await prisma.todo.findMany({
        where: {
          userId: userId,
        },
        orderBy: [ { createdAt: "asc" }],
      });

      return getAllTodos;
    },
  },

  Mutation: {
    createTodo: async (
      _: any,
      args: CreateTodoArgs,
      context: any
    ): Promise<string> => {
      if (!context.user) {
        throw new Error("Authentication required");
      }
      
      await prisma.todo.create({
        data: {
          userId: context.user?.userId,
          text: args.text,
        },
      });

      return "works";
    },

    deleteTodo: async (
      _: any,
      args: DeleteTodoArgs,
      context: any
    ): Promise<string> => {
      if (!context.user) {
        throw new Error("Authentication required");
      }

      await prisma.todo.delete({
        where: {
          id: args.id,
          userId: context.user?.userId,
        },
      });

      return "Todo deleted successfully";
    },
    updateDone: async (_: any, args: UpdateDoneArgs, context: any) => {
      const todo = await prisma.todo.findUnique({
        where: {
          userId: context.user?.userId,
          id: args.id,
        },
      });

      if (!todo) {
        throw new Error("Todo not found.");
      }

      await prisma.todo.update({
        where: {
          userId: context.user?.userId,
          id: args.id,
        },
        data: {
          isComplete: !args.isComplete,
        },
      });

      return "works";
    },
    recurringDone: async (_: any, args: UpdateRecurringArgs, context: any) => {
      const todo = await prisma.todo.findUnique({
        where: {
          userId: context.user?.userId,
          id: args.id,
        },
      });

      if (!todo) {
        throw new Error("Todo not found.");
      }

      await prisma.todo.update({
        where: {
          userId: context.user?.userId,
          id: args.id,
        },
        data: {
          isRecurring: !args.isRecurring,
        },
      });

      return "works";
    },
  },
};