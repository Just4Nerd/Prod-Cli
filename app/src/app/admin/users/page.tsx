'use client';
import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/navigation';
import {APIGetAllProducts} from '@/api/products'
import ProductBox from '@/components/ProductBox'
import {APIGetAllUsers} from '@/api/users'
import UserBox from '@/components/UserBox';

export default function Users(){
    const router = useRouter();
    const [users,  setUsers] = useState<any[]>([]);
    const [token, setToken] = useState('')

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

        // Fetch all Products
        getUsers(token)
        setToken(token)
    }, [])

    async function getUsers(token){
        let res = await APIGetAllUsers(token)
        if (res.ok) {
            const data = await res.json(); 
            data.users.sort((a, b) => a.id - b.id);
            setUsers(data.users)
        } else {
            console.log(res)
        }
    }

    function onAddNewClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        router.push('/admin/users/new');
    }

    function updateUser(id) {
        setUsers(prev => prev.filter(user => user.id !== id));
    }
        
    return(
        <div className="d-inline-block h-100 w-100">
            <div className="page-header d-flex justify-content-center w-100">
                <div className="page-back-admin p-1">
                    <button type="button" className="btn btn-secondary " onClick={() => router.push('/admin')}>Back To Admin Panel</button>
                </div>
                <h1 className="page-title">Users</h1>
            </div>
            <div className="page-header mt-4 d-flex justify-content-center w-100">
                <button type="button" className="btn btn-success add-new-btn" onClick={onAddNewClick}>Add New</button>
            </div>
            
            <div className="page-content w-100 pt-5">
                <div className="container">
                    <div className="box-list">
                        {users.map((user, idx) => (
                            <UserBox updateUsers={updateUser} token={token} id = {user.id} key={idx} login={user.login} role_name={user.role_name} role_id={user.role_id}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}