import { useState } from 'react';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import { useApp } from '../../context/AppContext';
import { Send, Search, Phone, Mail, User } from 'lucide-react';

const CONVERSATIONS = [
  {
    id: 'conv-1',
    name: 'Marcus Lim',
    role: 'Property Manager',
    avatar: 'ML',
    avatarColor: '#2563eb',
    lastMessage: 'Your lease renewal documents are ready for review.',
    lastTime: '10:42 AM',
    unread: 2,
    online: true,
    messages: [
      { id: 1, from: 'them', text: 'Good morning, Aisha! I wanted to check in about your upcoming lease renewal.', time: '09:00 AM', date: '2026-03-27' },
      { id: 2, from: 'me',   text: 'Hi Marcus! Yes, I was meaning to ask about that.', time: '09:15 AM', date: '2026-03-27' },
      { id: 3, from: 'them', text: 'Your current lease expires on 31 March 2026. We\'d love to have you stay! I\'ve prepared a renewal offer at the same rate.', time: '09:18 AM', date: '2026-03-27' },
      { id: 4, from: 'me',   text: 'That sounds great! Can I review the documents?', time: '09:20 AM', date: '2026-03-27' },
      { id: 5, from: 'them', text: 'Your lease renewal documents are ready for review. I\'ll email them to you shortly. Please sign by 30 March.', time: '10:42 AM', date: '2026-03-27' },
    ],
  },
  {
    id: 'conv-2',
    name: 'PRMS Maintenance',
    role: 'Maintenance Team',
    avatar: '🔧',
    avatarColor: '#f59e0b',
    lastMessage: 'MT-001: Parts have arrived. James will visit tomorrow 10–12pm.',
    lastTime: 'Yesterday',
    unread: 1,
    online: false,
    messages: [
      { id: 1, from: 'them', text: 'Hi Aisha, we\'ve received your maintenance request MT-001 for the kitchen tap.', time: '09:35 AM', date: '2026-03-22' },
      { id: 2, from: 'me',   text: 'Thank you! It\'s been dripping for 2 days now.', time: '09:40 AM', date: '2026-03-22' },
      { id: 3, from: 'them', text: 'We\'ve assigned James Wong from ProFix Solutions. He will assess and provide an estimate.', time: '10:00 AM', date: '2026-03-22' },
      { id: 4, from: 'them', text: 'Update: James visited and identified the issue — the cartridge needs replacement. We\'ve ordered the part.', time: '02:15 PM', date: '2026-03-23' },
      { id: 5, from: 'me',   text: 'How long will it take?', time: '02:30 PM', date: '2026-03-23' },
      { id: 6, from: 'them', text: 'MT-001: Parts have arrived. James will visit tomorrow 10–12pm.', time: '11:05 AM', date: '2026-03-26' },
    ],
  },
  {
    id: 'conv-3',
    name: 'PRMS Support',
    role: 'Customer Support',
    avatar: 'PS',
    avatarColor: '#7c3aed',
    lastMessage: 'Is there anything else I can help you with today?',
    lastTime: 'Mon',
    unread: 0,
    online: true,
    messages: [
      { id: 1, from: 'them', text: 'Hello! Welcome to PRMS Support. How can I assist you today?', time: '11:00 AM', date: '2026-03-23' },
      { id: 2, from: 'me',   text: 'Hi, I wanted to ask about parking availability.', time: '11:05 AM', date: '2026-03-23' },
      { id: 3, from: 'them', text: 'Your unit U-101 is allocated one covered parking lot (B1-14). Additional lots may be available — I\'ll check with the building management.', time: '11:10 AM', date: '2026-03-23' },
      { id: 4, from: 'me',   text: 'Great, thank you!', time: '11:12 AM', date: '2026-03-23' },
      { id: 5, from: 'them', text: 'Is there anything else I can help you with today?', time: '11:13 AM', date: '2026-03-23' },
    ],
  },
];

