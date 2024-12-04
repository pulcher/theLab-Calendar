import Link from 'next/link';

export default function AccessDenied() {
	console.log('Access Denied!!!!');
	return (
		<>
			<h1>Access Denied</h1>
			<p>
				<Link
					href="#"
					onClick={(e) => {
						e.preventDefault();
						// Link to signin page
					}}
				>
					You must be signed in to view this page
				</Link>
			</p>
		</>
	);
}
