import React, {useState, useEffect} from 'react';
import {Button, Media} from 'reactstrap';
import NavBar from '../components/NavBar'
import {isLoggedIn} from '../config/auth';
import ProfileForm from '../components/UserComp/ProfileForm';

const Profile = () => {
    const [loggedIn, setLoggedIn] = useState(isLoggedIn());     //loggedIn returns the token if the user is logged in
    const [user, setUser] = useState("");
    const [newBio, setBio] = useState();
    const [newPic, setPic] = useState(0);
    const [modalOpen, setModal] = useState(false);

    const getUserInfo = () => {
        fetch(`https://shop-jpeavler.herokuapp.com/api/inventory/api/auth/id/${loggedIn}`)
        .then(response => response.json()).then(userInfo => {
            setUser(userInfo); 
            setBio(userInfo.bio);
            setPic(userInfo.pic);
        })
    }
    const updateProfile = (event) => {
        event.preventDefault();
        let toUpdate = {bio: newBio, pic: newPic};
        fetch(`https://shop-jpeavler.herokuapp.com/api/inventory/api/auth/id/${loggedIn}`, {
            method: "PATCH",
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(toUpdate)
        }).then(() => getUserInfo()).then(() => setModal(false))
    }
    useEffect(() => {
        getUserInfo();
    }, []);
    const toggle = () => {setModal(!modalOpen)}

    let img;
    if(user.pic == 0) {img =<Media object src="/assets/blackUser.png" alt="Profile0" className="profilepic"/>}
    else if(user.pic == 1) {img =<Media object src="/assets/redUser.png" alt="Profile1" className="profilepic"/>}
    else if(user.pic == 2) {img =<Media object src="/assets/blueUser.png" alt="Profile2" className="profilepic"/>}
    else if(user.pic == 3) {img =<Media object src="/assets/purpleUser.png" alt="Profile3" className="profilepic"/>}
    return (
        <div className="profile">
            <NavBar loggedIn={loggedIn} setLoggedIn ={setLoggedIn}/>
            <Media>
                <Media left>
                    {img}
                </Media>
                <Media body>
                    <Media heading>Welcome {user.username} to your Profile</Media>
                    {user.bio}
                    <Button onClick={() => setModal(true)}>Update Profile</Button>
                </Media>
            </Media>
            <ProfileForm updateProfile={updateProfile} bio={newBio} setBio={setBio} 
                        user={user} setPic={setPic} modal={modalOpen} toggle={toggle}/>
        </div>
    )
}

export default Profile;