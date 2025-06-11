'use client';
import LoginForm from "@/components/LoginForm";
import RegistrationForm from "@/components/RegistrationForm"
import ShowError from '@/components/Error'
import { useEffect, useState } from 'react';

export default function Home(){
    const [link, setLink] = useState('Register')
    const [error, setError] = useState('')
    const [currentForm, setForm] = useState('Login')

    function onLinkClick(event: React.MouseEvent<HTMLAnchorElement>) {
        event.preventDefault()

        if (link == 'Register') {
            setForm(link)
            setLink('Login')
        } else {
            setForm(link)
            setLink('Register')
        }
    }

    return (
    <main className="w-100 h-100">
        {error ? <ShowError message={error}/> : <></>}
        <div className="form-signin w-100 m-auto">
            <div className="container mt-5">
                {currentForm === 'Login' ? <LoginForm setError={setError}/> : <RegistrationForm setError={setError}/>}
                <div>
                    <a href="#" onClick={(e) => onLinkClick(e)}>{link}</a>
                </div>
            </div>
        </div>
    </main>
    );
}