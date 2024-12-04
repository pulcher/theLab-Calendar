import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || '';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const { cookies } = req;
	const token = cookies.accessToken;

	if (token) {
		try {
			const decoded = jwt.verify(token, secretKey);
			if (decoded && typeof decoded === 'object') {
				return res
					.status(200)
					.json({ user: { id: decoded.sub, name: decoded.name } });
			} else {
				return res.status(401).json({ error: 'Invalid token payload' });
			}
		} catch (error) {
			console.error(error);
			return res.status(401).json({ error: 'Invalid token' });
		}
	}

	return res.status(401).json({ error: 'No token provided' });
}

// import { NextApiRequest, NextApiResponse } from 'next';
// import { jwtVerify } from 'jose';

// const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || '');

// export default async function handler(
// 	req: NextApiRequest,
// 	res: NextApiResponse
// ) {
// 	const { cookies } = req;
// 	const token = cookies.accessToken;

// 	if (token) {
// 		try {
// 			const { payload } = await jwtVerify(token, secretKey);
// 			if (payload && typeof payload === 'object') {
// 				return res
// 					.status(200)
// 					.json({ user: { id: payload.sub, name: payload.name } });
// 			} else {
// 				return res.status(401).json({ error: 'Invalid token payload' });
// 			}
// 		} catch (error) {
// 			console.error(error);
// 			return res.status(401).json({ error: 'Invalid token' });
// 		}
// 	}

// 	return res.status(401).json({ error: 'No token provided' });
// }
