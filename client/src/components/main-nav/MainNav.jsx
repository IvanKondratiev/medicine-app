import React from 'react';
import '../main-nav/MainNav.scss'
import { Menu,Row,Col } from 'antd';
import { Link } from 'react-router-dom';
import logo from '../../img/logo.svg';

export default function MainNav() {
  return (
    <>
        <Row justify='center' className='main__nav'>
          <Col xs={7} sm={7} md={7} lg={7} xl={7}  className='section__nav'>
            <Menu mode="horizontal" className='menu' >  
              {/* overflowedIndicator = {<MenuOutlined />} */}
                  <Menu.Item key="shop">
                      <Link to="/">SHOP</Link>
                  </Menu.Item>
                  <Menu.Item key="Cart">
                      <Link to="/app/cart">CART</Link>
                  </Menu.Item>
                  <Menu.Item key="History">
                      <Link to="/app/history">HISTORY</Link>
                  </Menu.Item>
              </Menu>
          </Col>
          <Col span={10} className='section__logo'>
            <Link to={'/'}><img className='logo' alt='logo' src={logo}></img></Link>
          </Col>
          <Col span={7}></Col>
        </Row>
    </>
  )
}
