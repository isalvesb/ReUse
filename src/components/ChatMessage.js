export default ChatMessage({
    message,
    sender = 'user',

}) {
    const isUser = sender === 'user';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'
            }`}>
            <div className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm ${isUser
                ? 'bg-reuse-pink text-reuse-brown'
                : 'bg-[#f3e8d2] text-reuse-brown'
                }`}
            >
                {message}
            </div>

        </div>
    )
}