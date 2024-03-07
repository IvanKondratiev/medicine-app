import React,{useEffect, useState} from 'react'
import MainNav from '../main-nav/MainNav'
import {Row,Col,Button, message} from 'antd';
import '../cart-page/Cart.scss';

const ProductCartItem=({item, updateTotalPrice})=>{
    const[quantity, setQuanity]=useState(item.quantity);

    useEffect(()=>{
        setQuanity(item.quantity);
    },[item.quantity]);

    const minusProduct = (item) => {
        const productsInCart = JSON.parse(localStorage.getItem('cart_products')) || [];
        const existingProduct = productsInCart.find((el) => el.unique_code === item.unique_code);
      
        if (existingProduct && existingProduct.quantity > 1) {
          const updatedProduct = { ...existingProduct, quantity: existingProduct.quantity - 1 };
          const updatedCart = productsInCart.map((el) => (el.unique_code === item.unique_code ? updatedProduct : el));
          localStorage.setItem('cart_products', JSON.stringify(updatedCart));
          updateTotalPrice();
        }
      
        if (existingProduct.quantity <= 1) {
          let index = productsInCart.indexOf(existingProduct);
          const updatedCart = productsInCart.filter((_, i) => i !== index);
          localStorage.setItem('cart_products', JSON.stringify(updatedCart));
          updateTotalPrice();
        }
    };
    const plusProduct=(item)=>{
        const productsInCart = JSON.parse(localStorage.getItem('cart_products'))||[];
        const existingProduct = productsInCart.find((el)=>(el.unique_code === item.unique_code));
        if(existingProduct){
            existingProduct.quantity+=1;
            setQuanity(existingProduct.quantity);
        }
        localStorage.setItem('cart_products', JSON.stringify(productsInCart));
        updateTotalPrice();
    }
    return(
        <Row className='cart__item'>
            <Col xs={24} sm={12} md={12} lg={12} xl={12} style={{display:'flex', justifyContent:'center'}}>
                <img src={`http://localhost:0080/img/products/${item.photo}`}></img>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12} className='wrapper'>
                <div className='item__info'>
                    <h2>{item.name}</h2>
                    <h4>Price: {item.price} $</h4>
                    <p className='code'>Code: {item.unique_code}</p>
                    <div className='quantity__wrapper'>
                        <p className='quantity'>{quantity}</p>
                        <div className='quantity__control'>
                            <Button onClick={()=>(minusProduct(item))}>-</Button>
                            <Button onClick={()=>(plusProduct(item))}>+</Button>
                        </div>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

const Form=({formData, setFormData})=>{
    return(
        <>  
            <div className="form-container">
                <form>
                    <div className="form-group">
                        <label htmlFor="cart__name">Name:</label>
                        <input
                        type="text" 
                        id="cart__name" 
                        name="name" 
                        placeholder="Enter your name" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required></input>
                    </div>

                    <div className="form-group">
                        <label htmlFor="cart__email">Email:</label>
                        <input 
                        type="email" 
                        id="cart__email" 
                        name="email" 
                        placeholder="Enter your email" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required></input>
                    </div>

                    <div className="form-group">
                        <label htmlFor="cart__phone">Phone:</label>
                        <input 
                        type="tel" 
                        id="cart__phone" 
                        name="phone" 
                        placeholder="Enter your phone" 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required></input>
                    </div>

                    <div className="form-group">
                        <label htmlFor="cart__address">Address:</label>
                        <input 
                        type="text" 
                        id="cart__address" 
                        name="address" 
                        placeholder="Enter your address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required></input>
                    </div>
                </form>
            </div>

        </>
    )
}
export default function Cart() {
    const [messageApi, contextHolder] = message.useMessage();
    const success = () => {
        messageApi.open({
          type: 'success',
          content: 'Order placed successfully',
        });
    };
    const productsInCart = JSON.parse(localStorage.getItem('cart_products'))||[];
    const[totalPrice,setTotalPrice] = useState(0);
    const updateTotalPrice=()=>{
        const productsInCart = JSON.parse(localStorage.getItem('cart_products'))||[];
        let newTotalPrice = 0;
        productsInCart.forEach(element => {
            newTotalPrice += element.price * element.quantity;
        });
        setTotalPrice(newTotalPrice);
    }
    useEffect(()=>{
        updateTotalPrice();
    },[productsInCart])

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });
    const makeOrder=()=>{
        const productsInCart = JSON.parse(localStorage.getItem('cart_products'))||[];
        const fetchData=async()=>{
            try{
                const response = await fetch('http://localhost:0080/makeorder',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify([{
                        name:formData.name,
                        email:formData.email,
                        phone:formData.phone,
                        address:formData.address,
                    },
                    productsInCart]),
                });
                if(!response.ok){
                    console.error(`HTTP error! Status: ${response.status}`);
                }
                const isOrderDone = await response.json();
                if(isOrderDone){
                    setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        address: '',
                    });
                    localStorage.removeItem('cart_products');
                    updateTotalPrice();
                    success()
                }
            }
            catch(err){
                console.error(err);
            }
        }
        fetchData();
    }
  return (
    <>
        {contextHolder}
        <MainNav/>
        <Row justify='space-around' className='main__content'>
            <Col xs={24} sm={24} md={11} lg={11} xl={11} className='form'>
                <div style={{display:'flex',justifyContent:'center'}}>
                    <h2>Form</h2>
                </div>
                <Form formData={formData} setFormData={setFormData}/>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <div className='cart'>
                    <div style={{display:'flex',justifyContent:'center'}}>
                        <h2>Cart</h2>
                    </div>
                    {productsInCart.map((item,index)=>(
                        <ProductCartItem updateTotalPrice={updateTotalPrice} key={index} item={item}/>
                    ))}
                </div>
            </Col>
        </Row>
        <Row justify='center' className='wrapper__res'>
            <div className='cart__res'>
                <h2>Total Price: {totalPrice.toFixed(2)} $</h2>
                <Button onClick={makeOrder}>Buy Now</Button>
            </div>
        </Row>
    </>
  )
}
