'use client';
import { useEffect, useState } from 'react';
import { APIGetAllCategories } from '@/api/categories';
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/navigation';
import NewProductForm from '@/components/NewProductForm';

// This page is used to create a new product
export default function New(){
    const router = useRouter();
    const [categories,  setCategories] = useState<any[]>([]); // This object stores all categories
    const [token, setToken] = useState('')

    // Validate token and user role to be broker
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
        // Fetch all categories to be passed to child component
        getCategories(token)
        setToken(token)
    }, [])

    // This function is used to get all categories from the server
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
                {/* Render Product form with editing Product Id null to indicate that it is used to create a new product */}
                { token &&
                    <NewProductForm editingProductId={null} categories={categories} token={token} useRouter={(e) => router.push(e)}/>
                }
            </div>
        </div>
    )
}