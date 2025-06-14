'use client';
import { useRef } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { APIDelUser } from '@/api/users';
import { APICreateUserProd, APIDelUserProd, APIUpdateUserProd } from '@/api/userProd';

type ViewUserBoxProps = {
    id: number;
    token: string;
    userId: number;
    productId: number;
    productName: string;
    showDescription: boolean;
    showPrice: boolean;
    showFeatures: boolean;
    updateError: (string) => void;
    updateUserProd: (newId: number, userId: number, productId: number) => void;
    updateUserProdShow: (new_description: boolean, new_price: boolean, new_features: boolean, userId: number, productionId: number) => void;
}; 

export default function ViewUserBox({ updateUserProdShow, updateUserProd, updateError, id, token, userId, productId, productName, showDescription, showPrice, showFeatures }: ViewUserBoxProps){
    const router = useRouter();
    const [isDescriptionChecked, setDescription] = useState(false)
    const [isPriceChecked, setPrice] = useState(false)
    const [isFeaturesChecked, setFeatures] = useState(false)

    async function onSeeViewChange(){
        if (id == -1) {
            // Create New User-Product entry
            let res = await APICreateUserProd(token, userId, productId, false, false, false)
            if (res.ok) {
                let data = await res.json()
                let newId = data.id
                updateUserProd(newId, userId, productId)
            } else {
                updateError('Error: something went wrong')
            }
        } else {
            let res = await APIDelUserProd(token, id)
            if (res.ok) {
                updateUserProd(-1, userId, productId)
            } else {
                updateError('Error: something went wrong')
            }
        }
    }

    async function onShowChange(type){
        console.log(type)
        console.log(showDescription, showPrice, showFeatures)
        let tempDescription = Boolean(showDescription)
        let tempPrice = Boolean(showPrice)
        let tempFeatures = Boolean(showFeatures)

        if (type == 'description') {
            tempDescription = !tempDescription
        }
        if (type == 'price') {
            tempPrice = !tempPrice
        }
        if (type == 'features') {
            tempFeatures = !tempFeatures
        }
        
        let res = await APIUpdateUserProd(token, id, tempDescription, tempPrice, tempFeatures)
        if (res.ok) {
            updateUserProdShow(tempDescription, tempPrice, tempFeatures, userId, productId)
        } else {
            updateError('Error: something went wrong')
        }
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
                                    <input className="form-check-input" type="checkbox" onChange={() => onShowChange('description')} checked = {showDescription} value="1" id="flexCheckDisabled"></input>
                                    <label className="form-check-label">
                                        Show product description
                                    </label>
                                </div>
                            </div>
                            <div className="col-sm">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" onChange={() => onShowChange('price')} checked={showPrice} value="1" id="flexCheckDisabled"></input>
                                    <label className="form-check-label">
                                        Show product price
                                    </label>
                                </div>
                            </div>
                            <div className="col-sm">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" onChange={() => onShowChange('features')} checked={showFeatures} value="1" id="flexCheckDisabled"></input>
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