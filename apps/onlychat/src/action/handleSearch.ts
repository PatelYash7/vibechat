'use server';

import prisma from '@/db';

export const handleSearch = ({ number }: { number: string }) => {
	try {
		const result = prisma.user.findMany({
			where: {
				OR: [
					{ MobileNumber: { startsWith: number } },
					{ MobileNumber: { endsWith: number } },
                    
					{ MobileNumber: { contains: number } },

				],
			},
		});
        return result
	} catch (error) {
        return undefined
    }
};
