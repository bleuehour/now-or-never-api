import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./typeDefs/typeDefs";
import { userResolver } from "./resolvers/userResolver";
import { schemaDefs } from "./typeDefs/schemaDefs";
import "dotenv/config";
import { todoResolver } from "./resolvers/todoResolver";
import { friendResolver } from "./resolvers/friendResolver";
import { scheduleJobs } from "./cron/cron";
import { jwtAuth } from "./utils/jwtAuth";




const server = new ApolloServer({
  typeDefs: [typeDefs, schemaDefs],
  resolvers: [ userResolver,todoResolver,friendResolver ],
});

scheduleJobs()

const startServer = async () => {
  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
      return jwtAuth(req)
    
    },
    listen: { port: 4000 },
  });
  console.log(`🚀 Server ready at ${url}`);
};

startServer();