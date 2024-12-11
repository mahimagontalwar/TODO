import React, { useState } from 'react';
import axios from 'axios';

const TaskManager = () => {
    const [file, setFile] = useState(null);
    const handleExport = async () => {
        try {
          // Fetch the Excel file from the backend
          const response = await fetch('http://localhost:5000/api/tasks/export', {
            method: 'GET',
            headers: {
              'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Ensure the correct MIME type
            },
          });
      
          // Log the response to see if it's as expected
          console.log(response);
          
          // Check if the response is okay
          if (!response.ok) {
            throw new Error('Failed to fetch file');
          }
      
          // Convert the response to a Blob (binary data)
          const blob = await response.blob();
          
          // Log the blob size and type for debugging
          console.log(blob);
          
          if (blob.size === 0) {
            throw new Error('Empty file received');
          }
      
          // Create a URL for the Blob
          const url = window.URL.createObjectURL(blob);
      
          // Create an anchor tag and trigger the download
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'tasks.xlsx'); // Set desired filename
          document.body.appendChild(link);
          link.click();
      
          // Cleanup
          link.parentNode.removeChild(link);
          window.URL.revokeObjectURL(url); // Revoke the created URL to free memory
        } catch (error) {
          console.error('Error exporting file:', error);
        }
      };
    
      
      
      
        
      
        const handleFileChange = (e) => {
          const file = e.target.files[0];
          setFile(file);
        };
      
        const handleSubmit = async (e) => {
          e.preventDefault();
          if (!file) {
            alert("Please upload a file.");
            return;
          }
      
          const formData = new FormData();
          formData.append('file', file);
      
          try {
            const response = await axios.post('http://localhost:5000/api/tasks/import', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
            console.log(response);
            alert('File uploaded successfully');
          } catch (error) {
            console.error('Error uploading file', error);
            alert('Error uploading file');
          }
        };
      
    
    return (
        <div>
            <h1>Task Manager</h1>
            <div>
                {/* Export Tasks */}
                <button onClick={handleExport}>Export Tasks</button>
            </div>
            <br />
            <div>
            <h1>Import Tasks</h1>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload</button>
                </form>
            </div>
        </div>
    );
};

export default TaskManager;
