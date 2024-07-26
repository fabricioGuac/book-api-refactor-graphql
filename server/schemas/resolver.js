// import user model
const {User} =  require('../models');

const { signToken, AuthError } = require('../utils/auth');

const resolvers = {
    Query: {
    // get the current logged in user
    me: async (parent, args, context) => {
        if (context.user) {
            return User.findOne({ _id: context.user._id });
        }
        throw AuthError;
        },
    },

    Mutation: {
    // create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
        createUser: async (parent, {username, email, password}) => {
            const user = await User.create({username, email, password});

            if(!user) {
                throw AuthError;
            }

            const token = signToken(user);

            return {token, user};
        },
    // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
        login: async (parent, {username ,email, password}) => {
            const user = await User.findOne({ $or: [{username}, {email}]});

            if(!user) {
                throw AuthError;
            }

            const correctPW = await user.isCorrectPassword(password);

            if(!correctPW){
                throw AuthError;
            }

            const token = signToken(user);

            return {token, user};
        },
    // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
        saveBook: async (parent, {book}, context) => {
        console.log(context.user);
        if (context.user){
            return User.findOneAndUpdate(
                {_id: context.user._id},
                {$addToSet: {savedBooks: book}},
                {new: true, runValidators: true},
            )
        }

        throw AuthError;
        },
  // remove a book from `savedBooks`
        deleteBook: async (parent, {bookId}, context) => {
        console.log(context.user);
        if (context.user){
            return User.findOneAndUpdate(
                {_id: context.user._id},
                { $pull: { savedBooks: { bookId } } },
                {new: true},
            )
        }

    throw AuthError;
    },
    }
}

module.exports = resolvers;
