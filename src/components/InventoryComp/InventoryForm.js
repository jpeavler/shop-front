import React, {useState, useEffect} from 'react';
import {Modal, ModalHeader, ModalBody, Form, Input, Button} from 'reactstrap';
import {isLoggedIn} from '../../config/auth';

const InventoryForm = ({myItem, id, inventory, setInv, setUpdate}) => {
    let formName = myItem ? myItem.name : "";
    let formDesc = myItem ? myItem.desc : "";
    let formCount = myItem ? myItem.quantity : "";
    let formPrice = myItem ? myItem.price : "";
    let modalOpen = myItem ? true : false;
    const [name, setName] = useState(formName);
    const [desc, setDesc] = useState(formDesc);
    const [quantity, setCount] = useState(formCount);
    const [price, setPrice] = useState(formPrice);
    const [modal, setModal] = useState(modalOpen);
    const [username, setUsername] = useState('');

    const getUserInfo = () => {
        fetch(`https://shop-jpeavler.herokuapp.com/api/auth/id/${isLoggedIn()}`)
        .then(response => response.json()).then(userInfo => setUsername(userInfo.username))
    }
    useEffect(() => {
        getUserInfo();
    }, [])
    const closeForm = () => {
        setName("");
        setDesc("");
        setCount("");
        setPrice("");
        setModal(!modal);
        setUpdate(false);
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        let isActive = true;
        let seller = username;
        if(myItem) {
            isActive = myItem.isActive;
            const updatedItem = {name, desc, quantity, price, isActive, seller};
            fetch(`https://shop-jpeavler.herokuapp.com/api/inventory/${id}`, {
                method: 'PUT',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(updatedItem)
            })
            .then(response => response.json())
            .then(res => {
                console.log("Response from Backend", res);
                let invCopy = [...inventory];
                invCopy.forEach((item, index) => {
                    if(item._id === res.modifiedItem._id) {
                        invCopy[index] = res.modifiedItem;
                    }
                })
                console.log("InvCopy after change", invCopy);
                setInv(invCopy);
            })
            .then(() => closeForm())
        } else {
            const addedItem = {name, desc, quantity, price, isActive, seller};
            fetch(`https://shop-jpeavler.herokuapp.com/api/inventory`, {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(addedItem)
            })
            .then(response => response.json())
            .then(res => {
                console.log("Response from Backend", res);
                let invCopy = [...inventory];
                invCopy.push(res.insertedItem);
                setInv(invCopy);
            })
            .then(() => closeForm())
        }
    }
    const toggle = () => setModal(!modal);
    let renderSubmit;
    let cancel;
    let formHeader;
    if(myItem) {
        renderSubmit = <Button color="primary" key="edit" type="submit" block>Edit Item</Button>
        cancel = <Button type="button" key="canceledit" onClick={() => closeForm()} block>Cancel Edit</Button>
        formHeader = <ModalHeader key="edithead">Edit Item: {myItem.name}</ModalHeader>
    } else {
        renderSubmit = <Button color="primary" key="add" type="submit" block>Add Item</Button>
        cancel = <Button type="button" key="canceladd" onClick={toggle} block>Cancel Add</Button>
        formHeader = <ModalHeader key="addhead">Add a New Item</ModalHeader>
    }
    return (
        <><Button color="primary" className="topbtn" onClick={toggle}>Add New Item</Button>
        <Modal isOpen={modal} toggle={toggle} className="modelform">
            {formHeader}
            <ModalBody>
            <Form onSubmit={handleSubmit}>
                <Input placeholder="Item Name" value={name} 
                    type="text" onChange={({target}) => setName(target.value)} required/>
                <Input type="textarea" placeholder="Description" value={desc} 
                    onChange={({target}) => setDesc(target.value)}/>
                <Input placeholder="Item Count" value={quantity} type="number" 
                    onChange={({target}) => setCount(target.value)} required/>
                <Input placeholder="Price" value={price}
                    type="number" min=".01" step=".01" 
                    onChange={({target}) => setPrice(target.value)} required/>
                {renderSubmit}
                {cancel}
            </Form>
            </ModalBody>
        </Modal></>
    )
}

export default InventoryForm;