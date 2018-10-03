const axios = require('axios');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

// Message Type
const MessageType = new GraphQLObjectType({
    name: 'Message',
    fields: () => ({
        id: { type: GraphQLString },
        userName: { type: GraphQLString },
        userId: { type: GraphQLString },
        message: { type: GraphQLString },
        timestamp: { type: GraphQLString },
    })
})

// Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        message: {
            type: MessageType,
            args: {
                id: { type: GraphQLString }
            },
            resolve(parentValue, args) {
                return axios.get('http://localhost:4001/' + args.id)
                .then(res => res.data)
            }
        },
        messages: {
            type: new GraphQLList(MessageType),
            resolve(parentValue, args) {
                return axios.get('http://localhost:4001/')
                    .then(res => res.data)
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addMessage: {
            type: MessageType,
            args: {
                userName: { type: new GraphQLNonNull(GraphQLString) },
                userId: { type: new GraphQLNonNull(GraphQLString) },
                message: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parentValue, args) {
                return axios.post('http://localhost:4001/', {
                    userName: args.userName,
                    userId: args.userId,
                    message: args.message,
                })
                .then(res => res.data)
            }
        },
        deleteMessage: {
            type: MessageType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parentValue, args) {
                return axios.delete('http://localhost:4001/' + args.id)
                    .then(res => res.data)
            }
        },
        editMessage: {
            type: MessageType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                userName: { type: new GraphQLNonNull(GraphQLString) },
                userId: { type: new GraphQLNonNull(GraphQLString) },
                message: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parentValue, args) {
                console.log('ARGS ID: ', args.id);
                return axios.patch('http://localhost:4001/' + args.id, args)
                    .then(res => res.data)
            }
        },
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation,
});
