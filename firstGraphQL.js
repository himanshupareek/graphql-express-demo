const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const {
    GraphQLSchema,
    GraphQLObjectType, //to create dynamic objects
    GraphQLString
} = require ('graphql');

const app = express();
const port = 8081;

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'HelloWorld', //NOTE: it can't have space in its value, it will be Schema RootType
        fields: () => ({
            message: { 
                type: GraphQLString,
                resolve: () => 'Hello World'
            }
        })
    })
});
app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}));

app.listen(port, () => {
  console.log(`Server running ${port}`)
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})
  ;