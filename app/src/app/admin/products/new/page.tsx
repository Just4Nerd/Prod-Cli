'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { APIGetAllCategories } from '@/api/categories';
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/navigation';
import NewProductForm from '@/components/NewProductForm';

export default function New(){
    const router = useRouter();
    const [categories,  setCategories] = useState<any[]>([]);
    const [token, setToken] = useState('')

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
                console.log('Token expired');
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
        // Fetch all Categories
        getCategories(token)
        setToken(token)
    }, [])

    return(
        <div className="d-inherit w-100 h-100 p-5">
            <div className=''>
                <button type="button" onClick={() => router.push('/admin/products')}className="btn btn-secondary">Back</button>
            </div>
            <div className="d-flex w-100 h-100 overflow-auto justify-content-center">
                { token &&
                    <NewProductForm editingProductId={null} categories={categories} token={token} useRouter={(e) => router.push(e)}/>
                }
            </div>
        </div>
    )

    async function getCategories(token){
        let res = await APIGetAllCategories(token)
        if (res.ok) {
            const data = await res.json();
            setCategories(data.categories)
        } else {
            console.log(res)
        }
    }
}