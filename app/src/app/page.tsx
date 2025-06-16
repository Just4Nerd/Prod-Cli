'use client';
import LoginForm from "@/components/LoginForm";
import RegistrationForm from "@/components/RegistrationForm"
import ShowError from '@/components/Error'
import { useState } from 'react';
import { useRouter } from "next/navigation";

// Page for Login and Registration forms
export default function Home(){
    const [link, setLink] = useState('Register')
    const [error, setError] = useState('') // Error variable - if it contains text the error text is shown
    const [currentForm, setForm] = useState('Login') // variable to determine if the page is Login or Registration
    const router = useRouter();

    // Function to switch between Login and Registration
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

    // Router function that gets passed to children components that redirects to specified page
    function goToPage(page: string) {
        router.push(page)
    }

    return (
    <main className="w-100 h-100">
        <div className="form-signin w-100 m-auto">
            <div className="container mt-5">
                {/* Error is shown here */}
                {error ? <ShowError message={error}/> : <></>}
                {/* Login/Registration components */}
                {currentForm === 'Login' ? <LoginForm goToPage={goToPage} setError={setError}/> : <RegistrationForm goToPage={goToPage} setError={setError}/>}
                <div>
                    <a href="#" onClick={(e) => onLinkClick(e)}>{link}</a>
                </div>
            </div>
        </div>
    </main>
    );
}