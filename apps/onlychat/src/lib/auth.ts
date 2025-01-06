
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import prisma from '@/db';

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			id: 'credentials',
			name: 'Credentials',
			credentials: {
				name: { label: 'Name', type: 'name', placeholder: 'Yash Patel' },
				password: { label: 'Password', type: 'password' },
				number: { label: 'Number', type: 'number' },
			},
			async authorize(credentials: any): Promise<any> {
				try {
					// Check if User exsist in database.
					const CheckUser = await prisma.user.findFirst({
						where: {
							MobileNumber: credentials.number,
						},
					});
					// If no User then Create a Entry in DB.
					if (!CheckUser) {
						const hashedpassword = await bcrypt.hash(credentials.password, 10);
						const User = await prisma.user.create({
							data: {
								Name: credentials.name,
								Password: hashedpassword,
								MobileNumber: credentials.number,
							},
						});
						return {
							id: User.id,
							name: User.Name,
							number: User.MobileNumber,
						};
					}
					// To validate the password for the Login.
					const validatedPassword = await bcrypt.compare(
						credentials.password,
						CheckUser.Password as string,
					);
					// If validatedPassword then return the CheckUser.
					if (validatedPassword) {
						return {
							id: CheckUser.id,
							name: CheckUser.Name,
							number: CheckUser.MobileNumber,
						};
					}
					return false;
				} catch (e) {
					return false;
				}
			},
		}),
	],
	// Your Secrets
	secret: process.env.NEXTAUTH_SECRET,

	// Your signin signup pages on Custom route.
	pages: {
		signIn: '/signin',
		newUser: '/signup',
	},
	callbacks: {
		async jwt({ token, user, profile, account }) {
			// if credential signin then we already have a user and you can create an token.
			if (user) {
				token.id = user.id;
				token.name = user.name;
				token.number = user.number;
			}
			return token;
		},
		async session({ token, session, user }) {
			if (token) {
				session.user.id = token.id;
				session.user.name = token.name;
				session.user.number = token.number;
			}
			return session;
		},
		async signIn({ account, profile, token }: any) {
			return true;
		},
	},
	jwt: {
		maxAge: 30 * 24 * 60 * 60,
	},
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60,
	},
};
