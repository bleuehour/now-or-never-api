import { prisma } from "../../prisma/db";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RegisterResponse, UserInput } from "src/types/userTypes";

export const userResolver = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      try {
        const getMe = await prisma.user.findUnique({
          where: {
            id: context.user?.userId,
          },
        });
        return getMe;
      } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("An error occurred while fetching the user.");
      }
    },
  },

  Mutation: {
    Login: async (_: any, { email, password }: UserInput): Promise<RegisterResponse> => {
      try {
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          throw new Error("User not found");
        }

        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
          throw new Error("Invalid password");
        }

        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET!, { expiresIn: '7d' });

        return {
          token,
          user,
        };
      } catch (error) {
        console.error("Error during login:", error);
        throw new Error("An error occurred during login.");
      }
    },

    Register: async (_: any, { username, email, password }: UserInput): Promise<RegisterResponse> => {
      try {
        if (username.length < 3) {
          throw new Error("Username must be at least 3 characters long");
        }
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters long");
        }

        if (!/^[a-zA-Z0-9]+$/.test(username)) {
          throw new Error("Username can only contain letters and numbers");
        }

        const existingUser = await prisma.user.findUnique({
          where: { email },
        });
        if (existingUser) {
          throw new Error("Email is already in use");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
          data: {
            username,
            email,
            password: hashedPassword,
          },
        });

        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET!, { expiresIn: '7d' });

        return {
          token,
          user,
        };
      } catch (error) {
        console.error("Error during registration:", error);
        throw new Error("An error occurred during registration.");
      }
    },
    
    DeleteUser: async (_: any, __: any, context: any) => {
      try {
        const user = await prisma.user.delete({
          where: {
            id: context.user?.userId,
          },
        });

        if (!user) {
          throw new Error("User not found or already deleted.");
        }

        return "User deleted successfully."
      } catch (error) {
        console.error("Error deleting user:", error);
        throw new Error("An error occurred while deleting the user.");
      }
    },
  },
};
