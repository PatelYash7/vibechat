'use client';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export const Providers = ({
	children,
	...props
}: { children: React.ReactNode } | ThemeProviderProps) => {
	return (
		<SessionProvider>
			<NextThemesProvider {...props}>{children}</NextThemesProvider>
		</SessionProvider>
	);
};
