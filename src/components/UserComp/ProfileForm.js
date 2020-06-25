import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, Form, Input} from 'reactstrap';
import '../../stylesheets/profile.css';

const ProfileForm = ({updateProfile, bio, setBio, setPic, modal, toggle, user}) => {
    return (
        <Modal isOpen={modal} toggle={toggle} className="profileform">
            <ModalHeader toggle={toggle}>Edit Portfolio</ModalHeader>
            <ModalBody><Form onSubmit={updateProfile}>
                <Input type="textarea" value={bio} onChange={({target}) => setBio(target.value)} required/>
                <button type="button" onClick={() => setPic(0)}>
                    <img src="/assets/blackUser.png" alt="Profile0" className="profilepic"/>
                </button>
                <button type="button" onClick={() => setPic(1)}>
                    <img src="/assets/redUser.png" alt="Profile1" className="profilepic"/>
                </button>
                <button type="button" onClick={() => setPic(2)}>
                    <img src="/assets/blueUser.png" alt="Profile2" className="profilepic"/>
                </button>
                <button type="button" onClick={() => setPic(3)}>
                    <img src="/assets/purpleUser.png" alt="Profile3" className="profilepic"/>
                </button>
                <Button color="primary" block>Update Profile</Button>
            </Form></ModalBody>
        </Modal>
    )
}

export default ProfileForm;