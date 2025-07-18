import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      setUser({}); 
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      <nav style={{ marginBottom: 20 }}>
        {user ? (
          <>
            <Link to="/todos">Todos</Link>
            <button onClick={handleLogout} style={{ marginLeft: 10 }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup" style={{ marginLeft: 10 }}>Signup</Link>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/signup" element={<Signup onSignupSuccess={() => {}} />} />
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/todos" element={user ? <TodoPage /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={user ? "/todos" : "/login"} />} />
      </Routes>
    </Router>
  );
};

const TodoPage = () => {
  const [refresh, setRefresh] = useState(false);
  const handleAdd = () => setRefresh(r => !r);
  return (
    <div>
      <h2>My Todos</h2>
      <AddTodo onAdd={handleAdd} />
      <TodoList key={refresh} />
    </div>
  );
};

export default App;
