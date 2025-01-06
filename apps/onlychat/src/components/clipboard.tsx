'use client';

import { Check, ClipboardIcon, Copy } from 'lucide-react';
import { useState } from 'react';

export const Clipboard = () => {
	const [copied, setcopied] = useState(false);
	return (
		<button
			onClick={() => {
				setcopied(true);
				setTimeout(() => {
					setcopied(false);
				}, 1500);
				navigator.clipboard.writeText('npx next-development-kit');
			}}
			className=' bg-white/10 flex  justify-between items-center gap-4 backdrop-blur-sm border-white border px-4 py-2 rounded'
		>
			npx next-development-kit
			<div className='flex justify-center items-center hover:bg-white/20 p-1 rounded transition-all'>
				{copied ?
					<Check />
				:	<Copy />}
			</div>
		</button>
	);
};
