'use client';
import { useState, FormEvent } from 'react'
import {APILogin} from '@/api/auth'

// Props that get passed to this component
type LoginFormProps = {
  setError: (message: string) => void;
  goToPage: (page: string) => void
};

// Login component with Login form
export default function LoginForm({ goToPage, setError }: LoginFormProps){
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')

    // Function for User login when submit button is pressed
    async function Login(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        
        //verify if login and password are filled
        if (login && password) {
            let res = await APILogin(login, password)
            if (res.ok) {
                const data = await res.json();
                let role = data.role
                // Store returned token in localStorage for authentication
                localStorage.setItem('token', data['token']);
                // Redirect based on if the user was a client or a broker
                if (role == 1) {
                    goToPage('/home');
                } else {
                    goToPage('/admin');
                }

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
                <input type="login" value={login} onChange={(e) => setLogin(e.target.value)} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Login" onClick={()=>setError('')}></input>
            </div>
            <div className="form-group">
                <label className="pb-1">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" id="exampleInputPassword1" placeholder="Password" onClick={()=>setError('')}></input>
            </div>
            <button type="submit" className="btn btn-primary mt-2">Submit</button>
        </form>
    );
}