const graphql = require('graphql');
const FriendModel = require('../database/models/friendModel');

const { 
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const FriendType = new GraphQLObjectType({
    name: 'Friend',
    fields: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt }
    }
});

const DeleteType = new GraphQLObjectType({
    name:'Delete',
    fields: {
        n: { type: GraphQLInt },
        ok: { type: GraphQLInt },
        deletedCount: { type: GraphQLInt }
    }
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

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // create a friend by passing name and age
        addFriend: {
            type: FriendType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: GraphQLInt }
            },
            resolve(parent, args) {
                const { name, age } = args;
                return FriendModel.create({ name, age });
            }
        },
        // update a friend by passing an id, name, and age
        updateFriend: {
            type: FriendType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                age: { type: GraphQLInt }
            },
            async resolve(parent, args) {
                const { id, name, age } = args;
                const doc = await FriendModel.findById(id);
                if (name) doc.name = name;
                if (age) doc.age = age;
                return doc.save()
            }
        },
        // delete a friend by passing an id
        deleteFriend: {
            type: DeleteType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            async resolve(parent, args) {
                const { id } = args;
                return FriendModel.deleteOne({ _id: id });
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});