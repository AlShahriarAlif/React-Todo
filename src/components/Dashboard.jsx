import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Todo } from "./Todo";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { CreateTodoModal } from "./CreateTodoModal";
import toast from "react-hot-toast";
import { PriorityFiltering } from "./PriorityFiltering";
import { Sorting } from "./Sorting";
import PersonIcon from '@mui/icons-material/Person';
import { Profile } from "./Profile";

export function Dashboard() {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");

    const [todolist, setTodoList] = useState([]);
    const [search, setSearch] = useState("");
    const [filterPriority, setFilterPriority] = useState("all");
    const [sortBy, setSortBy] = useState("none"); 

    async function getTodos() {
        const r = await fetch("${API_BASE_URL}/todos");
        const j = await r.json();
        setTodoList(j);
    }

    useEffect(() => {
        if (!username) navigate("/login");
        getTodos();
    }, []);

    function logoutClick() {
        localStorage.removeItem("username");
        toast.success("Logged out successfully");
        navigate("/login");
    }

 
    const filteredTodos = todolist.filter(todo => {
        const matchesSearch = todo.title.toLowerCase().includes(search.toLowerCase());

        if (filterPriority === "high") return matchesSearch && todo.priority > 8;
        if (filterPriority === "medium") return matchesSearch && todo.priority >= 5 && todo.priority <= 8;
        if (filterPriority === "low") return matchesSearch && todo.priority < 5;
        return matchesSearch;
    });

   
    const sortedTodos = [...filteredTodos].sort((a, b) => {
        if (sortBy === "created_at") return new Date(a.created_at) - new Date(b.created_at);
        if (sortBy === "deadline") return new Date(a.deadline) - new Date(b.deadline);
        if (sortBy === "priority") return b.priority - a.priority; 
        return 0;
    });
  

    return (<>  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
       
        
        <Button onClick={() => navigate("/profile")} variant="contained">
            <PersonIcon /> Profile
        </Button>
    </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
            <div style={{ width: "500px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>Welcome, {username}!</h1>
                

                    <Button variant="outlined" size="large" color="error" onClick={logoutClick}>Logout</Button>
                </div>

               
                <PriorityFiltering setFilterPriority={setFilterPriority} />
                <Sorting setSortBy={setSortBy} />

              
                <div style={{ padding: "10px" }}>
                    <TextField fullWidth placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} />
                </div>

                
                <div>
                    {sortedTodos.map((value) => (
                        <Todo 
                            key={value.id}
                            title={value.title} 
                            priority={value.priority} 
                            is_completed={value.is_completed} 
                            id={value.id} 
                            deadline={value.deadline} 
                            description={value.description} 
                            updateTodos={getTodos}
                        />
                    ))}
                </div>

                <br /><br />
                <CreateTodoModal updateTodos={getTodos} />
            </div>
        </div>
        </>
    );
}
