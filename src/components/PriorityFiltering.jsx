import { useState } from "react";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import API_BASE_URL from "../config";

function PriorityFiltering({ setFilterPriority }) {
    const [priority, setPriority] = useState("all");

    function handleFilterChange(event) {
        setPriority(event.target.value);
        setFilterPriority(event.target.value);
    }

    return (
        <div>
            <h3>Filter by Priority</h3>
            <Select value={priority} onChange={handleFilterChange}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="high">High (Priority greater than  8)</MenuItem>
                <MenuItem value="medium">Medium (5 ≤ Priority ≤ 8)</MenuItem>
                <MenuItem value="low">Low (Priority less than 5)</MenuItem>
            </Select>
        </div>
    );
}

export { PriorityFiltering };