export default function TenantMessages() {
  const { currentUser } = useApp();
  const [convs, setConvs]           = useState(CONVERSATIONS);
  const [activeId, setActiveId]     = useState('conv-1');
  const [inputText, setInputText]   = useState('');
  const [search, setSearch]         = useState('');

  const activeConv = convs.find(c => c.id === activeId);
  const filteredConvs = convs.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (id) => {
    setActiveId(id);
    setConvs(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = { id: Date.now(), from: 'me', text: inputText.trim(), time: timeStr, date: now.toISOString().split('T')[0] };
    setConvs(prev => prev.map(c => c.id === activeId
      ? { ...c, messages: [...c.messages, newMsg], lastMessage: inputText.trim(), lastTime: timeStr }
      : c
    ));
    setInputText('');

    // Simulate reply after 1.2s
    setTimeout(() => {
      const replies = {
        'conv-1': "Thanks for your message, Aisha! I'll get back to you shortly.",
        'conv-2': "Message received. Our team will follow up within 24 hours.",
        'conv-3': "Thank you for reaching out! A support agent will respond shortly.",
      };
      const replyMsg = {
        id: Date.now() + 1,
        from: 'them',
        text: replies[activeId] || "Thanks, noted!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString().split('T')[0],
      };
      setConvs(prev => prev.map(c => c.id === activeId
        ? { ...c, messages: [...c.messages, replyMsg], lastMessage: replyMsg.text, lastTime: replyMsg.time }
        : c
      ));
    }, 1200);
  };

  const totalUnread = convs.reduce((s, c) => s + c.unread, 0);

  return (
    <AppShell>
      <Topbar
        title="Messages"
        subtitle="Chat with your property manager and support team"
      />
      <div className="page-body" style={{ padding: 0, display: 'flex', height: 'calc(100vh - 70px)', overflow: 'hidden' }}>

        {/* ── Sidebar ── */}
        <div style={{
          width: 300, flexShrink: 0, borderRight: '1px solid var(--gray-100)',
          display: 'flex', flexDirection: 'column', background: 'white',
        }}>
          {/* Header */}
          <div style={{ padding: '20px 18px 12px', borderBottom: '1px solid var(--gray-100)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 15, color: 'var(--gray-900)' }}>Conversations</div>
              {totalUnread > 0 && <span className="badge badge-red">{totalUnread} new</span>}
            </div>
            <div className="search-box">
              <Search size={13} color="var(--gray-400)" />
              <input placeholder="Search messages…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {/* Conversation list */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredConvs.map(conv => (
              <div
                key={conv.id}
                onClick={() => handleSelect(conv.id)}
                style={{
                  padding: '14px 18px', cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'flex-start',
                  borderBottom: '1px solid var(--gray-50)',
                  background: activeId === conv.id ? 'var(--primary-50)' : 'white',
                  borderLeft: activeId === conv.id ? '3px solid var(--primary)' : '3px solid transparent',
                  transition: 'background 0.15s',
                }}
              >
                {/* Avatar */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: '50%', background: conv.avatarColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: 14,
                  }}>
                    {conv.avatar}
                  </div>
                  {conv.online && (
                    <div style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: 'var(--success)', border: '2px solid white' }} />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                    <div style={{ fontWeight: conv.unread > 0 ? 700 : 600, fontSize: 13, color: 'var(--gray-900)' }}>{conv.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray-400)', flexShrink: 0 }}>{conv.lastTime}</div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 2 }}>{conv.role}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 12, color: conv.unread > 0 ? 'var(--gray-700)' : 'var(--gray-400)', fontWeight: conv.unread > 0 ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 170 }}>
                      {conv.lastMessage}
                    </div>
                    {conv.unread > 0 && (
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--primary)', color: 'white', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {conv.unread}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Message Thread ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--gray-50)', minWidth: 0 }}>
          {/* Thread header */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--gray-200)', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: activeConv?.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14 }}>
                {activeConv?.avatar}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 15, color: 'var(--gray-900)' }}>{activeConv?.name}</div>
                <div style={{ fontSize: 12, color: activeConv?.online ? 'var(--success)' : 'var(--gray-400)' }}>
                  {activeConv?.online ? '● Online' : '○ Offline'} · {activeConv?.role}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost btn-sm btn-icon" title="Call"><Phone size={14} /></button>
              <button className="btn btn-ghost btn-sm btn-icon" title="Email"><Mail size={14} /></button>
              <button className="btn btn-ghost btn-sm btn-icon" title="Profile"><User size={14} /></button>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activeConv?.messages.map((msg, i) => {
              const isMe = msg.from === 'me';
              const showDate = i === 0 || msg.date !== activeConv.messages[i - 1]?.date;
              return (
                <div key={msg.id}>
                  {showDate && (
                    <div style={{ textAlign: 'center', margin: '8px 0' }}>
                      <span style={{ fontSize: 11, color: 'var(--gray-400)', background: 'var(--gray-100)', padding: '3px 10px', borderRadius: 20 }}>
                        {msg.date === new Date().toISOString().split('T')[0] ? 'Today' : msg.date}
                      </span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', gap: 8 }}>
                    {!isMe && (
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: activeConv.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 11, flexShrink: 0, alignSelf: 'flex-end' }}>
                        {activeConv.avatar}
                      </div>
                    )}
                    <div style={{ maxWidth: '70%' }}>
                      <div style={{
                        padding: '10px 14px', borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        background: isMe ? 'var(--primary)' : 'white',
                        color: isMe ? 'white' : 'var(--gray-800)',
                        fontSize: 13, lineHeight: 1.5,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                      }}>
                        {msg.text}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--gray-400)', marginTop: 3, textAlign: isMe ? 'right' : 'left' }}>
                        {msg.time}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <div style={{ padding: '14px 24px', borderTop: '1px solid var(--gray-200)', background: 'white', display: 'flex', gap: 10, alignItems: 'center' }}>
            <input
              className="form-input"
              style={{ flex: 1, margin: 0 }}
              placeholder={`Message ${activeConv?.name}…`}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            />
            <button
              className="btn btn-primary btn-icon"
              onClick={sendMessage}
              disabled={!inputText.trim()}
              style={{ flexShrink: 0 }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
