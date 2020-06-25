import React, {useState} from 'react';
import '../stylesheets/inventory.css';
import InventoryDisplay from '../components/InventoryComp/InventoryDisplay';
import NavBar from '../components/NavBar';
import {isLoggedIn} from '../config/auth';

const Inventory = () => {
    const [loggedIn, setLoggedIn] = useState(isLoggedIn());
    return (
        <div className="inventory">
            <NavBar loggedIn={loggedIn} setLoggedIn ={setLoggedIn}/>
            <InventoryDisplay/>
        </div>
    )
}

export default Inventory;