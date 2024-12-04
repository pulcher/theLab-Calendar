import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	console.log('Signing Out!');
	// Clear the cookie by setting max age to 0
	res.setHeader(
		'Set-Cookie',
		'accessToken=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0'
	);
	return res.status(200).json({ message: 'Successfully signed out' });
}
