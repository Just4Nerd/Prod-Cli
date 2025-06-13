'use client';
import { useRef } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { APIDelUser } from '@/api/users';

type UserBoxProps = {
    id: number,
    login: string;
    token: string;
    role_name: string;
    role_id: number;
    updateUsers: (number) => void;
}; 

export default function NavBox({ updateUsers, token, id, login, role_name, role_id}: UserBoxProps){
    // const nameRef = useRef<HTMLInputElement>(null);
    // const categoryRef = useRef<HTMLInputElement>(null);
    // const descriptionRef = useRef<HTMLInputElement>(null);
    // const layout_typeRef = useRef<HTMLInputElement>(null);
    // const priceRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    function onEditClick(event: React.MouseEvent<HTMLAnchorElement>){
        event.preventDefault()
        router.push('/admin/users/' + id);
    }

    async function onDelClick(event: React.MouseEvent<HTMLAnchorElement>, user_id: number) {
        event.preventDefault()
        let res = await APIDelUser(token, user_id)

        if (res.ok) {
            updateUsers(user_id)
        } else {
            console.log("error")
        }

    }

    return(
        <div className="box-item card my-2">
            <div className="card-body">
                <div className="box-field d-flex">
                    <div className="field-left mr-3">
                        <h5>Login:</h5>
                    </div>
                    <div className="field-right">
                        <h5>{login}</h5>
                    </div>
                </div>
                <hr/>
                <div className="box-field d-flex">
                    <div className="field-left mr-3">
                        <p>ID:</p>
                    </div>
                    <div className="field-right">
                        <p>{id}</p>
                    </div>
                </div>
                <div className="box-field d-flex">
                    <div className="field-left mr-3">
                        <p>Role:</p>
                    </div>
                    <div className="field-right">
                        <p>{role_name}</p>
                    </div>
                </div>
                <hr/>
                <div>
                    <div className="row">
                        <div className="col-sm">
                            <a href="#" className="btn btn-primary" onClick={onEditClick}>Edit</a>
                        </div>
                        <div className="col-sm d-flex right-btn">
                            <a href="#" className="btn btn-danger" onClick={(e) => onDelClick(e, id)}>Delete</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}