import { prisma } from "../../prisma/db";

export const friendResolver = {
  Query: {
    searchUsers: async (_: any, args: any, context: any) => {
      const userId = context.user?.userId;
      if (!userId) {
        return [];
      }
  
      const result = await prisma.user.findMany({
        take: 5,
        where: {
          AND: [
            { username: { contains: args.username, mode: "insensitive" } },
            { id: { not: userId } },
          ],
        },
      });
      return result;
    },
    myConfirmedFriends: async (_: any, __: any, context: any) => {
      const userId = context.user?.userId;
      if (!userId) {
        return [];
      }

      const confirmedFriends = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          friends: {
            where: {
              isPending: false,
              friend: {
                id: { not: userId },
              },
            },
            include: {
              friend: true,
            },
          },
          friendsOf: {
            where: {
              isPending: false,
              user: {
                id: { not: userId },
              },
            },
            include: {
              user: true,
            },
          },
        },
      });

      if (!confirmedFriends) {
        return [];
      }

      const combinedFriends = [
        ...confirmedFriends.friends.map((friendship) => friendship.friend),
        ...confirmedFriends.friendsOf.map((friendship) => friendship.user),
      ];

      const uniqueFriends = Array.from(
        new Map(combinedFriends.map((friend) => [friend.id, friend])).values()
      );
      console.log("friends", uniqueFriends);
      return uniqueFriends;
    },
    myReceivedInvites: async (_: any, __: any, context: any) => {
      console.log("Checking for received invites");
      const userId = context.user?.userId;
      if (!userId) {
        return [];
      }

      const receivedInvites = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          friendsOf: {
            where: {
              isPending: true, 
            },
            include: {
              user: true, 
            },
          },
        },
      });

      if (!receivedInvites) {
        return [];
      }

      const inviteSenders = receivedInvites.friendsOf.map(
        (invite) => invite.user
      );

      console.log("Received invites from", inviteSenders);
      return inviteSenders;
    },
  },

  Mutation: {
    addFriend: async (_: any, args: { friendId: number }, context: any) => {
      const userId = context.user?.userId;
      if (!userId) {
        throw new Error("Authentication required.");
      }
  
      if (args.friendId === userId) {
        throw new Error("You cannot add yourself as a friend.");
      }
  
      try {
        await prisma.friendship.create({
          data: {
            userId: userId,
            friendId: args.friendId,
            isPending: true,
          },
        });
        return "Friend request sent.";
      } catch (error) {
        throw new Error(`Failed to add friend: ${error.message}`);
      }
    },

    removeFriend: async (_: any, args: { friendId: number }, context: any) => {
      try {
        const deleteFriendship = await prisma.friendship.deleteMany({
          where: {
            OR: [
              { userId: context.user?.userId, friendId: args.friendId },
              { userId: args.friendId, friendId: context.user?.userId },
            ],
          },
        });

        if (deleteFriendship.count === 0) {
          throw new Error("Friendship not found.");
        }

        return "Friendship removed successfully."
        
      } catch (error) {
        throw new Error(`Failed to remove friend: ${error.message}`);
      }
    },

    acceptFriendRequest: async (_: any, args: { friendId: number }, context: any) => {
      console.log("AJSDASJD")
      const userId = context.user?.userId;
      if (!userId) {
          throw new Error("Authentication required.");
      }

      if (args.friendId === userId) {
          throw new Error("You cannot accept a friend request from yourself.");
      }

      try {
          const updateFriendship = await prisma.friendship.updateMany({
              where: {
                  userId: args.friendId, 
                  friendId: userId, 
                  isPending: true, 
              },
              data: {
                  isPending: false, 
              },
          });

          if (updateFriendship.count === 0) {
              throw new Error("Friend request not found or already accepted.");
          }

          return "Friend request accepted successfully.";
      } catch (error) {
          throw new Error(`Failed to accept friend request: ${error.message}`);
      }
  },

   
  },
};
