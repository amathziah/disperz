import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token')); 

  const login = async (credentials) => {
    const res = await axios.post('http://localhost:5004/api/auth/login', credentials);
    const token = res.data.token;
    localStorage.setItem('token', token);
    setToken(token); 
    const userRes = await axios.get('http://localhost:5004/api/auth/check', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(userRes.data);
    return userRes.data
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (token) {
      axios
        .get('http://localhost:5004/api/auth/check', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => logout());
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
