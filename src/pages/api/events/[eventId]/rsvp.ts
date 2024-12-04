import type { NextApiRequest, NextApiResponse } from 'next';
import type {
	EventStore,
	UserStore,
	ErrorResponse,
} from '@/pages/api/data/dataTypes';
import { promises as fs } from 'fs';

type Data = {
	userID: number;
	eventID: number;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data | ErrorResponse>
) {
	if (req.method === 'POST') {
		// console.log(req.headers);
		const users: UserStore = JSON.parse(
			await fs.readFile(
				process.cwd() + '/src/pages/api/data/userStore.json',
				'utf8'
			)
		);
		const eventStore: EventStore = JSON.parse(
			await fs.readFile(
				process.cwd() + '/src/pages/api/data/eventStore.json',
				'utf8'
			)
		);
		const authType = (req.headers.authorization || '').split(' ')[0];
		const authBody = (req.headers.authorization || '').split(' ')[1];
		const eventIdStr = req.query.eventId;
		const eventId = parseInt(eventIdStr as string, 10);

		if (authType === 'Bearer' && authBody) {
			const userID = users.find((user) => user.jwt === authBody)?.id || null;
			if (!userID) {
				// Bad bearer JWT
				res.status(401).json({ error: 'Unauthorized' });
			}
			if (userID && eventStore.find((event) => event.id === eventId)) {
				res.status(200).json({ userID: userID, eventID: eventId });
			} else {
				// Bad event ID
				res.status(404).json({ error: 'Event not found' });
			}
		}
	} else {
		// Handle any other HTTP method
		res.status(405).json({ error: 'Method not allowed' });
	}
}
