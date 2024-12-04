// import { GetServerSideProps } from 'next';
// import Layout from '../../components/layout';
// import { prisma } from '@/helpers/db';
// import { Category, Location } from '@prisma/client';
// import { Formik, Field, Form, FormikHelpers } from 'formik';
// import { DoubleField, GenericField } from '@/components/form/GenericField';
// import { AccountRoles } from '@/interfaces/roles';
// import {
// 	CreateEventForm,
// 	CreateEventFormType,
// } from '@/schemas/forms/createEventForm';
// import { toFormikValidationSchema } from 'zod-formik-adapter';
// import { CreateEventSchema } from '@/schemas/api/createEvent';
// import { toast } from 'react-toastify';
// import { useRouter } from 'next/router';
// interface CreateEventPageProps {
// 	categories: Category[];
// 	locations: Location[];
// }

// export const getServerSideProps: GetServerSideProps<
// 	CreateEventPageProps
// > = async () => {
// 	const categories = await prisma.category.findMany({});
// 	const locations = await prisma.location.findMany({});
// 	return {
// 		props: {
// 			categories,
// 			locations,
// 		},
// 	};
// };
// const AccountRoless = Object.keys(AccountRoles).filter(
// 	(k) => typeof AccountRoles[k as any] === 'number'
// );

// function CreateEventPage(props: CreateEventPageProps) {
// 	const { categories, locations } = props;
// 	const router = useRouter();
// 	const initialValues: CreateEventFormType = {
// 		title: '',
// 		name: '',
// 		categoryId: ' ',
// 		locationId: ' ',
// 		startDate: '',
// 		endDate: '',
// 		startTime: '',
// 		endTime: '',
// 		description: '',
// 		reqMaterials: '',
// 		minAttendence: 0,
// 		maxAttendence: 1,
// 		minAge: '0',
// 		specialNotes: '',
// 		exclusivity: AccountRoles.GUEST,
// 	};
// 	const locationOptions = [
// 		{ value: ' ', label: 'Select a location' },
// 		...locations.map((location) => ({
// 			value: location.id,
// 			label: location.title,
// 		})),
// 	];

// 	const categoryOptions = [
// 		{ value: ' ', label: 'Select a category' },
// 		...categories.map((category) => ({
// 			value: category.id,
// 			label: category.title,
// 		})),
// 	];

// 	const ageOptions = [
// 		{ value: '0', label: 'All Ages' },
// 		{ value: '18', label: '18+' },
// 		{ value: '21', label: '21+' },
// 	];

// 	return (
// 		<Layout headerText="Create Event">
// 			<div className="flex flex-row overflow-x-auto my-8">
// 				<Formik
// 					initialValues={initialValues}
// 					onSubmit={async (values, { setSubmitting }) => {
// 						const startDateTime = new Date(
// 							`${values.startDate}T${values.startTime}`
// 						);
// 						const endDateTime = new Date(`${values.endDate}T${values.endTime}`);

// 						const data = CreateEventSchema.parse({
// 							...values,
// 							startTime: startDateTime,
// 							endTime: endDateTime,
// 						});

// 						const result = await fetch('/api/events/create', {
// 							method: 'POST',
// 							body: JSON.stringify(data),
// 						});
// 						const eventCreated = await result.json();
// 						if (result) {
// 							toast.success('Event created successfully!');
// 							await new Promise((resolve) => setTimeout(resolve, 10000));
// 							router.push(`/events/${eventCreated.id}`);
// 						} else {
// 							toast.error('There was an error creating your event.');
// 						}
// 					}}
// 					validationSchema={toFormikValidationSchema(CreateEventForm)}
// 				>
// 					{({ errors, touched, isSubmitting }) => (
// 						<Form className="flex flex-col w-full">
// 							<div className="flex h-full">
// 								<div className="w-2/5 pr-4 flex flex-col">
// 									<GenericField
// 										name="title"
// 										title="Event Name"
// 										type="text"
// 										errors={errors}
// 										touched={touched}
// 									/>
// 									<GenericField
// 										name="categoryId"
// 										title="Category"
// 										component="select"
// 										errors={errors}
// 										touched={touched}
// 										options={categoryOptions}
// 									/>
// 									<GenericField
// 										name="locationId"
// 										title="Location"
// 										component="select"
// 										errors={errors}
// 										touched={touched}
// 										options={locationOptions}
// 									/>
// 									<DoubleField
// 										title="Start Date"
// 										errors={errors}
// 										touched={touched}
// 										fields={[
// 											{ name: 'startDate', type: 'date' },
// 											{ name: 'startTime', type: 'time' },
// 										]}
// 									/>

