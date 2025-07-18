import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  const fetchTodos = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/todos', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTodos(res.data);
    } catch (err) {
      setError('Failed to fetch todos');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleToggle = async (id, completed) => {
    try {
      await axios.put(`/api/todos/${id}`, { completed: !completed }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchTodos();
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchTodos();
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  const handleEdit = (id, text) => {
    setEditId(id);
    setEditText(text);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/todos/${editId}`, { text: editText }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEditId(null);
      setEditText('');
      fetchTodos();
    } catch (err) {
      setError('Failed to edit todo');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo._id}>
          {editId === todo._id ? (
            <form onSubmit={handleEditSubmit} style={{ display: 'inline' }}>
              <input value={editText} onChange={e => setEditText(e.target.value)} required />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditId(null)}>Cancel</button>
            </form>
          ) : (
            <>
              <span
                style={{ textDecoration: todo.completed ? 'line-through' : 'none', cursor: 'pointer' }}
                onClick={() => handleToggle(todo._id, todo.completed)}
              >
                {todo.text}
              </span>
              <button onClick={() => handleEdit(todo._id, todo.text)}>Edit</button>
              <button onClick={() => handleDelete(todo._id)}>Delete</button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TodoList; 