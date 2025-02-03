import { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";


function Sorting({ setSortBy }) {
    const [sortOption, setSortOption] = useState("none");

    function handleSortChange(event) {
        const selectedSort = event.target.value;
        setSortOption(selectedSort);
        setSortBy(selectedSort); 
    }

    return (
        <div>
            <h3>Sort Todos</h3>
            <Select value={sortOption} onChange={handleSortChange}>
                <MenuItem value="none">None</MenuItem>
                <MenuItem value="created_at">Creation Time</MenuItem>
                <MenuItem value="deadline">Deadline</MenuItem>
                <MenuItem value="priority">Priority</MenuItem>
            </Select>
        </div>
    );
}

export { Sorting };
