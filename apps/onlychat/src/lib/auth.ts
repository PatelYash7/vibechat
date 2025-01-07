import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import prisma from '@/db';
import { CheckSignIn, CheckSignUp } from '@/zod/authentication';

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
					if (credentials.type === 'signin') {
						const isSignIN = CheckSignIn.parse(credentials);
						// Check if User exsist in database.
						try {
							const CheckUser = await prisma.user.findFirst({
								where: {
									MobileNumber: isSignIN.number,
								},
							});
							// To validate the password for the Login.

							const validatedPassword = await bcrypt.compare(
								isSignIN.password,
								CheckUser?.Password as string,
							);

							// If validatedPassword then return the CheckUser.
							if (validatedPassword) {
								return {
									id: CheckUser?.id,
									name: CheckUser?.Name,
									number: CheckUser?.MobileNumber,
								};
							} else {
								throw new Error('Invalid credentials');
							}
						} catch (error) {
							throw new Error('Cannot Find User');
						}
					}

					// If no User then Create a Entry in DB.
					if (credentials.type === 'signup') {
						const isSignUP = CheckSignUp.parse(credentials);
						const hashedpassword = await bcrypt.hash(isSignUP.password, 10);
						try {
							const newUser = await prisma.user.create({
								data: {
									Name: isSignUP.name,
									Password: hashedpassword,
									MobileNumber: isSignUP.number,
								},
							});
							return {
								id: newUser.id,
								name: newUser.Name,
								number: newUser.MobileNumber,
							};
						} catch (error) {
							throw new Error('Error Creating User');
						}
					}
					return false;
				} catch (e) {
					console.error('Authorization error:', e);
					return null;
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
		async jwt({ token, user }) {
			// if credential signin then we already have a user and you can create an token.
			if (user) {
				token.name = user.name;
				token.number = user.number;
			}
			return token;
		},
		async session({ token, session }) {
			if (token) {
				session.user.name = token.name;
				session.user.number = token.number;
			}
			return session;
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
