'use client';
import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/navigation';
import {APIGetAllProducts} from '@/api/products'
import ProductBox from '@/components/ProductBox'

export default function Admin(){
    const router = useRouter();
    const [products,  setProducts] = useState<any[]>([]);

    useEffect(() =>{
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
            return;
        }
        try {
            const decoded = jwtDecode(token);
            if (decoded['role'] != '2') {
                router.push('/');
                return;
            }
        } catch(error) {
            router.push('/');
        }

        // Fetch all Products
        getProducts(token)
    }, [])

    async function getProducts(token){
        let res = await APIGetAllProducts(token)
        if (res.ok) {
            const data = await res.json();
            setProducts(data.products)
        } else {
            console.log(res)
        }
    }

    function onAddNewClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        router.push('/admin/products/new');
    }
        
    return(
        <div className="d-inline-block h-100 w-100">
            <div className="page-header d-flex justify-content-center w-100">
                <h1 className="page-title">Products</h1>
            </div>
            <div className="page-header mt-4 d-flex justify-content-center w-100">
                <button type="button" className="btn btn-success add-new-btn" onClick={onAddNewClick}>Add New</button>
            </div>
            
            <div className="page-content w-100 pt-5">
                <div className="container">
                    <div className="box-list">
                        {products.map((product, idx) => (
                            <ProductBox id = {product.id} key={idx} category_id={product.category_id} name={product.product_name} description={product.description} price={product.price.toFixed(2)} category={product.category_name} layout_type={product.layout_type}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}