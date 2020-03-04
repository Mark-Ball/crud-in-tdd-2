const graphql = require('graphql');
const FriendModel = require('../database/models/friendModel');

const { 
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
} = graphql;

const FriendType = new GraphQLObjectType({
    name: 'Friend',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        //query for all friends
        friends: {
            type: new GraphQLList(FriendType),
            resolve(parent, args) {
                return FriendModel.find();
            }
        },
        //query for a friend by id
        friend: {
            type: FriendType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return FriendModel.findById(args.id);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});