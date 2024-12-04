import { useRouter } from 'next/router';

// Fetch user session information
export const fetchUser = async () => {
	try {
		const response = await fetch('/api/auth/session', {
			credentials: 'include',
		});
		if (response.ok) {
			const data = await response.json();
			return data.user;
		}
	} catch (error) {
		console.error("Couldn't fetch user:", error);
	}
	return null;
};

// Handle user sign-in with fob ID
export const handleSignIn = async (fobid: string) => {
	if (!fobid) {
		alert('Fob ID is required for login.');
		return;
	}

	try {
		const response = await fetch('/api/kiosk/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ fobid: parseInt(fobid) }),
		});

		if (response.ok) {
			// alert('Login successful!');
			return true;
		} else {
			// ('Login failed. Please check your fob ID and try again.');
		}
	} catch (error) {
		console.error('Error during login:', error);
		alert('An error occurred during login. Please try again later.');
	}
	return false;
};

// Handle user sign-out
export const handleSignOut = async () => {
	try {
		const response = await fetch('/api/auth/signout', {
			method: 'POST',
			credentials: 'include',
		});
		if (response.ok) {
			return true;
		} else {
			console.error('Sign out failed:', response.statusText);
		}
	} catch (error) {
		console.error('Error signing out:', error);
	}
	return false;
};
