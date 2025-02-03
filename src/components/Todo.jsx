import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import toast from 'react-hot-toast';
import { useState,useEffect } from 'react';

export function Todo({ title, is_completed, priority, id, updateTodos,deadline,description }) {
    const [completed, setCompleted] = useState(is_completed);
    const [remainingTime, setRemainingTime] = useState(0);

    async function deleteClick() {
        try {
            const response = await fetch(`http://3.109.211.104:8001/todo/${id}`, {
                method: "DELETE"
            });
            const data = await response.json();
            toast.success(data.message);
            updateTodos(); 
        } catch (error) {
            toast.error("Failed to delete todo");
        }
    }

    async function updateState() {
        try {
            const response = await fetch(`http://3.109.211.104:8001/todo/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: title, 
                description: description, 
                deadline: deadline, 
                priority: priority, 
                is_completed: !completed  
                })
            });
    
            if (!response.ok) {
                throw new Error("Failed to update todo");
            }
    
            const data = await response.json();
            setCompleted(!completed); 
            toast.success(data.message);
            updateTodos(); 
        } catch (error) {
            toast.error(error.message || "Failed to update todo");
        }
    }

    useEffect(() => {
        function updateTimer() {
            if (!deadline) return;
            const timeLeft = Math.max(0, Math.floor((new Date(deadline) - Date.now()) / 1000));
            setRemainingTime(timeLeft);
        }

        updateTimer(); 
        const interval = setInterval(updateTimer, 1000); 

        return () => clearInterval(interval); 
    }, [deadline]);

    return (
      
                
                
               
        <Card variant="outlined" sx={{ maxWidth: 360 }}>
      <Box sx={{ p: 2 }}>
        <Stack
          direction="row"
          sx={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Typography gutterBottom variant="h5" component="div">
            Task Name:<br/>
          {completed ? "✅" : "⌛"} {title}
          </Typography>
          <Typography gutterBottom variant="h6" component="div" display='flex' flexDirection='column' alignItems='center'>
            Delete Task:<br/>
          <div onClick={deleteClick} style={{ fontSize: "30px", cursor: "pointer" }}>
                    <DeleteIcon />
                </div>
          </Typography>
        </Stack>
        <Typography variant="body2" >
           <h4> Task Description : </h4>
           {description}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography gutterBottom variant="body2">
        <Button
                    variant="contained"
                    color="primary"
                    onClick={updateState}
                    style={{ marginRight: "10px" }}
                >
                    {completed ? "Mark Incomplete" : "Mark Complete"}
                </Button>
        </Typography>
        <Typography gutterBottom variant="body2">
        <div>
            <h3>Remaining Time</h3>
            <p>{remainingTime > 0 ? `${remainingTime} seconds left` : "Time is up!"}</p>
        </div>
        </Typography>
      </Box>
    </Card>

         
        
    );
}