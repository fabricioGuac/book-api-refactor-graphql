require('dotenv').config({ path: '../.env' });
const express = require('express');
const {ApolloServer} = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const {authMiddleware} = require('./utils/auth') 

const db = require('./config/connection');
// const routes = require('./routes');
const {typeDefs, resolvers} = require('./schemas');

const app = express();
const PORT = process.env.PORT || 3001;
const secret = process.env.SECRET;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const apolloServerStarter = async () => {

await server.start();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/graphql',  expressMiddleware(server, {
  context: authMiddleware,
}));


// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(`GraphQL available at http://localhost:${PORT}/graphql`);
    });
  });
};

apolloServerStarter();