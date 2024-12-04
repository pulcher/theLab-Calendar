import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
const secretKey = process.env.JWT_SECRET || '';
import * as jose from 'jose';

const jwtConfig = {
	secret: new TextEncoder().encode(secretKey),
};

export async function middleware(req: NextRequest) {
	// Get the accessToken from cookies
	const token = req.cookies.get('accessToken')?.value;

	if (!token) {
		console.log('No [ACCESS-TOKEN] found');
		return NextResponse.redirect(new URL('/', req.url));
	}

	try {
		// Verify the JWT token
		//console.log(secretKey, jwtConfig.secret);
		//const decoded = jwt.verify(token, secretKey);
		console.log('NERD! 🤓');
		const decoded = jose.jwtVerify(token, jwtConfig.secret);
		if (decoded && typeof decoded === 'object') {
			return NextResponse.next();
		} else {
			console.log('Access denied - Role not authorized');
			return NextResponse.redirect(new URL('/unauthorized', req.url)); // Redirect to unauthorized page
		}
	} catch (error) {
		console.error('Token verification failed:', error);
		return NextResponse.redirect(new URL('/login', req.url)); // Redirect to login on error
	}
}

export const config = {
	// matcher: ['/events/create', '/admin', '/events/queue'],
	matcher: [],
};
