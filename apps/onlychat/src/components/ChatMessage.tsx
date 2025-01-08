import { Message } from "@/types/types";


export function ChatMessage({ message }: { message: Message }) {
    return (
        <div className={`${message.sender === 'self' ? 'text-right' : 'text-left'} my-1`}>
            <span
                className={`inline-block p-2 rounded-lg ${
                    message.sender === 'self' ? 'bg-blue-500' : 'bg-gray-500'
                } text-white max-w-[70%] break-words`}
            >
                {message.content}
            </span>
        </div>
    );
}