import { useState } from 'react';
import { MessageSquare, LineChart, Utensils, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const Interface = () => {
    const [messages, setMessages] = useState([
        { role: 'agent', text: 'Hello! I am your Crypto Buddy.' }
    ]);

    const handleTrade = () => {
        setMessages(prev => [...prev, { role: 'agent', text: 'Trading feature coming soon!' }]);
    };

    return (
        <div className="interface-overlay" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none', // Let clicks pass through to canvas where needed, but capture on UI
            display: 'flex',
            justifyContent: 'space-between',
            padding: '20px',
            boxSizing: 'border-box'
        }}>

            {/* Left/Center: Stats or emptiness (Agent is here) */}
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
                overflow: 'hidden'
            }}>
                {/* Screen Header */}
                <div style={{ background: '#444', padding: '8px', textAlign: 'center', color: '#fff' }}>
                    TAMA-OS CHAT
                </div>

                {/* Messages Area */}
                <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
                    {messages.map((msg, idx) => (
                        <div key={idx} style={{
                            marginBottom: '8px',
                            textAlign: msg.role === 'user' ? 'right' : 'left',
                            color: msg.role === 'user' ? '#fff' : 'var(--color-screen-glow)'
                        }}>
                            <span style={{ background: msg.role === 'user' ? '#333' : 'transparent', padding: '4px 8px', borderRadius: '4px' }}>
                                {msg.text}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div style={{ padding: '10px', borderTop: '2px solid #444', display: 'flex' }}>
                    <input
                        type="text"
                        placeholder="Ask about crypto..."
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            flex: 1,
                            fontFamily: 'inherit',
                            outline: 'none'
                        }}
                    />
                    <button style={{ background: 'none', border: 'none', color: 'var(--color-screen-glow)' }}>
                        <MessageSquare size={20} />
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
                <ControlButton icon={<LineChart />} label="STATS" onClick={() => setMessages(prev => [...prev, { role: 'agent', text: 'Stats loaded' }])} />
                <ControlButton icon={<Utensils />} label="FEED" onClick={() => setMessages(prev => [...prev, { role: 'agent', text: 'Yummy!' }])} />
                <ControlButton icon={<Zap />} label="TRADE" onClick={handleTrade} />
            </div>
        </div>
    );
};

const ControlButton = ({ icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) => (
    <motion.button
        title={label}
        onClick={onClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
            background: '#eee',
            border: '4px solid #999',
            borderBottom: '6px solid #666', // 3D effect
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#333',
            boxShadow: '0 4px 0 #444'
        }}
    >
        {icon}
    </motion.button>
);
