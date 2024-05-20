export const typeDefs = `#graphql

   type Query {
    getTodos: [todo],
    test: String
    getFriends:[user]
    getUser:[user]
    getInvites:[user]
    me:user
    searchUsers(username:String):[user]
    myConfirmedFriends: [user!]!
    myReceivedInvites:[user!]!
}

  type User {
    id: ID!
    username: String!
    email: String!
    # Add other user fields as necessary
  }
  
  type AuthPayload {
    token: String!
    user: User!
  }

  type Mutation {
    acceptFriendRequest(friendId:Int):String
    createTodo(text:String): String
    deleteTodo(id:Int):String
    updateDone(id:Int,isComplete:Boolean):String
    recurringDone(id:Int,isRecurring:Boolean):String
    updateStreak:String
    Register(username:String,password:String,email:String):AuthPayload!
    Login(email:String,password:String,):AuthPayload!
    sendRequest(username:String):String
    acceptRequest(id:Int):String
    declineRequest(id:Int):String
    addFriend(friendId: Int!): String!
    removeFriend(friendId: Int!): String!
    DeleteUser:String

  }



`;

