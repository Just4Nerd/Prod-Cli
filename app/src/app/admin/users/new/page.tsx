'use client';
import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/navigation';
import NewUserForm from '@/components/NewUserForm';

// Page for the creation of a new user
export default function New(){
    const router = useRouter();
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
        setToken(token)
    }, [])

    return(
        <div className="d-inherit w-100 h-100 p-5">
            <div className=''>
                <button type="button" onClick={() => router.push('/admin/users')}className="btn btn-secondary">Back</button>
            </div>
            <div className="d-flex w-100 h-100 overflow-auto justify-content-center">
                {/* Render the New User Form component */}
                {/* Editing user ID is used to indicate if it is intended for editing or creation of new user */}
                {/* It is null when we are creating a new user */}
                { token &&
                    <NewUserForm editingUserId={null} token={token} useRouter={(e) => router.push(e)}/>
                }
            </div>
        </div>
    )

}