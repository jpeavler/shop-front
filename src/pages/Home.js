import React, {useState} from 'react';
import NavBar from '../components/NavBar';
import LoginForm from '../components/UserComp/LoginForm';
import ShopDisplay from '../components/InventoryComp/ShopDisplay';
import {isLoggedIn} from '../config/auth'

const Home = () => {
    const [loggedIn, setLoggedIn] = useState(isLoggedIn());
    return (
        <div className="home">
            <NavBar loggedIn={loggedIn} setLoggedIn ={setLoggedIn}/>
            <LoginForm loggedIn={loggedIn} setLoggedIn ={setLoggedIn}/>
            <ShopDisplay/>
        </div>
    )
}

export default Home;