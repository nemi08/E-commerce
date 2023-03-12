import React, { useEffect, useState } from 'react'
import Product from '../../components/product/Product'
import {useNavigate, useParams} from "react-router-dom"
import './Collection.scss'
import { useSelector } from 'react-redux';
import { axiosClient } from '../../utils/axiosClient';
function Categories() {
  const params= useParams();
  const navigate= useNavigate();
  const [categoryId, setCategoryId]= useState('');
  const categories=useSelector(state => state.categoryReducer.categories)
  const [products, setProducts]=useState([]);

  const sortOtions=[{
    value:'Price- Low To High',
    sort:'price'
  },
  {
    value:'Newest First',
    sort:'createdAt'
  }]

  const [sortBy, setSortBy]= useState(sortOtions[0].sort)

  async function fetchProducts(){
    const url= params.categoryId ?
    `http://localhost:1337/api/products?populate=image&filters[category][key][$eq]=${params.categoryId}&sort=${sortBy}`:
    `http://localhost:1337/api/products?populate=image&sort=${sortBy}`
    const response= await axiosClient.get(url)
    setProducts(response.data.data);
  }

    useEffect(()=>{
        setCategoryId(params.categoryId);
        fetchProducts();
    }, [params, sortBy])

    function updateCategory(e){
      navigate(`/category/${e.target.value}`)
    }

    function handleSortChange(e){
      const sortKey=e.target.value;
      setSortBy(sortKey);
    }

  return (
    <div className='Categories'>
      <div className="container">
        <div className="header">
          <div className="info">
            <h2>Explore All Print and Artwork</h2>
            <p>India's largestcollection of wall posters for your bed.</p>
          </div>
          <div className="sort-by">
            <div className="sort-by-container">
              <h3 className="sort-by-text">Sort By</h3>
              <select className='select-sort-by' name="sort-by" id="sort-by" onChange={handleSortChange}>
              {sortOtions.map(item => <option key={item.sort} value={item.sort}>{item.value}</option>)}
              </select>
              </div>
          </div>
        </div>
        <div className="content">
          <div className="filter-box">
            <div className="category-filter">
              <h3>Category</h3>
              {categories?.map((item)=> (
                <div key={item.id} className="filter-radio">
                <input type="radio" name="category" value={item.attributes.key} id={item.id} checked={item.attributes.key===categoryId} onChange={updateCategory}/>
                <label htmlFor={item.id}>{item.attributes.title}</label>
              </div>
              ))}
              
            </div>
          </div>
          <div className="product-box">
          {products?.map(product => <Product key={product.id} product={product}/>)}
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default Categories