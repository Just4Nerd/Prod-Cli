'use client';
import { useState, FormEvent, useEffect } from 'react'
import {APIRegister} from '@/api/auth'

// Props that get passed to this component
type RegistrationFormProps = {
  setError: (message: string) => void;
  goToPage: (page: string) => void
};

// Registration component with registration form
export default function RegistrationForm({ goToPage, setError }: RegistrationFormProps){
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')

    async function Register(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        // Regex checks for: uppercase letter, lowercase letter, one digit, special character and be at least 8 characters long.
        const password_regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        
        // Validate if fields are filled and password matches the regex
        if (login && password) {
            if (password_regex.test(password)) {
                let res = await APIRegister(login, password)
                if (res.ok) {
                    const data = await res.json();
                    // Store returned token in localStorage for authentication
                    localStorage.setItem('token', data['token']);
                    // Registered user is always a client and is redirected to /home
                    goToPage('/home')

                } else {
                    console.log(res)
                    const data = await res.json();
                    if (data.error.code == "ER_DUP_ENTRY") {
                        setError("Error: Login already exists");
                    } else {
                        setError("Error: something went wrong");
                    }
                }
            } else {
                setError("Failed to Submit: empty or invalid Password; Must contain: uppercase letter, lowercase letter, one digit, special character and be at least 8 characters long.");
            }
        }
    }
    return (
        <form>
            <div className="my-2">
                <h1>Register</h1>
            </div>
            <div className="form-group py-4">
                <label className="pb-1" >Login</label>
                <input type="login" value={login} onClick={()=>setError('')} onChange={(e) => setLogin(e.target.value)} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Login"></input>
            </div>
            <div className="form-group">
                <label className="pb-1">Password</label>
                <input type="password" value={password} onClick={()=>setError('')} onChange={(e) => setPassword(e.target.value)} className="form-control" id="exampleInputPassword1" placeholder="Password"></input>
            </div>
            <button onClick={Register} type="submit" className="btn btn-primary mt-2">Submit</button>
        </form>
    );
}