'use client';
import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/navigation';
import NavBox from '@/components/NavBox';

export default function Products(){
    const router = useRouter();
    const [role, setRole] = useState<string | null>(null);

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
    })

    function goToPage(event: React.MouseEvent<HTMLDivElement>, page: string) {
        router.push('/admin/'+page.toLowerCase())
    }
    return(
        <div className="container">
            <div className="row">
                <div className="col-sm">
                    <NavBox goToPage={goToPage} text="Products" description="Manage Products the Clients see. Add, Delete and Update products as well as manage product features. Manage what users see which products."/>
                </div>
                <div className="col-sm">
                    <NavBox goToPage={goToPage} text="Categories" description="Manage Product Categries. Add new or Delete existing Categories"/>
                </div>
                <div className="col-sm">
                    <NavBox goToPage={goToPage} text="Users" description="Manage Users. Create, Update or Delete existing Users. Manage which products each user sees."/>
                </div>
            </div>
        </div>
    )
}