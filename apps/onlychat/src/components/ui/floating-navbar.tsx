'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ModeToggle } from '../toggle';

export const FloatingNav = ({
	navItems,
	className,
}: {
	navItems: {
		name: string;
		link: string;
		icon?: JSX.Element;
	}[];
	className?: string;
}) => {
	const session = useSession();
  const router =useRouter();
	return (
		<AnimatePresence mode='wait'>
			<motion.div
				initial={{
					opacity: 0,
					y: -100,
				}}
				animate={{
					y: 0,
					opacity: 1,
				}}
				transition={{
					duration: 0.5,
				}}
				className={cn(
					'flex max-w-fit  fixed top-10 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-gray-950 bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-8 py-2  items-center justify-center space-x-4',
					className,
				)}
			>
				{navItems.map((navItem: any, idx: number) => (
					<Link
						key={`link=${idx}`}
						href={navItem.link}
						className={cn(
							'relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500',
						)}
					>
						<span className='block sm:hidden'>{navItem.icon}</span>
						<span className='hidden sm:block text-sm font-semibold text-black dark:text-white'>{navItem.name}</span>
					</Link>
				))}

				{session.data?.user.name ?
					<button onClick={()=>{}} className='border text-sm font-semibold  relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full'>
						<span>{session.data.user.name}</span>
					</button>
				:	<button onClick={()=>{router.push('/signin')}} className='border text-sm font-semibold relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full'>
						<span>Login</span>{' '}
					</button>
				  }
          <ModeToggle/>
			</motion.div>
		</AnimatePresence>
	);
};