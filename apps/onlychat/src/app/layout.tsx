import type { Metadata } from 'next';
import './globals.css';
import { Manrope } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Providers } from '@/components/providers';
const fontSans = Manrope({
	subsets:['latin'],
	variable: '--man-rope',
	weight: ["400", "500", "600", "700"],
});


export const metadata: Metadata = {
	title: 'onlychat',
	description: 'A Chat application.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' suppressHydrationWarning={true}>
			<body
				// suppressHydrationWarning={true}
				className={cn('min-h-screen bg-background antialiased', fontSans.variable)}
			>
				<Providers
					attribute='class'
					defaultTheme='system'
					enableSystem={true}
					disableTransitionOnChange
				>
					{children}
				</Providers>
			</body>
		</html>
	);
}
