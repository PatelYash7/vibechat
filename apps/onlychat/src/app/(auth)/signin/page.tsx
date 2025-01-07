'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Mail, Eye, Phone } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { UserSchemaSignin, UserSchemaSigninType } from '@/zod/authentication';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
export default function Component() {
	const [error, setError] = useState('');
	const [visible, setVisible] = useState(false);
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UserSchemaSigninType>({
		mode: 'onChange',
		resolver: zodResolver(UserSchemaSignin),
	});
	const onSubmit = async (e: UserSchemaSigninType) => {
		const res = await signIn('credentials', {
			type:'signin',
			number: e.MobileNumber,
			password: e.Password,
			redirect: false,
		});
		if (res?.ok) {
			router.push('/dashboard');
			window.location.replace('/');
		} else {
			setError('Authentication Failed. Please try again.');
		}
	};
	return (
		<div className='min-h-screen flex items-center justify-center bg-black bg-[linear-gradient(rgba(0,0,0,.5)_2px,transparent_2px),linear-gradient(90deg,rgba(0,0,0,.5)_2px,transparent_2px)] bg-[size:50px_50px]'>
			<Card className='w-full max-w-md bg-[#111] text-white border-none shadow-2xl'>
				<CardHeader className='space-y-1 text-center'>
					<h1
						onClick={() => {
							router.push('/');
						}}
						className='text-3xl cursor-pointer font-bold tracking-tight mb-2'
					>
						OnlyChat
					</h1>
					<p className='text-sm text-gray-400'>
						Don&apos;t have an account?{' '}
						<Link href='signup' className='text-blue-500 hover:underline'>
							Create one.
						</Link>
					</p>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='relative'>
						<div className='absolute inset-0 flex items-center'>
							<span className='w-full border-t border-gray-700' />
						</div>
						<div className='relative flex justify-center text-xs uppercase'>
							<span className='bg-[#111] px-2 text-gray-400'>OR</span>
						</div>
					</div>
					<form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
						<div className='space-y-2'>
							<label
								htmlFor='Number'
								className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
							>
								Number
							</label>
							<div className='relative'>
								<Input
									{...register('MobileNumber', {
										required: true,
									})}
									id='number'
									placeholder='+91 12345 67890'
									className='bg-[#222] border-gray-700 text-white pl-10'
								/>
								<Phone className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5' />
							</div>
						</div>
						<div className='space-y-2'>
							<label
								htmlFor='password'
								className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
							>
								Password
							</label>
							<div className='relative'>
								<Input
									{...register('Password', {
										required: true,
									})}
									id='password'
									placeholder='*********'
									type={visible ? 'text' : 'password'}
									className='bg-[#222] border-gray-700 text-white pr-10'
								/>
								<Eye
									onClick={() => {
										setVisible((prev) => !prev);
									}}
									className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 cursor-pointer'
								/>
							</div>
							<div className='h-12'>
								{errors.MobileNumber && (
									<p className='text-sm text-red-600 text-left'>
										{errors.MobileNumber.message}
									</p>
								)}
								{errors.Password && (
									<p className='text-sm  text-red-600  text-left'>
										{errors.Password?.message}
									</p>
								)}
								{error && (
									<div className='text-sm  text-center text-red-600 py-4 font-semibold'>
										{error}
									</div>
								)}
							</div>
						</div>
						<Button
							type='submit'
							disabled={
								(errors.MobileNumber?.message!=undefined || errors.Password?.message!=undefined)
							}
							className='w-full bg-blue-600 hover:bg-blue-700 text-white'
						>
							Sign in
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
