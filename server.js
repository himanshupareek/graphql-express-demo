const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP;
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  UniqueDirectiveNamesRule
} = require('graphql')
const app = express()

const authors = [
	{ id: 1, name: 'Himanshu Pareek' },
	{ id: 2, name: 'Vipin' },
	{ id: 3, name: 'Ashok' }
]

const publishers = [
	{ id: 1, name: 'Tata' },
	{ id: 2, name: 'Birla' },
	{ id: 3, name: 'Adani' },
    { id: 4, name: 'Ambani' }
]

const books = [
	{ id: 1, name: 'Life a mystery', authorId: 1, publisherId : 1 },
	{ id: 2, name: 'Life is beautiful', authorId: 1, publisherId : 1 },
	{ id: 3, name: 'Life is learning', authorId: 1 , publisherId : 1},
	{ id: 4, name: 'Learning and Earning', authorId: 2, publisherId : 1 },
	{ id: 5, name: 'Two Friends', authorId: 2, publisherId : 2 },
	{ id: 6, name: 'Life of Pie', authorId: 2, publisherId : 3 },
	{ id: 7, name: 'Shashank Redemption', authorId: 3, publisherId : 4 },
	{ id: 8, name: 'Work is worship', authorId: 3, publisherId : 4 }
]

const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'This represents a book written by an author and having a publisher',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (book) => {
        return authors.find(author => author.id === book.authorId)
      }
    },
    publisherId: { type: new GraphQLNonNull(GraphQLInt)},
    publisher: {
        type: PublisherType,
        resolve: (book) => {
            return publishers.find(publisher => publisher.id === book.publisherId)
        }
    }
  })
})

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: 'This represents a author of a book',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    books: {
      type: new GraphQLList(BookType),
      resolve: (author) => {
        return books.filter(book => book.authorId === author.id)
      }
    }
  })
})

const PublisherType = new GraphQLObjectType({
    name: 'Publisher',
    description: 'This represents a publisher of a book',
    fields: () => ({
      id: { type: new GraphQLNonNull(GraphQLInt) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      books: {
        type: new GraphQLList(BookType),
        resolve: (publisher) => {
          return books.filter(book => book.publisherId === publisher.id)
        }
      }
    })
  })

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    book: {
      type: BookType,
      description: 'A Single Book',
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => books.find(book => book.id === args.id)
    },
    books: {
      type: new GraphQLList(BookType),
      description: 'List of All Books',
      resolve: () => books
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: 'List of All Authors',
      resolve: () => authors
    },
    author: {
      type: AuthorType,
      description: 'A Single Author',
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => authors.find(author => author.id === args.id)
    },
    publishers: {
        type: new GraphQLList(PublisherType),
        description: 'List of publishers',
        resolve: () => publishers
    },
    publisher: {
        type: PublisherType,
        description: 'A Single Publisher',
        args: {
          id: { type: GraphQLInt }
        },
        resolve: (parent, args) => publishers.find(publisher => publisher.id === args.id)
      },
  })
})

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: () => ({
    addBook: {
      type: BookType,
      description: 'Add a book',
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLInt) },
        publisherId: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const book = { id: books.length + 1, name: args.name, authorId: args.authorId, publisherId: args.publisherId }
        books.push(book)
        return book
      }
    },
    addAuthor: {
      type: AuthorType,
      description: 'Add an author',
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (parent, args) => {
        const author = { id: authors.length + 1, name: args.name }
        authors.push(author)
        return author
      }
    },
    addPublisher: {
        type: PublisherType,
        description: 'Add a publisher',
        args: {
          name: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve: (parent, args) => {
          const publisher = { id: publishers.length + 1, name: args.name }
          publishers.push(publisher)
          return publisher
        }
      }
  })
})

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
})

app.use('/graphql', expressGraphQL({
  schema: schema,
  graphiql: true
}))
app.listen(8081, () => console.log('Server Running'))