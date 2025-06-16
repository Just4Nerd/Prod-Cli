'use client';
import { APIGetAllCategories } from '@/api/categories';
import NewProductForm from '@/components/NewProductForm';
import NewUserForm from '@/components/NewUserForm';
import { jwtDecode } from 'jwt-decode';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditUser() {
    const params = useParams();
    const userId = params.user_id;
    const router = useRouter();
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
        setToken(token)
    }, [])

    return(
        <div className="d-inherit w-100 h-100 p-5">
            <div className=''>
                <button type="button" onClick={() => router.push('/admin/users')}className="btn btn-secondary">Back</button>
            </div>
            <div className="d-flex w-100 h-100 overflow-auto justify-content-center">
                { token &&
                    <NewUserForm editingUserId={Number(userId)} token={token} useRouter={(t) => router.push(t)}/>
                }
            </div>
        </div>
    )
}