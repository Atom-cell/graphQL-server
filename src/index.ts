import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { prismaClient } from './lib/db';

const init = async () => {
	const app = express();

	const PORT = Number(process.env.PORT) || 4000;

	const gqlServer = new ApolloServer({
		typeDefs: `
            type Book {
                title: String
            }

            type User {
                firstName: String
                lastName: String
                email: String
                password: String
                salt: String
            }

            type Query {
                books: [Book]
                sayName(name: String): String
                user: [User]
            }

            type Mutation {
                createUser(firstName: String!, lastName: String!, email: String!, password: String!):  Boolean
            }
        `,
		resolvers: {
			Query: {
				books: () => [{ title: 'Hell oworld' }],
				sayName: (_, { name }: { name: String }) =>
					`Hello ${name}. How are you to-day?`,
                user: async (_, args) => {
                    return await prismaClient.user.findMany();
                } 
                
			},
			Mutation: {
				createUser: async (
					_,
					{
						firstName,
						lastName,
						email,
						password,
					}: {
						firstName: string;
						lastName: string;
						email: string;
						password: string;
					}
				) => {
					await prismaClient.user.create({
                        data: {
                            firstName,
                            lastName,
                            email,
                            password,
                            salt: "random_salt"
                        }
                    })
                    return true;
				},
			},
		},
	});

	await gqlServer.start();

	app.use(
		'/graphql',
		cors<cors.CorsRequest>(),
		express.json(),
		expressMiddleware(gqlServer)
	);

	app.get('/', (req, res) => {
		return res.json({ message: 'Server running on base route' });
	});

	app.listen(PORT, () => console.log(`Server started at ${PORT}`));
};

init();
