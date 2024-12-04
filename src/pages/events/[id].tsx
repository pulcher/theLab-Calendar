import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/layout';
import { CompleteEvent } from '@/schemas';
import { jwtDecode } from 'jwt-decode';
import nookies from 'nookies';
import { env } from 'process';
// I shoud make a custom event object interface...

const API_URL = env.API_URl;
interface EventInterface {
	id: number;
	name: string;
	description: string;
	startTime: number;
	endTime: number;
	membersOnly: boolean;
	totalSeats: number;
	availableSeats: number;
}

interface EventDetailsProps {
	event: CompleteEvent;
	isRSVPed: boolean;
	isOwner: boolean;
	accessToken: string;
}

const EventDetails = ({
	event,
	isRSVPed,
	isOwner,
	accessToken,
}: EventDetailsProps) => {
	const [userRSVPed, setUserRSVPed] = useState<boolean>(isRSVPed);
	const {
		name,
		category,
		location,
		startTime,
		endTime,
		reqMaterials,
		description,
		exclusivity,
		specialNotes,
	} = event;

	const dateOptions: Intl.DateTimeFormatOptions = {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
	};
	const timeOptions: Intl.DateTimeFormatOptions = {
		hour: 'numeric',
		minute: 'numeric',
		hour12: true,
	};
	const formattedStartDate = new Date(startTime)
		.toLocaleDateString('en-US', dateOptions)
		.replace(/\d{1,2}(st|nd|rd|th)/, '$& ');
	const formattedStartTime = new Date(startTime).toLocaleTimeString(
		'en-US',
		timeOptions
	);
	const formattedEndTime = new Date(endTime).toLocaleTimeString(
		'en-US',
		timeOptions
	);

	const hasEventPassed = new Date() > new Date(startTime);

	const handleRSVP = () => {
		fetch(`${API_URL}/api/events/${event.id}/rsvp`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},

			body: JSON.stringify({
				operation: userRSVPed ? 'remove' : 'create',
			}),
		})
			.then((res) => {
				if (res.ok) {
					setUserRSVPed(!userRSVPed);
					toast.success("Successfully RSVP'd", {
						position: 'top-center',
					});
				} else {
					toast.error('RSVP failed', {
						position: 'top-center',
					});
				}
			})
			.catch((err) => {
				toast.error('RSVP failed', {
					position: 'top-center',
				});
			});
	};

	return (
		<Layout headerText="Event Details">
			<div className="header">
				<div className="container m-auto p-10">
					<table className="table-auto m-auto">
						<tbody>
							<tr className="border-t border-gray-200">
								<td className="px-4 py-2 font-semibold">Title</td>
								<td className="px-4 py-2">{name}</td>
							</tr>
							<tr className="border-t border-gray-200">
								<td className="px-4 py-2 font-semibold">Location</td>
								{/* <td className="px-4 py-2">{locationName}</td> */}
							</tr>
							<tr className="border-t border-gray-200">
								<td className="px-4 py-2 font-semibold">Category</td>
								{/* <td className="px-4 py-2">{categoryName}</td> */}
							</tr>
							<tr className="border-t border-gray-200">
								<td className="px-4 py-2 font-semibold">Start Time</td>
								<td className="px-4 py-2">
									{formattedStartDate} @ {formattedStartTime} -{' '}
									{formattedEndTime}
								</td>
							</tr>
							<tr className="border-t border-gray-200">
								<td className="px-4 py-2 font-semibold">Exclusivity</td>
								<td className="px-4 py-2">{exclusivity}</td>
							</tr>
							<tr className="border-t border-gray-200">
								<td className="px-4 py-2 font-semibold">Required Materials</td>
								<td className="px-4 py-2">{reqMaterials}</td>
							</tr>
							<tr className="border-t border-gray-200">
								<td className="px-4 py-2 font-semibold">Description</td>
								<td className="px-4 py-2">{description}</td>
							</tr>
							<tr className="border-t border-gray-200">
								<td className="px-4 py-2 font-semibold">Special Notes</td>
								<td className="px-4 py-2">{specialNotes}</td>
							</tr>
							<tr>
								<td className="px-4 py-2 font-semibold">Actions</td>
								<td className="px-4 py-2">
									{!isOwner &&
										(hasEventPassed ? (
											<button
												className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mx-2"
												style={{ cursor: 'default' }}
											>
												Event Has Passed
											</button>
										) : (
											<button
												className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mx-2"
												onClick={handleRSVP}
											>
												{userRSVPed ? 'Cancel RSVP' : 'RSVP'}
											</button>
										))}
									{isOwner && (
										<>
											<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2">
												Edit
											</button>
											<button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-2">
												Delete
											</button>
										</>
									)}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</Layout>
	);
};

interface ApiEvent {
	id: number;
	name: string;
	description: string;
	start: number; // UNIX timestamp
	end: number; // UNIX timestamp
	membersOnly: boolean;
	totalSeats: number;
	availableSeats: number;
	creatorId?: number;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	let isOwner = false;
	const { accessToken } = nookies.get(context);
	// console.log('CONTEXT: ' + context);
	// console.log('ACC?:' + accessToken);
	if (accessToken) {
		try {
			const decoded: { userId: string } = jwtDecode(accessToken);
			const userId = decoded.userId;

			if (!context.params || !context.params.id) {
				return { notFound: true };
			}

			const { id } = context.params;
			if (typeof id !== 'string') {
				return { notFound: true };
			}

			const response = await fetch(`${API_URL}/api/events/${id}`);
			const receivedEvent = await response.json();

			if (!response.ok) {
				console.error('Error response:', receivedEvent);
				throw new Error(
					`Failed to fetch event: ${response.status} ${response.statusText}`
				);
			}

			const event = {
				...receivedEvent,
				startTime: new Date(receivedEvent.start * 1000).toISOString(),
				endTime: new Date(receivedEvent.end * 1000).toISOString(),
			};

			isOwner = Number(userId) === Number(event.creatorId);

			return { props: { event, isOwner, accessToken } };
		} catch (error) {
			console.error('Error decoding token or fetching event:', error);
			return { notFound: true };
		}
	} else {
		console.log('No access token found');
		return { notFound: true };
	}
};

export default EventDetails;
