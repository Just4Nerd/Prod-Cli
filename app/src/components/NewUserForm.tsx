'use client';
import React, { useEffect, useRef, useState } from 'react';
import TiptapEditor from '@/components/TiptapEditor';
import { APICreateProduct, APIAddFeatures, APIGetProduct, APIGetFeatures, APIDelFeatures, APIUpdateProduct} from '@/api/products';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { APICreateUser } from '@/api/users';

type NewUserFormProps = {
    token: string;
    useRouter: (string) => void;
    editingUserId: number;
}; 


export default function NewUserForm({token, useRouter, editingUserId}: NewUserFormProps) {
    // Error is used to display an error field when it is not ''
    const [error, setError] = useState('');

    const [userLogin, setUserLogin] = useState('')
    const [userPassword, setUserPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');

    //states for previous product values
    const [prevLogin, setPrevLogin] = useState('');

    // let isEdit = false;

    useEffect(() =>{
        if (editingUserId != null) {
            // get User data if the form is used to edit a user
            // getUserData()
        }
    }, [])

    // async function getUserData() {
    //     let res = await APIGetUser(token, editingUserId)
    //     if (res.ok){
    //         let data = await res.json()
    //         data = data.product
    //         if (data.length > 0) {
    //             // Set values to an existing product values if we are editing a product
    //             // Set previous and current product name values

    //             getFeatures()
    //         } else {
    //             useRouter('/admin/products')
    //         }

    //     } else {
    //         useRouter('/admin/products')
    //     }
    // }

    //function to generate the login
    function generateLogin() {
        console.log(1)
        let result = ''
        const length = 8
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';

        // Loop to generate characters for the specified length
        for (let i = 0; i < length; i++) {
            const randomInd = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomInd);
        }
        setUserLogin(result)
    }
    
    //function to generate the password according to regex
    function generatePassword() {
        const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lower = "abcdefghijklmnopqrstuvwxyz";
        const digits = "0123456789";
        const special = "#?!@$%^&*-";
        const all = upper + lower + digits + special;

        const length = 8

        // Make sure at least one type of characters is present
        const passwordChars = [
            upper[Math.floor(Math.random() * upper.length)],
            lower[Math.floor(Math.random() * lower.length)],
            digits[Math.floor(Math.random() * digits.length)],
            special[Math.floor(Math.random() * special.length)],
        ];

        // Fill the rest of the password length with random characters
        while (passwordChars.length < length) {
            passwordChars.push(all[Math.floor(Math.random() * all.length)]);
        }

        // Shuffle the characters to make the password random
        for (let i = passwordChars.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
        }
        setUserPassword(passwordChars.join(''))
    }

    // function that handles submit when creating a new product
    async function handleNewSubmit(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()

        // validate form fields that would return error text if an error was present
        let err =  validateNewForm()
        if (err) {
            setError(err)
        } else{
            console.log("valid")
            let res = await APICreateUser(token, userLogin, userPassword)
            if (res.ok) {
                useRouter('/admin/users')
            } else {
                // setError('Error: something went wrong while creating new User.')
                let data = await res.json()
                if (data.error.sqlMessage.includes("sers.login_UNIQUE")) {
                    setError('Error: User Login already exists.')
                }
            }
        }
    }
    // function that handles submit when editing an existing product
    async function handleEditSubmit(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        let result = validateEditForm()

    }

    function validateEditForm() {
        let error = ""

       
        return error
    }

    function validateNewForm() {
        let error = ""

        
        const password_regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        if (!password_regex.test(userPassword) || userPassword == ""){
            error = "Failed to Submit: empty or invalid Password; Must contain: uppercase letter, lowercase letter, one digit, special character and be at least 8 characters long."
        }
        if (userLogin == ""){
            error = "Failed to Submit: empty Product Name"
        }

        return error
    }
    return (
        <form className="w-100 m-3">
            {error? 
                <div className="form-group row d-flex justify-content-center error-box bg-danger my-4">
                    {error}
                </div>
                :
                <div></div>
            }
            <div className="form-group row my-2">
                <label className="col-sm-2 col-form-label">User Login</label>
                <div className="col-sm-7">
                    <input onClick={() => setError('')} onChange={(e) => setUserLogin(e.target.value)} value={userLogin} type="text" className="form-control" id="inputEmail3" placeholder="User123"></input>
                </div>
                <div className="col col-form-label d-flex justify-content-center p-0">
                    <button type="button" className="btn btn-secondary" onClick={(e) => {generateLogin()}}>Generate Login</button>
                </div>
            </div>
            <div className="form-group row my-2">
                <label className="col-sm-2 col-form-label">User Password</label>
                <div onClick={() => setError('')} className="col-sm-7">
                    <input onClick={() => setError('')} onChange={(e) => setUserPassword(e.target.value)} value={userPassword} type="password" className="form-control" id="inputEmail3" placeholder="Enter User Password"></input>
                </div>
                <div className="col col-form-label d-flex justify-content-center p-0">
                    <button type="button" className="btn btn-secondary" onClick={(e) => {generatePassword()}}>Generate Password</button>
                </div>
            </div>
            <div className="form-group row">
                <button onClick={editingUserId? handleEditSubmit : handleNewSubmit} type="submit" className="w-25 btn btn-primary">Submit Changes</button>
            </div>
        </form>
    )
}