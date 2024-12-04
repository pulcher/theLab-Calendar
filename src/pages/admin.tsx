// //import { useSession } from 'next-auth/react';
// import Layout from '../components/layout';
// import { useEffect, useState } from 'react';
// export default function AdminPage() {
// 	//const { data: session } = useSession();
// 	const [user, setUser] = useState<{ name: string; id: string } | null>(null);

// 	const fetchUser = async () => {
// 		const response = await fetch('/api/auth/session', {
// 			method: 'GET',
// 			credentials: 'include',
// 		});

// 		if (response.ok) {
// 			const data = await response.json();
// 			setUser(data.user);
// 		} else {
// 			setUser(null);
// 		}
// 	};

// 	const groups = ['Orange', 'Apple', 'Grape', 'Pear'];

// 	useEffect(() => {
// 		fetchUser();
// 	}, []);

// 	return (
// 		<Layout headerText="Calendar View">
// 			<br />
// 			You are an admin because you are in the following groups:
// 			<br />
// 			<ul>
// 				{groups?.map((group: string, index: number) => (
// 					<li key={index}>{group}</li>
// 				))}
// 			</ul>
// 		</Layout>
// 	);
// }
