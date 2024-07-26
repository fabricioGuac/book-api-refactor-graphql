import './App.css';

import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import { Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';

const httpLink = createHttpLink({
  uri: '/graphql',
});


// Middleware to attach the token to every request header
const authLink = setContext((_, {headers}) => {

  const token = localStorage.getItem('id_token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "", 
    }
  }
})

// Set up the client to execute the authLink middleware
const client = new ApolloClient({
  link: authLink.concat(httpLink),
})



function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
