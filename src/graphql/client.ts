import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) =>
            console.error(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
        );
    }
    if (networkError) {
        console.error(`[Network error]: ${networkError}`);
    }
});

// HTTP link - use relative URL to leverage Vite proxy
const httpLink = new HttpLink({
    uri: '/graphql',  // Changed from http://localhost:8080/graphql to use Vite proxy
    credentials: 'include',  // Changed from 'same-origin' to handle CORS properly
    headers: {
        'Content-Type': 'application/json',
    },
});

export const apolloClient = new ApolloClient({
    link: from([errorLink, httpLink]),
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    getShows: {
                        merge(existing, incoming) {
                            return incoming;
                        },
                    },
                    getSeats: {
                        merge(existing, incoming) {
                            return incoming;
                        },
                    },
                },
            },
        },
    }),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
            errorPolicy: 'all',
        },
        query: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
        },
        mutate: {
            errorPolicy: 'all',
        },
    },
});
