'use client';
import { useRef } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { APIDelUser } from '@/api/users';

type ViewUserBoxProps = {
    id: number;
    token: string;
    userId: number;
    productId: number;
    productName: string;
    showDescription: boolean;
    showPrice: boolean;
    showFeatures: boolean;
}; 

export default function ViewUserBox({ id, token, userId, productId, productName, showDescription, showPrice, showFeatures }: ViewUserBoxProps){
    const router = useRouter();
    const [isDescriptionChecked, setDescription] = useState(false)
    const [isPriceChecked, setPrice] = useState(false)
    const [isFeaturesChecked, setFeatures] = useState(false)

    function onSeeViewChange(){
        console.log(id)
    }

    return(
        <div className="box-item card my-2">
            <div className="card-body">
                <div className="box-field d-flex box-name" onClick={(e) => router.push('/admin/users/' + id)}>
                    <div className="field-left mr-3">
                        <h5>Product Name:</h5>
                    </div>
                    <div className="field-right">
                        <h5>{productName}</h5>
                    </div>
                </div>
                <hr/>
                <div className="box-field d-flex">
                    <div className="field-left mr-3">
                        <p>Product ID:</p>
                    </div>
                    <div className="field-right">
                        <p>{productId}</p>
                    </div>
                </div>
                <hr></hr>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" checked={id != -1} value="1" id="flexCheckDisabled" onChange={onSeeViewChange}></input>
                                <label className="form-check-label">
                                    Does User See this Product?
                                </label>
                            </div>
                        </div>
                    </div>
                    { id != -1?
                    <div className="row">
                        <div className="col-sm">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" checked = {isDescriptionChecked} value="1" id="flexCheckDisabled"></input>
                                    <label className="form-check-label">
                                        Show product description
                                    </label>
                                </div>
                            </div>
                            <div className="col-sm">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" checked={isPriceChecked} value="1" id="flexCheckDisabled"></input>
                                    <label className="form-check-label">
                                        Show product price
                                    </label>
                                </div>
                            </div>
                            <div className="col-sm">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" checked={isFeaturesChecked} value="1" id="flexCheckDisabled"></input>
                                    <label className="form-check-label">
                                        Show product features
                                    </label>
                                </div>
                            </div>
                        </div>
                        :
                        <div></div>
                    }
                </div>
            </div>
        </div>
    )
}