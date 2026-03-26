import { createContext, useContext, useState } from 'react';
import { USERS } from '../data';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [leads, setLeads] = useState(null);
  const [tickets, setTickets] = useState(null);
  const [invoices, setInvoices] = useState(null);
  const [notifications, setNotifications] = useState(null);

  const login = (email, password) => {
    const user = USERS.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return { success: true, role: user.role };
    }
    return { success: false };
  };

  const logout = () => setCurrentUser(null);

  const markNotificationRead = (id) => {
    setNotifications(prev => prev?.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <AppContext.Provider value={{ currentUser, login, logout, leads, setLeads, tickets, setTickets, invoices, setInvoices, notifications, setNotifications, markNotificationRead }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
