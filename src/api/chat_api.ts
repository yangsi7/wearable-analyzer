import Message from "../chat/domain/models/message";
import { supabase } from "./supabase";

export const getMessagesForSession = async (sessionId: string): Promise<Message[]> => {
    try {
        const { data, error } = await supabase
            .from('n8n_chat_history')
            .select('*')
            .eq('session_id', sessionId)
            .order('id', { ascending: true });

        if (error) {
            console.error('getMessagesForSession error:', error);
            return [];
        }

        if (!data) {
            console.warn('getMessagesForSession: No data found');
            return [];
        }

        return data.map((message: any) => ({
            id: message.id,
            sessionId: message.session_id,
            message: message.message,
            sender: message.sender || 'some'
        }));
    } catch (error) {
        console.error('getMessagesForSession unexpected error:', error);
        return [];
    }
}

export const sendMessage = async (userId: string, sessionId: string, message: string): Promise<string> => {
    try {
        const response = await fetch("https://agent5meo.app.n8n.cloud/webhook/6ba45b74-f375-41e2-9844-71e38b0b3423", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userId,
                sessionId: sessionId,
                message: message
            })
        });

        if (!response.ok) {
            console.error('sendMessage error:', response.statusText);

            return '';
        }

        let re = await response.json();
        return re["output"];
    } catch (error) {
        console.error('sendMessage unexpected error:', error);
        return '';
    }

}