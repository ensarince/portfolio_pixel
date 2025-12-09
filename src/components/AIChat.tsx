import React, { useState, useEffect, useRef } from 'react';
import styles from './AIChat.module.scss';
import { getPortfolioData, formatPortfolioContext } from '../services/getPortfolioData';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const AIChat: React.FC<ChatProps> = ({ isOpen: initialOpen = false, onClose }) => {
    const [isOpen, setIsOpen] = useState(initialOpen);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [portfolioContext, setPortfolioContext] = useState<string>('');
    const [hasAutoOpened, setHasAutoOpened] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    console.log(portfolioContext)

    // Fetch portfolio data on mount
    useEffect(() => {
        const initializeContext = async () => {
            try {
                const data = await getPortfolioData();
                const context = formatPortfolioContext(data);
                setPortfolioContext(context);
            } catch (err) {
                console.error('Failed to load portfolio data:', err);
                setError('Failed to initialize chatbot context');
            }
        };

        initializeContext();
    }, []);

    // Auto-open chatbot after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!hasAutoOpened) {
                setIsOpen(true);
                setHasAutoOpened(true);
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [hasAutoOpened]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!input.trim()) return;
        if (!portfolioContext) {
            setError('Portfolio context not loaded yet. Please wait...');
            return;
        }

        const userMessage = input.trim();
        setInput('');
        setError(null);

        // Add user message to chat
        const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_APP_OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        {
                            role: 'system',
                            content: `You are an AI assistant helping HR professionals and recruiters learn about Ensar Ince. You have access to his portfolio information and should answer questions about his background, skills, projects, and experience in a professional and friendly manner. If a question is not related to Ensar, politely redirect the conversation to his professional profile.

                        Here is Ensar's portfolio information:

                        ${portfolioContext}

                            Answer questions concisely and professionally. Be helpful and highlight relevant skills and projects when appropriate.`,
                        },
                        ...newMessages.map(msg => ({
                            role: msg.role,
                            content: msg.content,
                        })),
                    ],
                    temperature: 0.7,
                    max_tokens: 500,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to get response from AI');
            }

            const data = await response.json();
            const assistantMessage = data.choices[0]?.message?.content || 'No response received';

            setMessages([...newMessages, { role: 'assistant', content: assistantMessage }]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
            // Keep the user message but mark there was an error
            setMessages(newMessages);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        onClose?.();
    };

    if (!isOpen) {
        return (
            <button
                className={styles.minimizedButton}
                onClick={() => setIsOpen(true)}
                title="Ask me about Ensar"
            >
                💬
            </button>
        );
    }

    return (
        <div className={styles.chatbotContainer}>
            <div className={styles.header}>
                <h3>Ask about Ensar</h3>
                <button onClick={handleClose}>✕</button>
            </div>

            <div className={styles.messagesContainer}>
                {messages.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>👋 Hi! I'm an AI assistant here to help you learn about Ensar.</p>
                        <p>Ask me anything about his skills, projects, experience, or background!</p>
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <div key={index} className={`${styles.message} ${styles[message.role]}`}>
                            <div className={styles.messageBubble}>{message.content}</div>
                        </div>
                    ))
                )}

                {isLoading && (
                    <div className={`${styles.message} ${styles.assistant}`}>
                        <div className={styles.messageBubble}>
                            <div className={styles.loadingIndicator}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}

                {error && <div className={styles.errorMessage}>⚠️ {error}</div>}

                <div ref={messagesEndRef} />
            </div>

            <form className={styles.inputContainer} onSubmit={sendMessage}>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="Ask a question..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading || !portfolioContext}
                />
                <button
                    className={styles.sendButton}
                    type="submit"
                    disabled={isLoading || !portfolioContext || !input.trim()}
                >
                    {isLoading ? '...' : '→'}
                </button>
            </form>
        </div>
    );
};

export default AIChat;
