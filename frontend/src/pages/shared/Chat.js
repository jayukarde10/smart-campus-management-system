import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Search, MessageSquare } from 'lucide-react';
import API from '../../services/api';

const Chat = () => {
  const [contacts, setContacts] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const msgEndRef = useRef(null);
  const pollRef = useRef(null);

  const myId = (() => {
    try {
      const { jwtDecode } = require('jwt-decode');
      return jwtDecode(localStorage.getItem('token')).id;
    } catch { return ''; }
  })();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await API.get('/chat/contacts');
        setContacts(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchContacts();
  }, []);

  const fetchMessages = useCallback(async (userId) => {
    try {
      const res = await API.get(`/chat/messages/${userId}`);
      setMessages(res.data);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat._id);
      // Poll for new messages every 3 seconds
      pollRef.current = setInterval(() => fetchMessages(activeChat._id), 3000);
      return () => clearInterval(pollRef.current);
    }
  }, [activeChat, fetchMessages]);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || !activeChat) return;
    try {
      await API.post('/chat/send', { receiverId: activeChat._id, text: message });
      setMessage('');
      fetchMessages(activeChat._id);
    } catch (err) { console.error(err); }
  };

  const filteredContacts = contacts.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const getColor = (name) => {
    const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    return colors[(name || '').charCodeAt(0) % colors.length];
  };

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h2 className="fw-bold m-0">Messages</h2>
        <p className="text-muted m-0">Chat with faculty and students.</p>
      </div>

      {contacts.length === 0 ? (
        <div className="premium-card p-5 text-center text-muted" style={{ minHeight: '300px' }}>
          <MessageSquare size={48} className="mb-3 opacity-50" />
          <h5 className="fw-bold">No contacts available</h5>
          <p>No users available to chat with yet.</p>
        </div>
      ) : (
        <div className="premium-card overflow-hidden" style={{ height: 'calc(100vh - 220px)' }}>
          <div className="d-flex h-100">
            {/* Contact List */}
            <div className="border-end d-flex flex-column" style={{ width: '280px', minWidth: '240px' }}>
              <div className="p-3 border-bottom">
                <div className="position-relative">
                  <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={16}/>
                  <input className="premium-input ps-5 py-2" placeholder="Search..." style={{ fontSize: '14px' }}
                    value={search} onChange={e => setSearch(e.target.value)}/>
                </div>
              </div>
              <div className="overflow-auto flex-grow-1">
                {filteredContacts.map(c => (
                  <div key={c._id}
                    className={`p-3 d-flex gap-3 align-items-center border-bottom ${activeChat?._id === c._id ? 'bg-light' : ''}`}
                    style={{ cursor: 'pointer' }} onClick={() => setActiveChat(c)}>
                    <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                         style={{ width: '40px', height: '40px', backgroundColor: getColor(c.name) }}>
                      {c.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-grow-1 overflow-hidden">
                      <div className="d-flex justify-content-between">
                        <span className="fw-bold" style={{ fontSize: '14px' }}>{c.name}</span>
                        {c.unreadCount > 0 && (
                          <span className="badge bg-primary rounded-pill">{c.unreadCount}</span>
                        )}
                      </div>
                      <div className="text-muted text-truncate" style={{ fontSize: '12px' }}>
                        {c.lastMessage || c.email}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            {!activeChat ? (
              <div className="flex-grow-1 d-flex align-items-center justify-content-center text-muted">
                <div className="text-center">
                  <MessageSquare size={48} className="mb-3 opacity-50" />
                  <h5 className="fw-bold">Select a contact</h5>
                  <p>Choose someone to start chatting</p>
                </div>
              </div>
            ) : (
              <div className="flex-grow-1 d-flex flex-column">
                {/* Header */}
                <div className="p-3 border-bottom d-flex align-items-center gap-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                       style={{ width: '38px', height: '38px', backgroundColor: getColor(activeChat.name) }}>
                    {activeChat.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="fw-bold" style={{ fontSize: '14px' }}>{activeChat.name}</div>
                    <small className="text-muted">{activeChat.role} • {activeChat.email}</small>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-grow-1 p-4 overflow-auto" style={{ backgroundColor: '#f8fafc' }}>
                  {messages.length === 0 ? (
                    <div className="text-center text-muted py-4">
                      <p>No messages yet. Say hello!</p>
                    </div>
                  ) : (
                    messages.map(m => (
                      <div key={m._id} className={`d-flex mb-3 ${m.senderId === myId ? 'justify-content-end' : ''}`}>
                        <div className={`p-3 ${m.senderId === myId ? 'bg-primary text-white' : 'bg-white border shadow-sm'}`}
                             style={{ maxWidth: '70%', borderRadius: m.senderId === myId ? '16px 16px 4px 16px' : '16px 16px 16px 4px' }}>
                          <p className="m-0" style={{ fontSize: '14px' }}>{m.text}</p>
                          <small className={`d-block mt-1 ${m.senderId === myId ? 'text-white opacity-75' : 'text-muted'}`} style={{ fontSize: '11px' }}>
                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </small>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={msgEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-top d-flex gap-2">
                  <input className="premium-input flex-grow-1 py-2" placeholder="Type a message..."
                    value={message} onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}/>
                  <button className="btn-dynamic px-4" onClick={handleSend} disabled={!message.trim()}>
                    <Send size={18}/>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
