import { Login } from "./Login";
import { Create } from "./Create";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';

function Home() {
    const navigate = useNavigate();
    return <div style={{display:"flex",flexDirection:"column",gap:"20px",alignItems:"center"}}>
        
            Welcome to our Todo App! 🚀
          <Button onClick={()=>navigate("/signup")}>{"Register" }</Button>
          <Button onClick={()=>navigate("/login")}>{"Login" }</Button>

        
    </div>
}

export { Home }