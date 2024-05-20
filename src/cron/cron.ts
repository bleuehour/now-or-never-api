import cron from "node-cron";
import { deleteAllTodos, updateStreaks } from "../resolvers/streakResolver";



export const scheduleJobs = () => {
    cron.schedule("0 0 * * *", () => {
      updateStreaks();
      deleteAllTodos();
    });
  };