import { prisma } from "../../prisma/db";

export async function updateStreaks() {
  const users = await prisma.user.findMany({
    include: {
      todos: true,
    },
  });
  for (const user of users) {
    if (user.todos.every((todo) => todo.isComplete) && user.todos.length > 2) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          streak: { increment: 1 },
        },
      });
    }
  }
}

export async function deleteAllTodos() {
  await prisma.todo.updateMany({
    where: {
      isRecurring: true,
    },
    data: {
      isComplete: false,
    },
  });

  await prisma.todo.deleteMany({
    where: {
      isRecurring: false,
    },
  });

}