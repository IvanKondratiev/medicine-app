import React, { useEffect, useState } from 'react';
import '../shopping-page/Products.scss';
import { Row, Col, Pagination, Button, message } from 'antd';

function ProductItem({ product, addToCart }) {
  return (
    <>
      <div className='product'>
        <img src={`http://localhost:0080/img/products/${product.photo}`} alt={product.name} />
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <h3>{product.price} $</h3><span> Code: {product.unique_code}</span>
        <Button onClick={() => (addToCart(product))}>Add to cart</Button>
      </div>
    </>
  );
}

function ShopItem({ shop, onToggleShop }) {
  const [shopActive, setShopActive] = useState(false);

  const handleToggleShop = () => {
    setShopActive((prev) => !prev);
    onToggleShop(shop.shop_id);
  };

  return (
    <li
      onClick={handleToggleShop}
      className={`shop__item ${shopActive ? 'active' : ''}`}
    >
      <p>{shop.shop_name}</p>
    </li>
  );
}

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1);
  const [messageApi, contextHolder] = message.useMessage();
  const [allProducts, setAllProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [selectedShops, setSelectedShops] = useState([]);

  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'Added successfully',
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = selectedShops.length
          ? `http://localhost:0080/getproducts?shopIds=${selectedShops.join(',')}`
          : 'http://localhost:0080/getproducts';

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }

        const data = await response.json();
        setAllProducts(data[0]);
      } catch (err) {
        console.error(`Can't fetch ${err}`);
      }
    };

    const fetchShops = async () => {
      try {
        const response = await fetch('http://localhost:0080/getshops');

        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }

        const data = await response.json();
        setShops(data[0]);
      } catch (err) {
        console.error(`Can't fetch ${err}`);
      }
    };

    fetchProducts();
    fetchShops();
  }, [selectedShops]);

  function addToCart(product) {
    const products_str = localStorage.getItem('cart_products');
    const products_arr = JSON.parse(products_str) || [];
    const existingProduct = products_arr.find((item) => (item.unique_code === product.unique_code));

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      products_arr.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart_products', JSON.stringify(products_arr));
    success();
  }

  const perPage = 10;
  const indexOfLastProduct = currentPage * perPage;
  const indexOfFirstProduct = indexOfLastProduct - perPage;
  const currentProducts = allProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalProducts = allProducts.length;

  function handleChangePage(page) {
    setCurrentPage(page);
  }

  const onToggleShop = (shopId) => {
    if (selectedShops.includes(shopId)) {
      setSelectedShops((prev) => prev.filter((id) => id !== shopId));
    } else {
      setSelectedShops((prev) => [...prev, shopId]);
    }
  };

  return (
    <>
      {contextHolder}
      <Row className='main__content' justify='center'>
        <Col xs={24} sm={8} md={8} lg={8} xl={5} className='shop__container'>
          <h2 className='list__tittle'>Shops:</h2>
          <ul className='shop__list'>
            {shops.map((shop) => (
              <ShopItem
                key={shop.shop_id}
                shop={shop}
                onToggleShop={onToggleShop}
              />
            ))}
          </ul>
        </Col>
        <Col xs={24} sm={16} md={16} lg={16} xl={19}>
          <div className='products'>
            {currentProducts.map((item, index) => (
              <ProductItem
                addToCart={addToCart}
                key={index}
                product={item}
              />
            ))}
          </div>
          <div className='pagination'>
            <Pagination onChange={handleChangePage} current={currentPage} total={totalProducts} />
          </div>
        </Col>
      </Row>
    </>
  );
}
