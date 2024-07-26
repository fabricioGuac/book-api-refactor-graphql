const typeDefs = `
    input saveBookInput {
    author: [String]
    description: String!
    title: String!
    bookId: ID!
    image: String
    link: String
    }

    type User {
    _id: ID!
    username: String!
    email:String!
    bookCoount: INT
    savedBooks: [Book]
    }

    type Book {
    bookId: ID
    author: [String]
    description: String!
    title: String!
    image: String
    link: String
    }

    type Auth {
    token: ID!
    user: User
    }

    type Query {
    getSingleUser(id: ID!, username: String!): User
    me: User
    }

    type Mutation {
    createUser(username: String!, email: String!, password: String!); Auth
    login(email: String!, password: String!): Auth

    # We could probably use the Book type as input here but let's keep it like this for the moment
    saveBook(book: saveBookInput!): User
    deleteBook(bookId: ID!):  User
    }
`;

module.exports = typeDefs;