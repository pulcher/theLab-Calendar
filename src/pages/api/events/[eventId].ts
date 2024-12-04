import type { NextApiRequest, NextApiResponse } from 'next';
import type {
	EventType,
	EventStore,
	ErrorResponse,
} from '@/pages/api/data/dataTypes';
import { promises as fs } from 'fs';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<EventType | ErrorResponse>
) {
	if (req.method === 'GET') {
		//console.log(req.headers);
		const eventStore: EventStore = JSON.parse(
			await fs.readFile(
				process.cwd() + '/src/pages/api/data/eventStore.json',
				'utf8'
			)
		);
		const eventIdStr = req.query.eventId;
		const eventId = parseInt(eventIdStr as string, 10);

		const theEvent = eventStore.find((event) => event.id === eventId);
		if (theEvent) {
			res.status(200).json(theEvent);
		} else {
			// Bad event ID
			res.status(404).json({ error: 'Event not found' });
		}
	} else {
		// Handle any other HTTP method
		res.status(405).json({ error: 'Method not allowed' });
	}
}