// 									<DoubleField
// 										title="End Date"
// 										errors={errors}
// 										touched={touched}
// 										fields={[
// 											{ name: 'endDate', type: 'date' },
// 											{ name: 'endTime', type: 'time' },
// 										]}
// 									/>

// 									<label
// 										htmlFor="exclusivity"
// 										className="block text-sm font-semibold mt-4 mb-2"
// 									>
// 										Exclusivity:
// 									</label>
// 									<div className="relative w-full">
// 										<Field
// 											name="exclusivity"
// 											type="range"
// 											min={1}
// 											max={AccountRoless.length}
// 											step={1}
// 											className="w-full"
// 										/>
// 										<div className="flex justify-between mt-2">
// 											{AccountRoless.map((AccountRoles, index) => (
// 												<span key={index} className="text-xs">
// 													{AccountRoles}
// 												</span>
// 											))}
// 										</div>
// 									</div>
// 								</div>

// 								<div className="w-3/5 pl-4 flex flex-col">
// 									<div className="flex">
// 										<div className="w-1/3 pr-2">
// 											<GenericField
// 												name="minAttendence"
// 												title="Min Attendees"
// 												type="number"
// 												errors={errors}
// 												touched={touched}
// 											/>
// 										</div>

// 										<div className="w-1/3 px-1">
// 											<GenericField
// 												name="maxAttendence"
// 												title="Max Attendees"
// 												type="number"
// 												errors={errors}
// 												touched={touched}
// 											/>
// 										</div>

// 										<div className="w-1/3 pl-2">
// 											<GenericField
// 												name="minAge"
// 												title="Minimum Age"
// 												component="select"
// 												errors={errors}
// 												touched={touched}
// 												options={ageOptions}
// 											/>
// 										</div>
// 									</div>

// 									<div className="flex mt-4">
// 										<div className="w-1/2 pr-2">
// 											<GenericField
// 												name="description"
// 												title="Description"
// 												component="textarea"
// 												errors={errors}
// 												touched={touched}
// 												rows={4}
// 											/>
// 										</div>

// 										<div className="w-1/2 pl-2">
// 											<GenericField
// 												name="specialNotes"
// 												title="Special Notes"
// 												component="textarea"
// 												errors={errors}
// 												touched={touched}
// 												rows={4}
// 											/>
// 										</div>
// 									</div>

// 									<div className="mt-4">
// 										<GenericField
// 											name="reqMaterials"
// 											title="Required Materials"
// 											component="textarea"
// 											errors={errors}
// 											touched={touched}
// 											rows={4}
// 										/>
// 									</div>

// 									<div className="flex mt-4">
// 										<button
// 											className="w-1/2 px-4 py-2 bg-blue-500 text-white font-semibold rounded mr-2"
// 											disabled={true}
// 										>
// 											Save Event as Template
// 										</button>
// 										<Field
// 											component="select"
// 											name="templateId"
// 											className="w-1/2 px-4 py-2 border border-gray-300 rounded ml-2"
// 										>
// 											<option value={0}>Browse Templates</option>
// 										</Field>
// 									</div>
// 								</div>
// 							</div>

// 							<button
// 								disabled={isSubmitting}
// 								type="submit"
// 								className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded self-end"
// 							>
// 								Create Event
// 							</button>
// 						</Form>
// 					)}
// 				</Formik>
// 			</div>
// 		</Layout>
// 	);
// }

// export default CreateEventPage;
