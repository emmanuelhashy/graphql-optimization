let knex: any = null;

async function startDatabase() {
  if (!knex) {
    knex = require('knex')({
      client: 'sqlite3',
      connection: {
        filename: ':memory:',
      },
    });

    await createDatabase(knex);

    console.log('database initialized');
  }

  return knex;
}

async function createDatabase(knex: any) {
  await knex.schema
    .createTable('authors', (table: any) => {
      table.increments('id');
      table.string('first_name');
      table.string('last_name');
    })
    .createTable('books', (table: any) => {
      table.increments('id');
      table.string('title');
      table.integer('author_id').unsigned().references('authors.id');
    })
    .createTable('libraries', (table: any) => {
      table.increments('id');
      table.string('name');
      table.string('description');
    })
    .createTable('libraries_books', (table: any) => {
      table.increments('id');
      table.integer('library_id').unsigned().references('libraries.id');
      table.integer('book_id').unsigned().references('books.id');
    });

  await knex('authors').insert([
    { id: 1, first_name: 'Mister', last_name: 'Roro' },
    { id: 2, first_name: 'Styled', last_name: 'West' },
    { id: 3, first_name: 'Daddy', last_name: 'Ice' },
  ]);

  await knex('books').insert([
    { title: 'Awesome tunes', author_id: 1 },
    { title: 'Starry Window', author_id: 2 },
    { title: 'Upbeat vocals', author_id: 2 },
    { title: 'Rotten', author_id: 3 },
  ]);

  await knex('libraries').insert({
    id: 1,
    name: 'My favorite songs',
    description: 'Lorem ipsum',
  });

  await knex('libraries_books').insert([{ library_id: 1, book_id: 1 }]);

  return true;
}

export default startDatabase;
