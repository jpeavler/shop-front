import React, {useState, useEffect} from 'react';
import {Modal, ModalBody, ModalHeader, Button, CardDeck, Card, CardHeader, CardBody, CardFooter} from 'reactstrap';
import {isLoggedIn} from '../../config/auth';
import InventoryForm from './InventoryForm';

const InventoryDisplay = () => {
    const [inventory, setInv] = useState([]);
    const [isUpdate, setUpdate] = useState(false);
    const [itemToUpdate, setItemToUpdate] = useState('');
    const [displayActive, setActive] = useState(true);
    const [displayInactive, setInactive] = useState(true);
    const [filterModal, setFModal] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        getUserInfo();
        getInv();
    }, []);
    const getInv = () => {
        fetch(`https://shop-jpeavler.herokuapp.com/api/inventory`)
            .then(response => response.json()).then(inv => setInv(inv))
            .then(() => setUpdate(false)).then(() => setItemToUpdate(''))
    }
    const getUserInfo = () => {
        fetch(`https://shop-jpeavler.herokuapp.com/api/auth/id/${isLoggedIn()}`)
        .then(response => response.json()).then(userInfo => setUsername(userInfo.username))
    }
    const handleUpdate = (item) => {
        setItemToUpdate(item);
        setUpdate(true);
    }
    const handleDelete = (id) => {
        fetch(`https://shop-jpeavler.herokuapp.com/api/inventory/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(res => {
            console.log("Result from fetch: ", res);
            let InvCopy = [...inventory];
            console.log("Before filter", InvCopy);
            console.log("result deleted item:", res.deletedItem);
            InvCopy = InvCopy.filter(item => item._id !== res.deletedItem._id);
            console.log("After filter", InvCopy);
            setInv(InvCopy);
            return InvCopy;
        })
    }
    const toggleActive = (id, isActive) => {
        const newActiveStatus = {isActive};
        fetch(`https://shop-jpeavler.herokuapp.com/api/inventory/${id}`, {
            method: 'PATCH',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(newActiveStatus)
        })
        .then(response => response.json())
        .then(res => {
            console.log("Is Active", res.modifiedItem.isActive);
            console.log("Item ID to change:", res.modifiedItem._id);
            let InvCopy = [...inventory];
            InvCopy.forEach(item => {
                if(item._id === res.modifiedItem._id) {
                    console.log(res.modifiedItem);
                    item.isActive = res.modifiedItem.isActive;
                }
            });
            console.log("InvCopy after attempt to update", InvCopy);
            setInv(InvCopy);
        })
    }
    const handleSort = (sortMethod) => {
        let sortedInv = Object.assign([], inventory);
        if(sortMethod === "quantity") {
            sortedInv.sort((a, b) => b.quantity - a.quantity);
        } else if(sortMethod === "price") {
            sortedInv.sort((a, b) => b.price - a.price);
        }
        setInv(sortedInv);
    }
    const displayInv = inventory.map((item) => {
        let activeButton = item.isActive ? 
            <Button color="warning" onClick={() => toggleActive(item._id, false)} block>Deactivate</Button>
            : <Button color="success" onClick={() => toggleActive(item._id, true)} block>Activate</Button>
        let deleteButton;
        if(!item.isActive) {
            deleteButton = <Button color="danger" onClick={() => handleDelete(item._id)} block>Delete</Button>      
        }
        if(item.seller === username) {
            if((item.isActive && displayActive) || (!item.isActive && displayInactive)) {
                return (
                    <Card key={item._id} className="item">
                        <CardHeader className="itemname">{item.name}</CardHeader>
                        <CardBody>
                            <p className="price">Price: ${item.price}</p>
                            <p className="quantity">Count: {item.quantity}</p>
                            <p className="description">{item.desc}</p>
                        </CardBody>
                        <CardFooter>
                            <Button color="primary" onClick={() => handleUpdate(item)} block>Edit</Button>
                            {activeButton}
                            {deleteButton}
                        </CardFooter>
                    </Card>
                )
            } else {return null;}
        }else {return null;}
    });
    const toggleModal = () => setFModal(!filterModal);
    let renderForm = isUpdate ? 
        <InventoryForm key={itemToUpdate._id} inventory={inventory} setInv={setInv} setUpdate={setUpdate} myItem={itemToUpdate} id={itemToUpdate._id}/>
        : <InventoryForm key="additem" inventory={inventory} setInv={setInv} setUpdate={setUpdate}/>
    let activeBtn = displayActive ? 
        <Button color="primary" key="hideAct" onClick={() => setActive(false)} block>Hide Active</Button>
        : <Button color="primary" key="showAct" onClick={() => setActive(true)} block>Show Active</Button>
    let inactiveBtn = displayInactive ? 
        <Button color="primary" key="hideIn" onClick={() => setInactive(false)} block>Hide Inactive</Button>
        : <Button color="primary" key="showIn" onClick={() => setInactive(true)} block>Show Inactive</Button>
    return (
        <div key="inventory" className="inventory">
            <h2>Your Inventory</h2>
            {renderForm}
            <Button color="primary" className="topbtn" onClick={() => toggleModal()}>Display Settings</Button>
            <Modal key="filter" isOpen={filterModal} toggle={toggleModal} className="modaltoggle">
                <ModalHeader>Sort and Hide Options</ModalHeader>
                <ModalBody>
                {activeBtn}
                {inactiveBtn}
                <Button color="primary" onClick={() => handleSort("quantity")} block>Sort by Count</Button>
                <Button color="primary" onClick={() => handleSort("price")} block>Sort by Price</Button>
                <Button color="secondary" onClick={() => toggleModal()} block>Close</Button>
                </ModalBody>
            </Modal>
            <CardDeck className="inventorydeck">{displayInv}</CardDeck>
        </div>
    )
}
export default InventoryDisplay;