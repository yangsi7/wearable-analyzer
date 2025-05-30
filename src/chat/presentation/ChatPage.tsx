import { useState } from "react";
import { getSessionId, getUser } from "../../api/auth";
import { sendMessage } from "../../api/chat_api";
import Message from "../domain/models/message";
import { ChevronLeft, Refresh, Send } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import TypewriterMarkdown from "./components/TypewriterMarkdown";
import { SpeedDialFAB } from "../../pages/dashboard/components/SpeedDialFAB";
import { useSelectedDay } from "../../pages/dashboard/state/SelectedDayContext";

export const ChatPage = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    // const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);
    const [newMessage, setNewMessage] = useState<string>('');

    const navigate = useNavigate();

    // useEffect(() => {
    //     setIsLoadingMessages(true);
    //     setError(null);
    //     const fetchMessages = async () => {
    //         const sessionId = await getSessionId();
    //         if (!sessionId) {
    //             setError('No session found');
    //             setIsLoadingMessages(false);
    //             return;
    //         }
    //         const messages = await getMessagesForSession(sessionId);
    //         setMessages(messages);
    //         setIsLoadingMessages(false);
    //     }
    //     fetchMessages();
    // }, []);

    async function submitMessage() {
        const trimmedMessage = newMessage.trim();
        if (!trimmedMessage || isSendingMessage) return;

        const user = await getUser();
        if (!user) {
            setError('No user found');
            return;
        }
        const sessionId = await getSessionId();
        if (!sessionId) {
            setError('No session found');
            return;
        }

        setIsSendingMessage(true);
        setError(null);
        const messagesWithNewMessage = [
            ...messages,
            {
                id: (new Date()).toISOString(),
                sessionId,
                sender: user.id,
                message: trimmedMessage
            }];
        setMessages(messagesWithNewMessage);
        setNewMessage('');

        const result = await sendMessage(user.id, sessionId, trimmedMessage);
        if (!result) {
            setError('Oops, something went wrong. Try sending your message again.');
            setNewMessage(trimmedMessage);
        } else {
            setMessages([
                ...messagesWithNewMessage,
                {
                    id: (new Date()).toISOString(),
                    sessionId,
                    sender: 'ai',
                    message: result
                }
            ]);
        }
        setIsSendingMessage(false);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter' && !e.shiftKey && !isSendingMessage) {
            e.preventDefault();
            submitMessage();
        }
    }

    const { report: metrics } = useSelectedDay();

    return (
        <div >
            <header className="sticky top-0 bg-white shadow-sm z-20">
                <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1" onClick={() => navigate(-1)}>
                        <ChevronLeft className="w-6 h-6 text-blue-600" />
                        <span className="text-blue-600">Back</span>
                    </div>
                    <h1 className="text-xl font-semibold text-gray-900 flex-2">
                        AI assistant
                    </h1>
                    <div>
                        <div className="relative h-0 flex items-center gap-1 invisible">
                            <ChevronLeft className="w-6 h-6 text-blue-600" />
                            <span className="text-blue-600">Back</span>
                        </div>
                        <SpeedDialFAB data={metrics} />
                    </div>

                </div>
            </header>
            {/* {isLoadingMessages &&
                <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                    <LoadingSpinner title="Loading chat messages..." />
                </div>
            } */}
            {messages.length == 0 ? <div className="min-h-screen bg-gray-100 flex items-center justify-center">No messages</div> : null}
            <ul>
                {messages.map((message) => {
                    const wasSentByUser = message.sender != 'ai';
                    return (
                        // Message bubble

                        <li key={message.id} className="flex items-center gap-2 p-4">
                            <div className="flex-1">
                                <div className={`p-2 ${wasSentByUser ? "bg-blue-600 text-white ml-4" : "bg-white text-gray-600 mr-4"}  rounded-lg`}>
                                    {wasSentByUser ? <span>{message.message}</span> : <TypewriterMarkdown text={message.message} />}
                                </div>
                            </div>
                        </li>
                    )
                })}
                {error && <li key={error} className="p-2 bg-white text-gray-600 rounded-lg m-4 mr-8 italic">{error}</li>}
            </ul>
            <div className="flex items-center gap-2 fixed bottom-0 left-0 right-0 bg-white p-4 shadow-md">
                <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={handleKeyDown} className="flex-1 border rounded p-2" />
                <button onClick={submitMessage} className="bg-blue-600 text-white p-2 rounded-full leading-none">
                    {isSendingMessage ? <div className=" animate-spin rounded-full h-[24px] w-[24px] border-white"><Refresh /></div> : <Send />}
                </button>
            </div>
        </div>
    );
}