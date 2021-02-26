import { Link, useHistory } from "react-router-dom"; 
import { useState } from 'react'; 
import "./MainNavbar.css"
import { loadJSON } from '../utils/localStorage'; 

const MainNavbar = () => { 

    const [ isToken, setToken ] = useState(
        localStorage.getItem("access_token") ? true : false
    )

    const history = useHistory(); 

    const first_name = loadJSON("app_data").first_name; 

    const logout = () => {
        const toLogout = window.confirm("Are you sure to logout?"); 
        if (toLogout) {
            localStorage.clear(); 
            history.push("/")
        }
    }
  
    return(
        <nav className='main-navbar'>
            <div>instaHarvest Logo</div>
            {isToken ? (
            <div className="main-navbar-links">
                <div>
                    {first_name}
                </div>
                <button onClick={logout}>
                    Logout
                </button>

            </div>
            ) : 
            (<div className="main-navbar-links">
                <div>
                    <Link to="/login">Login</Link>
                </div>
                <div>
                    <Link to="/signup">Sign Up</Link>
                </div>
            </div>)
            }
        </nav>
    )
  
}

export default MainNavbar; 