import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

type Direction = 'incoming' | 'outgoing';

type MessageItem = {
  chatId: string;
  text: string;
  timestamp: string;
  direction: Direction;
  telegramMessageId?: number;
  username?: string;
};

type ChatSummary = {
  chatId: string;
  lastText: string;
  lastTimestamp: string;
  direction: Direction;
  totalMessages: number;
};

function App() {
  const [chatId, setChatId] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [selectedChat, setSelectedChat] = useState('');
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchChats = async () => {
    try {
      const response = await axios.get(`${API_BASE}/messages/chats`);
      const data = response.data.data || [];
      setChats(data);
      if (!selectedChat && data.length > 0) {
        setSelectedChat(data[0].chatId);
      }
    } catch (error) {
      console.error(error);
      setStatus('Unable to load chat list.');
    }
  };

  const fetchMessages = async (chat = selectedChat) => {
    if (!chat) {
      setMessages([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/messages/history`, {
        params: { chatId: chat },
      });
      setMessages(response.data.data || []);
    } catch (error) {
      console.error(error);
      setStatus('Unable to load the conversation.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat);
    }
  }, [selectedChat]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchChats();
      if (selectedChat) {
        fetchMessages(selectedChat);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedChat]);

  const sendMessage = async () => {
    const targetChat = selectedChat || chatId.trim();
    if (!targetChat) {
      setStatus('Select a chat or enter a chat ID.');
      return;
    }

    setStatus('Sending...');

    try {
      await axios.post(`${API_BASE}/messages/send`, {
        chatId: targetChat,
        text: message,
      });
      setStatus('Message sent successfully.');
      setMessage('');
      if (!selectedChat) {
        setSelectedChat(targetChat);
      }
      fetchChats();
      fetchMessages(targetChat);
    } catch (error) {
      console.error(error);
      setStatus('Failed to send message. Check the server logs and bot token.');
    }
  };

  const activeChat = chats.find((chat) => chat.chatId === selectedChat);

  return (
    <div className="app-shell">
      <div className="chat-layout">
        <aside className="chat-sidebar">
          <div className="sidebar-header">
            <h1>Telegram Messenger</h1>
            <button type="button" onClick={fetchChats}>
              Refresh
            </button>
          </div>

          <div className="chat-summary">
            <label>
              Chat ID
              <input
                value={chatId}
                onChange={(event) => setChatId(event.target.value)}
                placeholder="Enter a chat ID"
              />
            </label>
          </div>

          <div className="chat-list">
            <h2>Recent chats</h2>
            {chats.length === 0 ? (
              <p>No chats found yet.</p>
            ) : (
              chats.map((chat) => (
                <button
                  key={chat.chatId}
                  type="button"
                  className={`chat-item ${chat.chatId === selectedChat ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedChat(chat.chatId);
                    setChatId(chat.chatId);
                  }}
                >
                  <div>
                    <strong>{chat.chatId}</strong>
                    <p>{chat.lastText}</p>
                  </div>
                  <span>{new Date(chat.lastTimestamp).toLocaleTimeString()}</span>
                </button>
              ))
            )}
          </div>
        </aside>

        <main className="chat-window">
          <div className="chat-header">
            <div>
              <h2>{selectedChat ? `Chat ${selectedChat}` : 'Select a chat'}</h2>
              <p>{activeChat ? `${activeChat.totalMessages} messages` : 'No conversation selected'}</p>
            </div>
          </div>

          <div className="message-list">
            {loading ? (
              <p>Loading conversation…</p>
            ) : messages.length === 0 ? (
              <p>No messages in this chat yet.</p>
            ) : (
              messages.map((messageItem) => (
                <div
                  key={`${messageItem.telegramMessageId}-${messageItem.timestamp}`}
                  className={`message-row ${messageItem.direction}`}
                >
                  <div className="message-bubble">
                    <p>{messageItem.text}</p>
                    <div className="message-meta">
                      <span>{new Date(messageItem.timestamp).toLocaleString()}</span>
                      {messageItem.direction === 'incoming' && messageItem.username ? (
                        <span>{messageItem.username}</span>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="new-message-panel">
            <label>
              Message
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Type your message here"
              />
            </label>
            <button onClick={sendMessage} disabled={!message.trim() || !chatId.trim()}>
              Send Message
            </button>
            {status && <p className="status">{status}</p>}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
