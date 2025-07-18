import React, { useState } from 'react';
import axios from 'axios';

const AddTodo = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('/api/todos', { text }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setText('');
      if (onAdd) onAdd();
    } catch (err) {
      setError('Failed to add todo');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={text} onChange={e => setText(e.target.value)} placeholder="Add new todo" required />
      <button type="submit">Add</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
};

export default AddTodo; 