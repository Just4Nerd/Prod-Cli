'use client';
import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/navigation';

export default function Admin(){
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
            if (decoded['role'] != '2') {
                router.push('/');
                return;
            }
        } catch(error) {
            router.push('/');
        }

    })
    return(
        <h1>Admin</h1>
    )
}