'use client';
import { APIGetAllCategories } from '@/api/categories';
import NewProductForm from '@/components/NewProductForm';
import { jwtDecode } from 'jwt-decode';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// This page is used for product edit
export default function EditProduct() {
    // Get product ID from the url
    const params = useParams();
    const productId = params.product_id;
    const router = useRouter();
    const [categories,  setCategories] = useState<any[]>([]); // Object to store all available categories
    const [token, setToken] = useState('')

    // Validate token and role to be broker
    useEffect(() =>{
        let token = localStorage.getItem('token');
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
        // Fetch all possible categories
        getCategories(token)
        setToken(token)
    }, [])

    // Function that gets the categories from the server
    async function getCategories(token){
        let res = await APIGetAllCategories(token)
        if (res.ok) {
            const data = await res.json();
            setCategories(data.categories)
        } else {
            console.log(res)
        }
    }

    return(
        <div className="d-inherit w-100 h-100 p-5">
            <div className=''>
                <button type="button" onClick={() => router.push('/admin/products')}className="btn btn-secondary">Back</button>
            </div>
            <div className="d-flex w-100 h-100 overflow-auto justify-content-center">
                {/* Render the prodcut form with editing product id set to the one in uel to indicate that it is editing */}
                { token &&
                    <NewProductForm editingProductId={Number(productId)} categories={categories} token={token} useRouter={(t) => router.push(t)}/>
                }
            </div>
        </div>
    )
}