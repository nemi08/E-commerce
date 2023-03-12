import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import Loader from '../../components/loader/Loader';
import { addToCart, removeFromCart } from '../../redux/cartSlice';
import { axiosClient } from '../../utils/axiosClient';
import './ProductDetails.scss'

function ProductDetails() {

  const params= useParams();
  const productKey= params.productId;
  const [product, setProduct]= useState(null);
  const dispatch= useDispatch();
  const cart= useSelector(state => state.cartReducer.cart);
  const quantity= cart.find(item => item.key=== params.productId)?.quantity || 0;
  

  async function fetchData(){
    const productResponse= await axiosClient.get(`/products?filters[key][$eq]=${productKey}&populate=*`)
    if(productResponse.data.data.length>0){
      setProduct(productResponse.data.data[0])
    }
  }

  useEffect(()=>{
    setProduct(null)
    fetchData();
    console.log(product);
    
  }, [params]);

  if(!product){
    return <Loader />
    }
  return (
    <div className='ProductDetails'>
      <div className="container">
        <div className="product-layout">
          <div className="product-img center">
              <img src={product?.attributes?.image.data.attributes.url} alt="" />
          </div>
          <div className="product-info">
            <h1 className="heading">
              {product?.attributes.title}
            </h1>
            <p className="price">
            ₹ {product?.attributes.price}
            </p>
            <p className="description">
              {product?.attributes.desc}
            </p>
            <div className="cart-options">
              <div className="quantity-selector">
                <span className="btn decrement" onClick={()=> dispatch(removeFromCart(product))}>-</span>
                <span className="quantity">{quantity}</span>
                <span className="btn increment" onClick={()=>dispatch(addToCart(product))}>+</span>
              </div>
              <button className='btn-primary add-to-cart' onClick={()=>dispatch(addToCart(product))}>Add to Cart</button>
            </div>
            <div className="return-policy">
              <ul>
                <li>This product is made to order and is typically printed in 3-6 working days. Your entire order will ship together</li>
                <li>Since the product is printed on demand especially for you, it is not eligible for cancellation and returns. Read out Return Policy </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails