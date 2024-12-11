import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import api from './api/api';
import TaskManager from './components/TaskManager';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const fetchTasks = async () => {
    const response = await api.get('/tasks');
    setTasks(response.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/tasks"
          element={
            <>
              <TaskForm fetchTasks={fetchTasks} taskToEdit={taskToEdit} clearEdit={() => setTaskToEdit(null)} />
              <TaskList tasks={tasks} fetchTasks={fetchTasks} setTaskToEdit={setTaskToEdit} />
              <TaskManager />
              
            </>
            
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
