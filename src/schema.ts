import { gql } from 'apollo-server-express';

export default gql`
  type Book {
    id: ID!
    title: String!
    author: Author
  }

  type Author {
    id: ID!
    firstName: String!
    lastName: String!
    name: String!
    books: [Book]
  }

  type Library {
    id: ID!
    title: String!
    body: String
    books: [Book]
  }
  
  type Query {
    books: [Book]
    library(id: ID!): Library
  }


`;
