'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { handleSearch } from '@/action/handleSearch';
import { UserType } from '@/types/types';
import { useRouter } from 'next/navigation';
export default function Page() {
    const router=useRouter();
	const { data } = useSession();
	const [number, setNumber] = useState('');
	const debouncedNumber = useDebounce({ value: number, delay: 400 });
	const [users, setUsers] = useState<UserType[]>();
	useEffect(() => {
		const handleCall = async () => {
			const result = await handleSearch({ number: debouncedNumber });
			setUsers(result);
		};
		if (debouncedNumber) {
			handleCall();
		} else {
			setUsers(undefined);
		}
	}, [debouncedNumber]);
	return (
		<div>
			<div className='absolute top-0 z-[-2] h-full w-full bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]'></div>
			<div className='mx-auto p-4'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-20'>
					<Card className='bg-white/[0.2px] backdrop-blur-sm'>
						<CardHeader>
							<CardTitle>Your Profile</CardTitle>
						</CardHeader>
						<CardContent className='flex items-center space-x-4'>
							<div className='relative'>
								<Avatar>
									<AvatarFallback>{data?.user.name.charAt(0)}</AvatarFallback>
								</Avatar>
							</div>
							<div>
								<h3 className='font-medium'>{data?.user.name}</h3>
								<p className='text-sm text-gray-500'>{data?.user.number}</p>
							</div>
						</CardContent>
					</Card>

					
				</div>
			</div>
		</div>
	);
}
