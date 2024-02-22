import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';

const init = async () => {
	const app = express();

	const PORT = Number(process.env.PORT) || 4000;

	const gqlServer = new ApolloServer({
		typeDefs:`
            type Book {
                title: String
            }

            type Query {
                books: [Book]
                sayName(name: String): String
            }
        `,
		resolvers:{
            Query: {
                books: () => [{title: "Hell oworld"}],
                sayName: (_, {name}:{name:String}) => `Hello ${name}.` 
            }
        },
	});

	await gqlServer.start();

    app.use('/graphql', cors<cors.CorsRequest>(), express.json(), expressMiddleware(gqlServer));

	app.get('/', (req, res) => {
		return res.json({ message: 'Server running on base route' });
	});

	app.listen(PORT, () => console.log(`Server started at ${PORT}`));
};

init();