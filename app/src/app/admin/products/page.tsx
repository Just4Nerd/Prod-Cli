'use client';
import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/navigation';
import {APIGetAllProducts} from '@/api/products'
import ProductBox from '@/components/ProductBox'

// This page is used to display all products for broker to see
export default function Products(){
    const router = useRouter();
    const [products,  setProducts] = useState<any[]>([]); //object that stores all product data
    const [token, setToken] = useState('')

    // Validate token and verify that the role is of broker
    useEffect(() =>{
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
            return;
        }
        try {
            const decoded = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
            if (decoded.exp && decoded.exp < currentTime) {
                localStorage.removeItem('token');
                router.push('/');
                return;
            }
            if (decoded['role'] != '2') {
                router.push('/');
                return;
            }
        } catch(error) {
            router.push('/');
        }

        // Fetch all products to display
        getProducts(token)
        setToken(token)
    }, [])

    //  Function that gets and sets all products. Additionally it sorts products based on their id
    async function getProducts(token){
        let res = await APIGetAllProducts(token)
        if (res.ok) {
            const data = await res.json(); 
            data.products.sort((a, b) => a.id - b.id);
            setProducts(data.products)
        } else {
            console.log(res)
        }
    }

    // Function that redirects to /admin/products/new when clicked
    function onAddNewClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        router.push('/admin/products/new');
    }

    // funnction that deletes the product from the state object when it got deleted on the server
    function deleteProduct(id) {
        setProducts(prev => prev.filter(product => product.id !== id));
    }
        
    return(
        <div className="d-inline-block h-100 w-100">
            <div className="page-header d-flex justify-content-center w-100">
                <div className="page-back-admin p-1">
                    <button type="button" className="btn btn-secondary " onClick={() => router.push('/admin')}>Back To Admin Panel</button>
                </div>
                <h1 className="page-title">Products</h1>
            </div>
            <div className="page-header mt-4 d-flex justify-content-center w-100">
                <button type="button" className="btn btn-success add-new-btn" onClick={onAddNewClick}>Add New</button>
            </div>
            
            <div className="page-content w-100 pt-5">
                <div className="container">
                    <div className="box-list">
                        {/* Render all products dynamicaly from products object */}
                        {products.map((product, idx) => (
                            <ProductBox deleteProduct={deleteProduct} token={token} id = {product.id} key={idx} category_id={product.category_id} name={product.product_name} description={product.description} price={product.price.toFixed(2)} category={product.category_name} layout_type={product.layout_type}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}