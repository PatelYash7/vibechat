import { Clipboard } from '@/components/clipboard';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { FloatingNav } from '@/components/ui/floating-navbar';
import { IconHome, IconMessage, IconUser } from '@tabler/icons-react';
import { List } from 'lucide-react';
export default async function Home() {
	const navItems = [
		{
			name: 'Home',
			link: '/',
			icon: <IconHome className='h-4 w-4 text-neutral-500 dark:text-white' />,
		},
		{
			name: 'Docs',
			link: 'https://github.com/PatelYash7/saas-template',
			icon: <List className='h-4 w-4 text-neutral-500 dark:text-white' />,
		},
	];
	return (
		<>
			<FloatingNav navItems={navItems} />
			<AuroraBackground className='sm:px-48 manrope'>
				<div className=' text-xl sm:text-3xl md:text-5xl font-bold dark:text-white text-center'>
					Effortless NextJS Starter Kit for Developers
				</div>
				<div className='py-4'>
					<Clipboard />
				</div>
				<p className=' sm:text-xl md:text-xl px-12 sm:px-24 py-8 font-semibold dark:text-gray-400 text-gray-400  text-center'>
					This template is designed for modern developers who want to focus on
					business logic while minimizing setup time.
				</p>
			</AuroraBackground>
		</>
	);
}
