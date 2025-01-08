'use server';

import prisma from '@/db';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export const handleSearch = async ({ number }: { number: string }) => {
	const session =await getServerSession(authOptions);
	try {
		const result = prisma.user.findMany({
			where: {
				OR: [
					{ MobileNumber: { startsWith: number } },
					{ MobileNumber: { endsWith: number } },
                    
					{ MobileNumber: { contains: number } },

				],
				NOT:[{
					id:session?.user.id
				}]
			},
		});
        return result
	} catch (error) {
        return undefined
    }
};
