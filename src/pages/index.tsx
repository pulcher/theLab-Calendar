import Layout from '../components/layout';
import Calendar from '../components/Calendar';
import { GetServerSideProps } from 'next';
import { EventInput } from '@fullcalendar/core';
import { env } from 'process';
interface ApiEvent {
	id: number;
	name: string;
	description: string;
	start: number; // UNIX timestamp
	end: number; // UNIX timestamp
	membersOnly: boolean;
	totalSeats: number;
	availableSeats: number;
}

export const getServerSideProps: GetServerSideProps = async () => {
	try {
		const API_URL = env.API_URL;
		const response = await fetch(`${API_URL}/api/events`);
		const text = await response.text(); // Read the response as text for debugging

		if (!response.ok) {
			throw new Error('Failed to fetch events: ' + text);
		}

		const events: ApiEvent[] = JSON.parse(text); // Parseing JSON after checking
		const conformedEvents: EventInput[] = events.map((calEvent: ApiEvent) => {
			const title = calEvent.name || 'Untitled Event';
			const fullCalEvent: EventInput = {
				title,
				start: new Date(calEvent.start * 1000).toISOString(),
				end: new Date(calEvent.end * 1000).toISOString(),
				url: `/events/${calEvent.id}`,
			};
			return fullCalEvent;
		});

		return {
			props: {
				events: conformedEvents,
			},
		};
	} catch (error) {
		console.error('Error fetching events:', error);
		return {
			props: {
				events: [],
			},
		};
	}
};

export default function IndexPage({ events }: { events: EventInput[] }) {
	return (
		<Layout headerText="Calendar View">
			<br />
			<div style={{ width: '100%' }}>
				<Calendar events={events} />
			</div>
		</Layout>
	);
}
