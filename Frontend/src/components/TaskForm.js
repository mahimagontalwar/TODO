import React, { useState } from 'react';
import api from '../api/api';
import { toast } from 'react-toastify';

const TaskForm = ({ fetchTasks, taskToEdit, clearEdit }) => {
  const [task, setTask] = useState(taskToEdit || { title: '', description: '', status: '', user: '' });

  const handleChange = (e) => {
    setTask({ 
      ...task, 
      [e.target.name]: e.target.value, 
      status: 'pending', 
      user: localStorage.getItem('id') 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (task._id) {
        await api.put(`/tasks/${task._id}`, task);
        toast.success('Task updated');
        clearEdit();
      } else {
        await api.post('/tasks', task);
        toast.success('Task added');
      }

      fetchTasks();
      setTask({ title: '', description: '' });
    } catch (error) {
      toast.error('Failed to save task');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px', margin: '0 auto' }}
      
    >
      <h2 style={{ textAlign: 'center' }}>Tasks</h2>
      <input
        type="text"
        name="title"
        value={task.title}
        onChange={handleChange}
        placeholder="Title"
        required
        style={{ padding: '0.5rem', fontSize: '1rem' }}
      />
      <textarea
        name="description"
        value={task.description}
        onChange={handleChange}
        placeholder="Description"
        style={{ padding: '0.5rem', fontSize: '1rem', resize: 'none', height: '100px' }}
      />
      <button 
        type="submit" 
        style={{ padding: '0.7rem', fontSize: '1rem', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}
      >
        {task._id ? 'Update Task' : 'Add Task'}
      </button>
    </form>
  );
};

export default TaskForm;
// import React, { useState } from 'react';
// import api from '../api/api';
// import { toast } from 'react-toastify';

// const TaskForm = ({ fetchTasks, taskToEdit, clearEdit }) => {
//   const [task, setTask] = useState(taskToEdit || { title: '', description: '' ,status:'',user:''});

//   const handleChange = (e) => {
    
//     setTask({ ...task, [e.target.name]: e.target.value ,status:"pending",user:localStorage.getItem("id")});
//   };

//   const handleSubmit = async (e) => {
  
//     e.preventDefault();
//     console.log(e.target);
//     try {
//       if (task._id) {
//         await api.put(`/tasks/${task._id}`, task);
//         toast.success('Task updated');
//         clearEdit();
//       } else {
//         await api.post('/tasks', task);
//         toast.success('Task added');
//       }
//       fetchTasks();
//       setTask({ title: '', description: '' });
//     } catch (error) {
//       toast.error('Failed to save task');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input type="text" name="title" value={task.title} onChange={handleChange} placeholder="Title" required />
//       <textarea name="description" value={task.description} onChange={handleChange} placeholder="Description" />

//       <button type="submit">{task._id ? 'Update Task' : 'Add Task'}</button>
//     </form>
//   );
// };

// export default TaskForm;
