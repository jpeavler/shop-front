import React from 'react';
import {Link} from 'react-router-dom';
import {Button} from 'reactstrap';
import '../stylesheets/NavBar.css';
import {logout} from '../config/auth';

const NavBar = ({loggedIn, setLoggedIn}) =>{
    let logBtn;
    const handleLogout = () => {
        logout();
        setLoggedIn(false);
    }
    if(loggedIn) {
        logBtn = <Button className="NavLink" onClick={() => handleLogout()} color="primary">Logout</Button>
    } else {
        logBtn = <Link to='/signup' className="NavLink">Register</Link>
    }
    return(
        <nav>
            <Link to='/' className="NavLink">Home</Link>
            <Link to='/profile' className="NavLink">Profile</Link>
            <Link to='/inventory' className="NavLink">Inventory</Link>
            <Link to='/cart' className="NavLink">Cart</Link>
            {logBtn}
        </nav>
    )
}

export default NavBar;