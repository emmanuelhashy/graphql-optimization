import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import DataLoader from 'dataloader';
import typeDefs from './schema';
import resolvers from './resolvers';
import startDatabase from './database';


const dataLoaders = async () => {
  const db = await startDatabase();

  return {
    author: new DataLoader((ids) => {
      console.log('database query', ids);

      return db('authors').whereIn('id', ids).select();
    }),
  };
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async () => {
    const knex = await startDatabase();
    const loaders = await dataLoaders();

    return { knex, loaders };
  },
});

const app = express();
server.applyMiddleware({ app });

const PORT = 4000;

app.listen(PORT, () => {
  console.log(
    `GraphQL endpoint and playground available at http://localhost:${PORT}${server.graphqlPath}`,
  );
});
