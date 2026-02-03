import { useState, useRef, useEffect } from 'react';
import { MessageSquare, LineChart, Utensils, Zap, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import character from '../tamaos.json';

// Helper for control buttons
const ControlButton = ({ icon, label, onClick }: { icon: any, label: string, onClick: () => void }) => (
    <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        style={{
            background: 'rgba(0,0,0,0.8)',
            border: '2px solid var(--color-screen-glow)',
            color: 'var(--color-screen-glow)',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 0 10px var(--color-screen-glow)'
        }}
    >
        {icon}
        <span style={{ fontSize: '0.6rem', marginTop: '4px' }}>{label}</span>
    </motion.button>
);

export const Interface = () => {
    const [messages, setMessages] = useState([
        { role: 'agent', text: `Hello! I am ${character.name}.` }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userText = inputValue;
        setMessages(prev => [...prev, { role: 'user', text: userText }]);
        setInputValue('');
        setIsTyping(true);

        const aiProvider = import.meta.env.VITE_AI_PROVIDER || 'ollama';
        console.log('AI Provider:', aiProvider); // Debug log

        try {
            let aiResponse = '';

            if (aiProvider === 'openai') {
                const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
                if (!apiKey || apiKey.includes('your_openai_api_key')) {
                    throw new Error('OpenAI API Key is missing or invalid in .env');
                }
                
                console.log('Sending request to OpenAI...');
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o',
                        messages: [
                            { role: "system", content: `You are ${character.name}. ${character.system}\n\nBio: ${character.bio.join(' ')}` },
                            ...messages.map(m => ({ role: m.role === 'agent' ? 'assistant' : 'user', content: m.text })),
                            { role: "user", content: userText }
                        ]
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(`OpenAI Error: ${response.status} ${errorData.error?.message || response.statusText}`);
                }
                const data = await response.json();
                aiResponse = data.choices[0].message.content;

            } else {
                // Default: Ollama
                console.log('Sending request to Ollama...');
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: import.meta.env.VITE_OLLAMA_MODEL || 'llama3',
                        prompt: `You are ${character.name}. ${character.system}\n\nBio: ${character.bio.join(' ')}\n\nUser: ${userText}\n\n${character.name}:`,
                        stream: false
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    aiResponse = data.response;
                } else {
                    throw new Error('Local LLM (Ollama) not available. Make sure Ollama is running.');
                }
            }
            
            setMessages(prev => [...prev, { role: 'agent', text: aiResponse }]);

        } catch (error: any) {
            console.error('LLM request failed:', error);
            
            // Simulation Logic using character examples
            setTimeout(() => {
                // specific keywords matching
                const lowerInput = userText.toLowerCase();
                let responseText = "I'm listening...";

                if (lowerInput.includes('who are you')) {
                    responseText = `I am ${character.name}. ${character.bio[0]}`;
                } else if (lowerInput.includes('crypto') || lowerInput.includes('market')) {
                    responseText = "The market is fascinating right now. " + character.bio[1];
                } else {
                    // Pick a random response from examples if available
                    if (character.messageExamples && character.messageExamples.length > 0) {
                        const randomConvo = character.messageExamples[Math.floor(Math.random() * character.messageExamples.length)];
                        // Find the agent's turn
                        const agentMsg = randomConvo.find((m: any) => m.name === 'Eliza' || m.name === character.name);
                        if (agentMsg) {
                            responseText = agentMsg.content.text;
                        }
                    }
                }

                setMessages(prev => [...prev, { 
                    role: 'agent', 
                    text: `${responseText} (Error: ${error.message || 'Unknown error'})` 
                }]);
            }, 1000);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    const handleTrade = () => {
        setMessages(prev => [...prev, { role: 'agent', text: 'Trading execution module... initializing...' }]);
    };

    return (
        <div className="interface-overlay" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '20px',
            boxSizing: 'border-box'
        }}>

            {/* Left/Center: Stats */}
            <div className="stats-panel" style={{ pointerEvents: 'auto' }}>
                <div style={{ background: 'rgba(0,0,0,0.8)', padding: '10px', borderRadius: '8px', border: '2px solid var(--color-screen-glow)' }}>
                    <div style={{ color: 'var(--color-screen-glow)', fontSize: '1.5rem' }}>BTC: $98,432</div>
                    <div style={{ color: '#ff6b6b' }}>ETH: $2,850</div>
                </div>
            </div>

            {/* Right: Chat Interface */}
            <div className="chat-panel" style={{
                pointerEvents: 'auto',
                width: '350px',
                background: 'rgba(0,0,0,0.9)',
                border: '4px solid #444',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                maxHeight: '80vh'
            }}>
                {/* Screen Header */}
                <div style={{ background: '#444', padding: '8px', textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>
                    {character.name.toUpperCase()} OS
                </div>

                {/* Messages Area */}
                <div style={{ flex: 1, padding: '10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {messages.map((msg, idx) => (
                        <div key={idx} style={{
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '80%'
                        }}>
                            <div style={{
                                background: msg.role === 'user' ? '#444' : 'rgba(0, 255, 65, 0.1)',
                                color: msg.role === 'user' ? '#fff' : 'var(--color-screen-glow)',
                                padding: '8px 12px',
                                borderRadius: '12px',
                                borderBottomRightRadius: msg.role === 'user' ? '2px' : '12px',
                                borderBottomLeftRadius: msg.role === 'agent' ? '2px' : '12px',
                                border: msg.role === 'agent' ? '1px solid var(--color-screen-glow)' : 'none'
                            }}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div style={{ alignSelf: 'flex-start', color: 'var(--color-screen-glow)', fontSize: '0.8rem' }}>
                            Typing...
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div style={{ padding: '10px', borderTop: '2px solid #444', display: 'flex', gap: '8px' }}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={`Chat with ${character.name}...`}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            borderRadius: '4px',
                            color: 'white',
                            flex: 1,
                            padding: '8px',
                            fontFamily: 'inherit',
                            outline: 'none'
                        }}
                    />
                    <button 
                        onClick={handleSend}
                        style={{ 
                            background: 'var(--color-screen-glow)', 
                            border: 'none', 
                            borderRadius: '4px',
                            color: '#000',
                            padding: '0 12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>

            {/* Bottom: Controls */}
            <div className="controls-bar" style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                pointerEvents: 'auto',
                display: 'flex',
                gap: '20px'
            }}>
                <ControlButton icon={<LineChart />} label="STATS" onClick={() => setMessages(prev => [...prev, { role: 'agent', text: 'Market analysis initialized.' }])} />
                <ControlButton icon={<Utensils />} label="FEED" onClick={() => setMessages(prev => [...prev, { role: 'agent', text: 'Consuming data streams...' }])} />
                <ControlButton icon={<Zap />} label="TRADE" onClick={handleTrade} />
            </div>
        </div>
    );
};
