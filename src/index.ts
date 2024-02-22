import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import createApolloGraphqlServer from './graphql';

const init = async () => {
    const app = express();

	const PORT = Number(process.env.PORT) || 4000;
 
	app.use(
		'/graphql',
		cors<cors.CorsRequest>(),
		express.json(),
		expressMiddleware(await createApolloGraphqlServer())
	);

	app.get('/', (req, res) => {
		return res.json({ message: 'Server running on base route' });
	});

	app.listen(PORT, () => console.log(`Server started at ${PORT}`));
};

init();
