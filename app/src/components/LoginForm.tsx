'use client';
import { useState, FormEvent } from 'react'
import {APILogin} from '@/api/auth'
import { useRouter } from 'next/navigation';

type LoginFormProps = {
  setError: (message: string) => void;
};

export default function LoginForm({ setError }: LoginFormProps){
    const router = useRouter();
    async function Login(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        let login = event.target[0].value
        let password = event.target[1].value
        
        if (login && password) {
            let res = await APILogin(login, password)
            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('token', data['token']);
                router.push('/admin');
            } else {
                console.log(res)
                setError("Failed to Login");
            }
        }
    }
    return (
        <form onSubmit={Login}>
            <div className="my-2">
                <h1>Login</h1>
            </div>
            <div className="form-group py-4">
                <label className="pb-1">Login</label>
                <input type="login" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Login" onChange={() => setError('')}></input>
            </div>
            <div className="form-group">
                <label className="pb-1">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" onChange={() => setError('')}></input>
            </div>
            <button type="submit" className="btn btn-primary mt-2">Submit</button>
        </form>
    );
}