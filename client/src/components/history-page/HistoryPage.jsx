import React, {useState } from 'react'
import MainNav from '../main-nav/MainNav'
import {Row,Col,Button, message} from 'antd';
import '../history-page/HistoryPage.scss';

const HistoryOrder = ({ el }) => {
    const order = el.order;
    const order_items = el.order_items;
    return (
        <div className='history__item'>
            <div className='order__items'>
                {order_items && order_items.map((product, index)=>(
                    <HistoryOrderItems key={index} product={product}/>
                ))}
            </div>
            <div className='order__detail'>
                <h2>Total Price: {order.total_price.toFixed(2)}</h2>
                <p>Total Quantity: {order.total_quantity}</p>
            </div>

        </div>
    );
}
const HistoryOrderItems=({product})=>{
    return(
        <div className='order__item'>
            <img src={`https://goforetor.pagekite.me/img/products/${product.photo}`}></img>
            <div className='info'>
                <h2>{product.name}</h2>
                <h3>{product.price} $</h3>
                <p>{product.unique_code}</p>
            </div>
        </div>
    )
}
const HistoryPage =()=>{
    const [messageApi, contextHolder] = message.useMessage();
    const success = () => {
        messageApi.open({
          type: 'success',
          content: 'Successfully',
        });
    };
    const error = () => {
        messageApi.open({
          type: 'error',
          content: 'Orders not found',
        });
      };
    const[emailValue, setEmailValue] = useState('');
    const[phoneValue, setPhoneValue] = useState('');
    const[orders, setOrders] = useState([]);
    const getOrders=async()=>{
        try{
            const response = await fetch('https://goforetor.pagekite.me/getorders',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email:emailValue,
                    phone:phoneValue,
                }),
            });
            if(!response.ok){
                console.error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            if(data[0].found){
                setOrders(data.slice(1));
                success()
            }
            else{
                error()
            }

        }
        catch(err){
            console.error(err);
        }
    }
    return(
        <>
            {contextHolder}
            <MainNav/>
            <div style={{display:"flex", justifyContent:'center'}}>
                <h3>History</h3>
            </div>
            <Row>
                <Col span={24} className='history__form'>
                    <div className='history__form__wrapper'>
                        <div className="history__group">
                                <label htmlFor="email">email:</label>
                                <input
                                type="email" 
                                id="email" 
                                name="email"
                                value={emailValue} 
                                onChange={(e)=>(setEmailValue(e.target.value))}
                                placeholder="Enter your email" 
                                required></input>
                        </div>
                        <div className="history__group">
                                <label htmlFor="phone">phone:</label>
                                <input
                                type="number" 
                                id="phone" 
                                name="phone" 
                                value={phoneValue}
                                onChange={(e)=>(setPhoneValue(e.target.value))}
                                placeholder="Enter your phone" 
                                required></input>
                        </div>
                        <div className="history__group">
                            <Button onClick={getOrders}>Find orders</Button>
                        </div>
                    </div>
                </Col>
                <Col span={24} className='history__section'>
                    <div className='history__wrapper'>
                        {orders && orders.map((el, index) => (
                            <HistoryOrder key={index} el={el} />
                        ))}
                    </div>
                </Col>
            </Row>
        </>
    )
}

export default HistoryPage;