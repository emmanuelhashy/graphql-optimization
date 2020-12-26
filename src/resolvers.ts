type Context = {
  knex: any;
  loaders: any;
};

type LibraryInput = {
  id: string;
};

async function getBooks(
  _: any,
  {},
  { knex }: Context,
): Promise<any> {
  if (!knex) throw new Error('Not connected to the database');

  return await knex('books').select();
}

async function getAuthor(
  { author_id: authorId }: any,
  {},
  { loaders }: Context,
): Promise<any> {

  return await loaders.author.load(authorId);
}


async function getLibrary(
  _: any,
  { id }: LibraryInput,
  { knex }: Context,
): Promise<any> {
  if (!knex) throw new Error('Not connected to the database');

  const library = await knex('libraries').where('id', id).select();

  if (!library.length) throw new Error('Library not found');

  return library[0];
}

async function getBooksByLibrary(
  { id }: any,
  {}: any,
  { knex }: Context,
): Promise<any> {
  return await knex('libraries_books')
    .where('library_id', id)
    .join('books', 'libraries_books.book_id', 'books.id')
    .select('books.*');
}

async function getBooksByAuthor(
  { id }: any,
  {}: any,
  { knex }: Context,
): Promise<any> {
  return await knex('books').where('author_id', id);
}



const resolvers = {
  Book: {
    author: getAuthor,
  },
  Library: {
    books: getBooksByLibrary,
  },
  Author: {
    books: getBooksByAuthor,
  },
  Query: {
    books: getBooks,
    library: getLibrary,
  },
};

export default resolvers;
