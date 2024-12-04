import type { ReactNode } from 'react';
import Header from './header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
interface LayoutProps {
	children: ReactNode;
	headerText: string;
}
export default function Layout({ children, headerText }: LayoutProps) {
	return (
		<div className="mx-10">
			<Header title={headerText} />
			<div className="flex flex-col mx-auto" id="contents">
				{children}
			</div>
			<ToastContainer />
		</div>
	);
}
