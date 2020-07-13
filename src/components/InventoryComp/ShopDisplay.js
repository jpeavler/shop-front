import React, {useState, useEffect} from 'react';
import {Modal, ModalBody, ModalHeader, Button, CardDeck, Card, CardHeader, CardBody, CardFooter} from 'reactstrap';
import {isLoggedIn} from '../../config/auth';

const ShopDisplay = () => {
    if(!localStorage.getItem("Cart")){localStorage.setItem("Cart", "")}
    const [inventory, setInv] = useState([]);
    const [filterModal, setFModal] = useState(false);
    const [cart, setCart] = useState(localStorage.getItem("Cart"));

    useEffect(() => {
        getInv();
    }, []);
    const getInv = () => {
        fetch(`https://shop-jpeavler.herokuapp.com/api/inventory`)
            .then(response => response.json()).then(inv => setInv(inv))
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
    const handleCart = (id, added) => {
        let changedCart = cart;
        if(added) {
            changedCart = changedCart.concat(id, ",");
        } else {
            let cartArray = changedCart.split(',');
            cartArray = cartArray.filter((cartID) => id !== cartID);
            changedCart = "";
            cartArray.forEach((cartID) => {
                if(cartID !== ""){
                    changedCart = changedCart.concat(cartID, ",")
                }
            })
        }
        setCart(changedCart);
        localStorage.setItem('Cart', changedCart);
    }
    const displayInv = inventory.map((item) => {
        let addToCart;
        let removeFromCart;
        let cartArray = cart.split(','); 
        let inCart = false;
        cartArray.forEach((CartID) => {
            if(item._id === CartID) {
                inCart = true
            }
        });
        if(isLoggedIn()) {
            if(inCart) {
                removeFromCart = <Button color="primary" onClick={() => handleCart(item._id, false)} block>Remove From Cart</Button>
            } else {
                addToCart = <Button color="primary" onClick={() => handleCart(item._id, true)} block>Add To Cart</Button>
            }
        }
        if(item.isActive) {
            return (
                <Card key={item._id} className="item">
                    <CardHeader className="itemname">{item.name}</CardHeader>
                    <CardBody>
                        <p className="price">Price: ${item.price}</p>
                        <p className="quantity">Count: {item.quantity}</p>
                        <p className="description">{item.desc}</p>
                        <p className="Seller">Seller: {item.seller}</p>
                    </CardBody>
                    <CardFooter>
                        {addToCart}
                        {removeFromCart}
                    </CardFooter>
                </Card>
            )
        } else {return null;}
    });
    const toggleModal = () => setFModal(!filterModal);
    return (
        <div key="inventory" className="inventory">
            <h2>Marketplace</h2>
            <Button color="primary" className="topbtn" onClick={() => toggleModal()}>Display Settings</Button>
            <Modal key="filter" isOpen={filterModal} toggle={toggleModal} className="modaltoggle">
                <ModalHeader>Sort and Hide Options</ModalHeader>
                <ModalBody>
                    <Button color="primary" onClick={() => handleSort("quantity")} block>Sort by Count</Button>
                    <Button color="primary" onClick={() => handleSort("price")} block>Sort by Price</Button>
                    <Button color="secondary" onClick={() => toggleModal()} block>Close</Button>
                </ModalBody>
            </Modal>
            <CardDeck className="inventorydeck">{displayInv}</CardDeck>
        </div>
    )
}
export default ShopDisplay;