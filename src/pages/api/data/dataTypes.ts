export type UserStore = {
	id: number;
	jwt: string;
}[];

export type EventType = {
	id: number;
	name: string;
	description: string;
	start: number;
	end: number;
	membersOnly: boolean;
	totalSeats: number;
	availableSeats: number;
};

export type EventStore = EventType[];

export type ErrorResponse = {
	error: string;
};
