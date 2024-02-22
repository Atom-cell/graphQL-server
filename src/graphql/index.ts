import { ApolloServer } from '@apollo/server';
import { prismaClient } from '../lib/db';
import { User } from './user';

const createApolloGraphqlServer = async () => {
	const gqlServer = new ApolloServer({
		typeDefs: `
            type Query {
                hello: String
            }

            type Mutation {
                ${User.mutations}
            }
        `,
		resolvers: {
			Query: {
                ...User.resolvers.queries
            },
			Mutation: {
                ...User.resolvers.mutations
            },
		},
	});

	await gqlServer.start();

	return gqlServer;
};

export default createApolloGraphqlServer;
