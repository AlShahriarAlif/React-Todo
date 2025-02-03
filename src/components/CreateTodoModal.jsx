import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField"
import { useState } from 'react';
import toast from 'react-hot-toast';
import API_BASE_URL from "../config";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '400px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  display: 'flex',
  alignItems: 'center', 
  justifyContent: 'center'
};
export function CreateTodoModal({ updateTodos }) {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState("0");
    const [deadline,setDeadline]=useState("");
    const [description,setDescription] = useState("");

    async function createTodoClick() {
        const body = {
            "title": title,
            "description": description,
            "deadline": deadline,
            "priority": parseInt(priority)
        };
        const r = await fetch("${API_BASE_URL}/todo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        const j = await r.json();
        console.log(j);
        toast.success("Todo created");
        setTitle("");
        setPriority("");
        setIsOpen(false);
        updateTodos();
    }
    return <div>
        <Button onClick={() => setIsOpen(true)} variant="contained" size="large">Create</Button>
        <Modal open={isOpen} onClose={() => setIsOpen(false)}>
            <div style={style}>
                <div style={{backgroundColor:"white", padding: "20px"}}>
                    <h1>Add a Todo</h1>
                    <br/>
                    <br/>
                    <TextField placeholder='Title' value={title} onChange={e => setTitle(e.target.value)}/>
                    <br/>
                    <br/>
                    <TextField placeholder='Priority'  value={priority} onChange={e => setPriority(e.target.value)}/>
                    <br/>
                    <br/>
                    <TextField type='datetime-local' value={deadline} onChange={e=> setDeadline(e.target.value)} />
                    <br/>
                    <br/>
                    <TextField placeholder='Task Description' value={description} onChange={e=> setDescription(e.target.value)} />
                    <br/>
                    <br/>
                    <Button onClick={createTodoClick} fullWidth variant="contained" size="large">Create</Button>
                </div>
            </div>
        </Modal>
    </div>
}