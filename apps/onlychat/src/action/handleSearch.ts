'use server';

import prisma from '@/db';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export const handleSearch = async ({ number }: { number: string }) => {
	const session =await getServerSession(authOptions);
	try {
		const result = await prisma.user.findMany({
			where: {
				AND: [
					{
						OR: [
							{ MobileNumber: { startsWith: number } },
							{ MobileNumber: { endsWith: number } },
							{ MobileNumber: { contains: number } },
						],
					},
					{
						NOT: { MobileNumber: session?.user.number }, // Exclude the current user
					},
				],
			},
		});
        return result
	} catch (error) {
        return undefined
    }
};

export const getUser =async ({number}:{number:string})=>{
	try{
		const result = await prisma.user.findFirst({
			where:{
				MobileNumber:number
			}
		}) 
		return result;
	}catch(error){
		return null
	}
}
