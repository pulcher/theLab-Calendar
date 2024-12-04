// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import type { EventStore, ErrorResponse } from '@/pages/api/data/dataTypes';
import { promises as fs } from 'fs';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<EventStore | ErrorResponse>
) {
	if (req.method === 'GET') {
		const eventStore: EventStore = JSON.parse(
			await fs.readFile(
				process.cwd() + '/src/pages/api/data/eventStore.json',
				'utf8'
			)
		);
		res.status(200).json(eventStore);
	} else {
		res.status(405).send({ error: 'Method Not Allowed' });
	}
}
