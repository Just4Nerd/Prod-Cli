'use client';
import LoginForm from "@/components/LoginForm";
import RegistrationForm from "@/components/RegistrationForm"
import ShowError from '@/components/Error'
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

export default function Home(){
    const [link, setLink] = useState('Register')
    const [error, setError] = useState('')
    const [currentForm, setForm] = useState('Login')
    const router = useRouter();

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

    function goToPage(page: string) {
        router.push(page)
    }

    return (
    <main className="w-100 h-100">
        <div className="form-signin w-100 m-auto">
            <div className="container mt-5">
                {error ? <ShowError message={error}/> : <></>}
                {currentForm === 'Login' ? <LoginForm goToPage={goToPage} setError={setError}/> : <RegistrationForm goToPage={goToPage} setError={setError}/>}
                <div>
                    <a href="#" onClick={(e) => onLinkClick(e)}>{link}</a>
                </div>
            </div>
        </div>
    </main>
    );
}