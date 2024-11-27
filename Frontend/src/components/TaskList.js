import React, { useState } from 'react';
import api from '../api/api';
import { toast } from 'react-toastify';

const TaskList = ({ tasks, fetchTasks }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Filter tasks based on search and status filter
  const filteredTasks = tasks.filter((task) => {
    const matchesSearchQuery =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatusFilter = statusFilter
      ? task.status.toLowerCase() === statusFilter.toLowerCase()
      : true;

    return matchesSearchQuery && matchesStatusFilter;
  });

  // Edit task - update status only
  const handleEdit = async (task) => {
    const updatedStatus = prompt(
      'Enter new status (e.g., pending, in-progress, completed):',
      task.status
    );

    if (updatedStatus === null || updatedStatus.trim() === '') {
      toast.warning('Edit cancelled or empty status.');
      return;
    }

    try {
      await api.put(`/tasks/${task._id}`, {
        status: updatedStatus,
      });
      toast.success('Task status updated successfully!');
      fetchTasks(); // Refresh the task list after update
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to update task. Please try again.'
      );
    }
  };

  // Delete task
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return; // Exit if the user cancels
    }

    try {
      const response = await api.delete(`/tasks/${id}`);
      console.log('Delete response:', response);
      toast.success('Task deleted successfully!');
      fetchTasks();
    } catch (error) {
      console.error('Delete error:', error.response || error.message || error);
      toast.error(error.response?.data?.message || 'Failed to delete task. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
      <input
        type="text"
        placeholder="Search tasks"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ padding: '0.5rem', fontSize: '1rem' }}
       // style={{ padding: '0.5rem', fontSize: '1rem', resize: 'none', height: '100px' }}
      />
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        style={{ padding: '0.5rem', fontSize: '1rem' }}
      >
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <li
              key={task._id}
              style={{
                border: '1px solid #ccc',
                padding: '1rem',
                borderRadius: '5px',
                marginBottom: '1rem',
              }}
            >
              <h3>{task.title}</h3>
              <p>Description: {task.description}</p>
              <p>Status: {task.status}</p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => handleEdit(task)}
                  style={{
                    padding: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Edit Status
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  style={{
                    padding: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <p>No tasks found. Add some tasks to get started!</p>
        )}
      </ul>
    </div>
  );
};

export default TaskList;



// import {React,useState} from 'react';
// import api from '../api/api';
// import { toast } from 'react-toastify';

// const TaskList = ({ tasks, fetchTasks }) => {
//   const [searchQuery,setSerachQuery]=useState('');
//   const [statusFilter,setStatusFilter]=useState('');

//   //filtered tasks based on search and status filter
//   const filteredTasks = tasks.filter((task) => {
//     const matchesSearchQuery =
//       task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       task.description.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesStatusFilter = statusFilter
//       ? task.status.toLowerCase() === statusFilter.toLowerCase()
//       : true;

//     return matchesSearchQuery && matchesStatusFilter;
//   });
//   // Edit task - update status only
//   const handleEdit = async (task) => {
//     const updatedStatus = prompt(
//       'Enter new status (e.g., pending, in-progress, completed):',
//       task.status
//     );
//     if (updatedStatus === null || updatedStatus.trim() === '') {
//       toast.warning('Edit cancelled or empty status.');
//       return;
//     }

//     try {
//       await api.put(`/tasks/${task._id}`, {
//         status: updatedStatus,
//       });
//       toast.success('Task status updated successfully!');
//       fetchTasks(); // Refresh the task list after update
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message || 'Failed to update task. Please try again.'
//       );
//     }
//   };

//   // Delete task
//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this task?')) {
//       return; // Exit if the user cancels
//     }
//     // try {
//     //   await api.delete(`/tasks/${id}`);
//     //   toast.success('Task deleted successfully!');
//     //   fetchTasks(); // Refresh the task list after deletion
//     // } catch (error) {
//     //   toast.error(
//     //     error.response?.data?.message || 'Failed to delete task. Please try again.'
//     //   );
//     // }
//     try {
//       //console.log(Sending DELETE request to /tasks/${id});
//       const response = await api.delete(`/tasks/${id}`);
//       console.log("Delete response:", response);
//       toast.success('Task deleted successfully!');
//       fetchTasks();
//   } catch (error) {
//       console.error("Delete error:", error.response || error.message || error);
//       toast.error(error.response?.data?.message || 'Failed to delete task. Please try again.');
//   }
//   };

//   return (
//     <div>
//       <input
//       type="text"
//       placeholder='Search tasks'
//       value={searchQuery}
//       onChange={(e)=>setSerachQuery(e.target.value)}
//       />
//        <select
//         value={statusFilter}
//         onChange={(e) => setStatusFilter(e.target.value)}
//       >
//         <option value="">All Status</option>
//         <option value="pending">Pending</option>
//         <option value="in-progress">In Progress</option>
//         <option value="completed">Completed</option>
//       </select>
//     <ul>
//       {filteredTasks.length > 0 ? (
//         filteredTasks.map((task) => (
//           <li key={task._id} className="task-item">
//             <h3>{task.title}</h3>
//             <p>Description: {task.description}</p>
//             <p>Status: {task.status}</p>
//             <div className="task-actions">
//               <button className="edit-btn" onClick={() => handleEdit(task)}>
//                 Edit Status
//               </button>
//               {/* <button
//                 className="delete-btn"
//                 onClick={() => handleDelete(task._id)}
//               >
//                 Delete
//               </button> */}
//               <button className="delete-btn" onClick={() => handleDelete(task._id)}>Delete</button>
//             </div>
//           </li>
//         ))
//       ) : (
//         <p>No tasks found. Add some tasks to get started!</p>
//       )}
//     </ul>
//     </div>
//   );
// };

// export default TaskList;

// // import React from 'react';
// // import api from '../api/api';
// // import { toast } from 'react-toastify';

// // const TaskList = ({ tasks, fetchTasks, setTaskToEdit }) => {
// //   const handleDelete = async (id) => {
// //     try {
// //       await api.delete(`/tasks/${id}`);
// //       toast.success('Task deleted');
// //       fetchTasks();
// //     } catch (error) {
// //       toast.error('Failed to delete task');
// //     }
// //   };

// //   return (
// //     <ul>
// //       {tasks.map((task) => (
// //         <li key={task._id}>
// //           <h3>{task.title}</h3>
// //           <p>{task.description}</p>
// //           <button onClick={() => setTaskToEdit(task)}>Edit</button>
// //           <button onClick={() => handleDelete(task._id)}>Delete</button>
// //         </li>
// //       ))}
// //     </ul>
// //   );
// // };

// // export default TaskList;
