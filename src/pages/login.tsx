import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchUser, handleSignIn, handleSignOut } from '../helpers/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginPage() {
	const [inputValue, setInputValue] = useState('');
	const [user, setUser] = useState<{ name: string; id: string } | null>(null);
	const hiddenInputRef = useRef<HTMLInputElement>(null);
	const router = useRouter();

	useEffect(() => {
		if (hiddenInputRef.current) {
			setTimeout(() => {
				hiddenInputRef.current?.focus();
				console.log('Input focused');
			}, 100);
		}
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			const userData = await fetchUser();
			if (userData) setUser(userData);
		};
		fetchData();
	}, []);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value);
	};

	const handleFormSubmit = async () => {
		const success = await handleSignIn(inputValue);

		if (success) {
			const userData = await fetchUser();
			setUser(userData);
			router.push('/'); // go to home page
		} else {
			toast.error('Keycard verification failed. Please try again.', {
				position: 'top-center',
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: false,
			});
		}

		setInputValue('');
		if (hiddenInputRef.current) {
			hiddenInputRef.current.focus();
		}
	};

	// handle blur event (when the input loses focus)
	const handleBlur = () => {
		if (inputValue === '') {
			console.log('Input field lost focus but has no value');
		} else {
			console.log('Input field lost focus with value:', inputValue);
			handleFormSubmit(); // auto submit after the blur event if there is a value
		}

		// refocus the input if it's not focused and still needs to listen for input
		if (hiddenInputRef.current && !hiddenInputRef.current.matches(':focus')) {
			hiddenInputRef.current.focus();
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault(); // prevent the default behavior (form submission)
			handleFormSubmit(); // trigger form submission
		}
	};

	return (
		<div
			className="login-page bg-cover bg-center bg-no-repeat min-h-screen"
			style={{
				backgroundImage: 'url(/images/green_frutiger_aero_wallpaper_small.jpg)', // Default background for larger screens
			}}
		>
			{/* Responsive background images using Tailwind for different screen sizes */}
			<div className="absolute inset-0 bg-cover bg-center sm:bg-[url('/images/green_frutiger_aero_wallpaper_small.jpg')] md:bg-[url('/images/GBRYDp1akAA-ggX.jpg')] lg:bg-[url('/images/GBRYDp1akAA-ggX.jpg')]">
				<div className="flex justify-center items-center w-full h-full px-4">
					<h1 className="text-gray text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center leading-tight max-w-full animate-glow-pulse">
						Swipe Key Card To Sign In
					</h1>
				</div>
			</div>

			<div className="absolute inset-0 flex justify-center items-center px-4">
				<form
					onSubmit={(e) => e.preventDefault()}
					className="flex flex-col items-center"
				>
					{/* Hidden input box for keycard swipe */}
					<input
						type="text"
						ref={hiddenInputRef}
						value={inputValue}
						onChange={handleInputChange}
						onBlur={handleBlur} // form submit on blur if input is valid
						onKeyDown={handleKeyDown} // form submit on Enter key press
						placeholder="Enter Keycard ID"
						className="border p-2 rounded-md mb-4 absolute -z-10" // keeps it hidden
						aria-label="Keycard ID"
					/>
				</form>
			</div>

			<ToastContainer />
		</div>
	);
}
