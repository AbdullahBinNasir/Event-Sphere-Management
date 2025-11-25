import { useState, useEffect } from 'react'
import * as notificationService from '../services/notificationService'
import './NotificationDropdown.css'

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        loadNotifications()
        const interval = setInterval(loadNotifications, 10000)
        return () => clearInterval(interval)
    }, [])

    const loadNotifications = async () => {
        const result = await notificationService.getNotifications()
        if (result.success) {
            setNotifications(result.data)
            setUnreadCount(result.data.filter(n => !n.read).length)
        }
    }

    const handleMarkAsRead = async (id) => {
        await notificationService.markAsRead(id)
        loadNotifications()
    }

    return (
        <div className="notification-dropdown">
            <button className="notification-btn" onClick={() => setIsOpen(!isOpen)}>
                <i className="mdi mdi-bell-outline"></i>
                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </button>

            {isOpen && (
                <div className="dropdown-menu">
                    <div className="dropdown-header">
                        <h4>Notifications</h4>
                    </div>
                    <div className="dropdown-content">
                        {notifications.length === 0 ? (
                            <div className="empty-notifications">No notifications</div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                                    onClick={() => handleMarkAsRead(notification._id)}
                                >
                                    <div className="notification-icon">
                                        <i className={`mdi mdi-${notification.type === 'alert' ? 'alert-circle' : 'information'}`}></i>
                                    </div>
                                    <div className="notification-text">
                                        <p>{notification.message}</p>
                                        <span className="time">
                                            {new Date(notification.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default NotificationDropdown
