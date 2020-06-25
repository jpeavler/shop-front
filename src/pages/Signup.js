import React from 'react';
import NavBar from '../components/NavBar'
import SignupForm from '../components/UserComp/SignupForm'

const Signup = () => {
    return (
        <div className="signup">
            <NavBar/>
            <h2>Signup</h2>
            <SignupForm/>
        </div>
    )
}

export default Signup;