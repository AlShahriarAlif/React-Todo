import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Box, TextField, Button } from "@mui/material";
import toast from "react-hot-toast";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";


export function Profile() {
    const [profileData, setProfileData] = useState(null);
    const [editData, setEditData] = useState({ name: "", email: "", phone: "", profile_picture: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [todos, setTodos] = useState([]); // Store all tasks
    const navigate = useNavigate();
    const username = localStorage.getItem("username");

    useEffect(() => {
        async function fetchProfile() {
            try {
                if (!username) {
                    toast.error("User not logged in");
                    navigate("/login");
                    return;
                }

                const response = await fetch(`https://5nvfy5p7we.execute-api.ap-south-1.amazonaws.com/dev/profile/${username}`);
                if (!response.ok) throw new Error("Failed to fetch profile");

                const data = await response.json();
                setProfileData(data);
                setEditData(data);
            } catch (error) {
                toast.error(error.message);
                navigate("/dashboard");
            }
        }

        async function fetchTodos() {
            try {
                const response = await fetch("https://5nvfy5p7we.execute-api.ap-south-1.amazonaws.com/dev/todos");
                if (!response.ok) throw new Error("Failed to fetch todos");

                const data = await response.json();
                setTodos(data);
            } catch (error) {
                toast.error(error.message);
            }
        }

        fetchProfile();
        fetchTodos();
    }, [navigate, username]);

    // Calculate Statistics
    const totalTasks = todos.length;
    const completedTasks = todos.filter(todo => todo.is_completed).length;
    const efficiency = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0;

    // Pie Chart Data
    const pieData = [
        { name: "Completed Tasks", value: completedTasks, color: "#4CAF50" }, // Green
        { name: "Incomplete Tasks", value: totalTasks - completedTasks, color: "#F44336" } // Red
    ];

    async function handleUpdateProfile() {
        try {
            const response = await fetch(`${API_BASE_URL}/profile/${username}`, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(editData)
            });

            if (!response.ok) throw new Error("Failed to update profile");

            const updatedProfile = await response.json();
            setProfileData(updatedProfile);
            toast.success("Profile updated successfully");
            setIsModalOpen(false);
        } catch (error) {
            toast.error(error.message);
        }
    }

    if (!profileData) {
        return <h1 style={{ textAlign: "center" }}>Loading...</h1>;
    }

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h1>Profile Page</h1>
            <div style={{ marginTop: "20px" }}>
                <p><strong>Name:</strong> {profileData.name || "N/A"}</p>
                <p><strong>Email:</strong> {profileData.email || "N/A"}</p>
                <p><strong>Phone:</strong> {profileData.phone || "N/A"}</p>
                <p><strong>Profile Picture:</strong></p>
                {profileData.profile_picture ? (
                    <img src={profileData.profile_picture} alt="Profile" style={{ width: "100px", height: "100px", borderRadius: "50%" }} />
                ) : (
                    <p>No profile picture</p>
                )}

                {/* Edit Profile Button */}
                <Button onClick={() => setIsModalOpen(true)} variant="contained" style={{ marginTop: "20px" }}>
                    Edit Profile
                </Button>

                {/* Back to Dashboard */}
                <Button onClick={() => navigate("/dashboard")} variant="outlined" style={{ marginTop: "20px", marginLeft: "10px" }}>
                    Back to Dashboard
                </Button>
            </div>

            {/* Statistics Section */}
            <div style={{ marginTop: "40px" }}>
                <h2>Task Statistics</h2>
                <p><strong>Total Tasks:</strong> {totalTasks}</p>
                <p><strong>Completed Tasks:</strong> {completedTasks}</p>
                <p><strong>Efficiency:</strong> {efficiency}%</p>

                {/* Pie Chart */}
                <PieChart width={300} height={300}>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </div>

            {/* Edit Profile Modal */}
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Box sx={{
                    position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                    width: 400, bgcolor: "white", p: 4, borderRadius: "10px", textAlign: "center"
                }}>
                    <h2>Edit Profile</h2>
                    <TextField fullWidth margin="normal" label="Name" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                    <TextField fullWidth margin="normal" label="Email" type="email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
                    <TextField fullWidth margin="normal" label="Phone" type="text" value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} />
                    <TextField fullWidth margin="normal" label="Profile Picture URL" type="text" value={editData.profile_picture} onChange={(e) => setEditData({ ...editData, profile_picture: e.target.value })} />

                    <Button onClick={handleUpdateProfile} variant="contained" color="primary" fullWidth style={{ marginTop: "10px" }}>
                        Save Changes
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}
