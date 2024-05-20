export const schemaDefs = `#graphql

  type todo  {
    id: Int
    text: String
    createdAt: String
    userId:String
    isComplete:Boolean
    isRecurring:Boolean

  }

 type user  {
  id: Int
  username: String
  email: String
  todos: [todo]
  streak: Int
  friends:[Friendship]
  friendsOf:[Friendship]


}


  type Friendship {
    id:Int     
    userId:Int
    friendId:Int
    isPending:Boolean
    }
  


`;
