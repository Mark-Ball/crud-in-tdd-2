require('dotenv').config();
const express = require('express');
const graphqlHTTP = require('express-graphql');
const cors = require('cors');

const routes = require('./routes');
const schema = require('./graphql/schema');

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

module.exports = app;