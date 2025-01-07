'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
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

					<div className='border bg-white/[0.2px] backdrop-blur-sm rounded-xl p-4'>
						<h2 className='text-xl font-semibold mb-4'>Find Users</h2>
						<div className='space-y-4'>
							<Input
								type='text'
								placeholder='Search users...'
								onChange={(e) => {
									setNumber(e.target.value);
								}}
							/>
							<div className='space-y-2'>
								{users ?
									users.length > 0 ?
										<>
											{users.map((user: UserType, index: any) => (
												<motion.div
                                                    onClick={()=>{
                                                        router.push(`/chat/${user.id}`)
                                                    }}
													key={index}
													initial={{ opacity: 0, y: 20 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ duration: 0.3, delay: index * 0.1 }}
													className='flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800'
												>
													<div className='relative'>
														<Avatar>
															<AvatarFallback>
																{user.Name.charAt(0)}
															</AvatarFallback>
														</Avatar>
														<Badge
															variant='outline'
															className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2`}
														/>
													</div>
													<div>
														<h3 className='font-medium'>{user.Name}</h3>
														<p className='text-sm text-gray-500'>
															{user.MobileNumber}
														</p>
													</div>
												</motion.div>
											))}
										</>
									:	<div></div>
								:	<></>}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
