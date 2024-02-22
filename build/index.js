"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const cors_1 = __importDefault(require("cors"));
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    const PORT = Number(process.env.PORT) || 4000;
    const gqlServer = new server_1.ApolloServer({
        typeDefs: `
            type Book {
                title: String
            }

            type Query {
                books: [Book]
                sayName(name: String): String
            }
        `,
        resolvers: {
            Query: {
                books: () => [{ title: "Hell oworld" }],
                sayName: (_, { name }) => `Hello ${name}.`
            }
        },
    });
    yield gqlServer.start();
    app.use('/graphql', (0, cors_1.default)(), express_1.default.json(), (0, express4_1.expressMiddleware)(gqlServer));
    app.get('/', (req, res) => {
        return res.json({ message: 'Server running on base route' });
    });
    app.listen(PORT, () => console.log(`Server started at ${PORT}`));
});
init();