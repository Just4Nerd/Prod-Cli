'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { APIGetAllCategories } from '@/api/categories';
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/navigation';
import NewProductForm from '@/components/NewProductForm';

export default function New(){
    const searchParams = useSearchParams();
    const product_id = searchParams.get('id');
    var isEdit = false
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
        <div className="container">
            <NewProductForm categories={categories} token={token} useRouter={(t) => router.push(t)}/>
        </div>
    )

    async function getCategories(token){
        let res = await APIGetAllCategories(token)
        if (res.ok) {
            const data = await res.json();
            console.log(data.categories)
            setCategories(data.categories)
        } else {
            console.log(res)
        }
    }
}