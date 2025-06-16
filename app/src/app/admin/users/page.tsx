'use client';
import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/navigation';
import {APIGetAllUsers} from '@/api/users'
import UserBox from '@/components/UserBox';

// Users page that is responsible for client management
export default function Users(){
    const router = useRouter();
    const [users,  setUsers] = useState<any[]>([]); // Object to dynamicaly store users
    const [token, setToken] = useState('')

    // Validate token so that only broker can access it
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

        // Fetch all clients
        getUsers(token)
        setToken(token)
    }, [])

    // Function that gets all clients in the beginning and sorts them by ID
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

    // Redirects to /admin/new when the add new user button is pressed
    function onAddNewClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        router.push('/admin/users/new');
    }

    // Function that modifies the user object to not contain the deleted user by ID
    function deleteUser(id) {
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
                        {/* Dynamically renders users. Each in a User box. */}
                        {users.map((user, idx) => (
                            <UserBox deleteUser={deleteUser} token={token} id = {user.id} key={idx} login={user.login} role_name={user.role_name} role_id={user.role_id}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}