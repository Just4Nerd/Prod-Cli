'use client';
import { useState, FormEvent } from 'react'
import {APILogin} from '@/api/auth'

type RegistrationFormProps = {
  setError: (message: string) => void;
};

export default function RegistrationForm({ setError }: RegistrationFormProps){
    async function Register(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        let login = event.target[0].value
        let password = event.target[1].value
        
        if (login && password) {
            let res = await APILogin(login, password)
            console.log(res)
        }
    }
    return (
        <form onSubmit={Register}>
            <div className="my-2">
                <h1>Register</h1>
            </div>
            <div className="form-group py-4">
                <label className="pb-1">Login</label>
                <input type="login" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Login"></input>
            </div>
            <div className="form-group">
                <label className="pb-1">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"></input>
            </div>
            <button type="submit" className="btn btn-primary mt-2">Submit</button>
        </form>
    );
}