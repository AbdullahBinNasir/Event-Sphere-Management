import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import * as messageService from '../services/messageService'
import Button from './Button'
import Alert from './Alert'
import './ChatWindow.css'

const ChatWindow = ({ recipientId, recipientName, onClose }) => {
    const { user } = useAuth()
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const [error, setError] = useState('')
    const messagesEndRef = useRef(null)

    useEffect(() => {
        loadMessages()
        const interval = setInterval(loadMessages, 5000) // Poll every 5 seconds
        return () => clearInterval(interval)
    }, [recipientId])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const loadMessages = async () => {
        try {
            const result = await messageService.getMessages(recipientId)
            if (result.success) {
                setMessages(result.data || [])
                setError('')
            } else {
                setError(result.error || 'Failed to load messages')
            }
        } catch (err) {
            setError('Failed to load messages')
        } finally {
            setLoading(false)
        }
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleSend = async (e) => {
        e.preventDefault()
        if (!newMessage.trim() || sending) return

        setSending(true)
        setError('')
        
        const messageContent = newMessage.trim()
        setNewMessage('') // Clear input immediately for better UX

        const result = await messageService.sendMessage(recipientId, messageContent)
        
        if (result.success) {
            // Reload messages to get the latest from server
            await loadMessages()
        } else {
            setError(result.error || 'Failed to send message')
            setNewMessage(messageContent) // Restore message on error
        }
        
        setSending(false)
    }

    // Helper function to check if message is from current user
    const isMyMessage = (message) => {
        if (!user || !message.sender) return false
        const senderId = typeof message.sender === 'object' ? message.sender._id : message.sender
        return senderId.toString() === user._id.toString()
    }

    return (
        <div className="chat-window">
            <div className="chat-header">
                <h3>Chat with {recipientName}</h3>
                <button className="close-btn" onClick={onClose}>&times;</button>
            </div>
            <div className="chat-messages">
                {loading ? (
                    <div className="loading-messages">Loading...</div>
                ) : messages.length === 0 ? (
                    <div className="no-messages">No messages yet. Start the conversation!</div>
                ) : (
                    messages.map((msg) => {
                        const isMine = isMyMessage(msg)
                        return (
                            <div
                                key={msg._id}
                                className={`message ${isMine ? 'sent' : 'received'}`}
                            >
                                <div className="message-content">{msg.content}</div>
                                <div className="message-time">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        )
                    })
                )}
                <div ref={messagesEndRef} />
            </div>
            {error && (
                <div className="chat-error">
                    <Alert type="error" message={error} />
                </div>
            )}
            <form className="chat-input" onSubmit={handleSend}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => {
                        setNewMessage(e.target.value)
                        setError('') // Clear error when typing
                    }}
                    placeholder="Type a message..."
                    disabled={sending}
                />
                <Button 
                    type="submit" 
                    variant="primary" 
                    disabled={!newMessage.trim() || sending}
                >
                    {sending ? 'Sending...' : 'Send'}
                </Button>
            </form>
        </div>
    )
}

export default ChatWindow
