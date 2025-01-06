import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
export { default } from 'next-auth/middleware';

// You can add protected routing based on user roles.
export async function middleware(req: any) {
	const token = await getToken({ req });

	if (!token) {
		return NextResponse.redirect(new URL('/api/auth/signin', req.url));
	}

	if (req.nextUrl.pathname.startsWith('/admin')) {
		if (token.role !== 'Admin') {
			return NextResponse.redirect(new URL('/', req.url));
		}
	}
	return NextResponse.next();
}

export const config = {
	// Add your protected routes in matcher.
	matcher: [],
};
