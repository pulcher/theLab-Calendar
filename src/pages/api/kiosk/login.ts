import type { NextApiRequest, NextApiResponse } from 'next';
import type { UserStore, ErrorResponse } from '@/pages/api/data/dataTypes';
import { promises as fs } from 'fs';

type Data = {
	accessToken: string;
};

let responseJwt: string | undefined = undefined;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data | ErrorResponse>
) {
	const users: UserStore = JSON.parse(
		await fs.readFile(
			process.cwd() + '/src/pages/api/data/userStore.json',
			'utf8'
		)
	);
	if (req.method === 'POST') {
		const { fobid } = req.body;
		console.log(`Received fobid: ${fobid}`);
		if (fobid !== undefined) {
			responseJwt = users.find((user) => user.id === Number(fobid))?.jwt;
		}

		if (responseJwt) {
			res.setHeader(
				'Set-Cookie',
				`accessToken=${responseJwt}; HttpOnly; Path=/; Max-Age=${
					30 * 24 * 60 * 60
				}; SameSite=Lax`
			);
			res.status(200).json({ accessToken: responseJwt });
		} else {
			res.status(401).json({ error: 'Unauthorized' });
		}
	} else {
		res.status(405).json({ error: 'Method not allowed' });
	}
}
