import { Input } from '@/components/ui/input';

interface ChatInputProps {
    inputMessage: string;
    setInputMessage: (message: string) => void;
    sendMessage: () => void;
    disabled: boolean;
}

export function ChatInput({ inputMessage, setInputMessage, sendMessage, disabled }: ChatInputProps) {
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
            }}
            className='flex gap-2'
        >
            <Input
                type='text'
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className='flex-1'
                placeholder='Type your message...'
                disabled={disabled}
            />
            <button
                type='submit'
                className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400'
                disabled={disabled}
            >
                Send
            </button>
        </form>
    );
}
