'use client';
import { useRef } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { APIDelUser } from '@/api/users';
import { APICreateUserProd, APIDelUserProd, APIUpdateUserProd } from '@/api/userProd';

type ViewUserBoxProps = {
    isParentUser: boolean;
    id: number;
    token: string;
    parentId: number;
    itemId: number;
    title: string;
    showDescription: boolean;
    showPrice: boolean;
    showFeatures: boolean;
    updateError: (string) => void;
    updateUserProd: (newId: number, parentId: number, itemId: number) => void;
    updateUserProdShow: (new_description: boolean, new_price: boolean, new_features: boolean, parentId: number, productionId: number) => void;
}; 

export default function ViewBox({ isParentUser, updateUserProdShow, updateUserProd, updateError, id, token, parentId, itemId, title, showDescription, showPrice, showFeatures }: ViewUserBoxProps){
    const router = useRouter();
    const [isDescriptionChecked, setDescription] = useState(false)
    const [isPriceChecked, setPrice] = useState(false)
    const [isFeaturesChecked, setFeatures] = useState(false)

    async function onSeeViewChange(){
        if (id == -1) {
            let res;
            // Create New User-Product entry
            if (isParentUser) {
                res = await APICreateUserProd(token, parentId, itemId, false, false, false)
            } else {
                res = await APICreateUserProd(token, itemId, parentId, false, false, false)
            }
            if (res.ok) {
                let data = await res.json()
                let newId = data.id
                updateUserProd(newId, parentId, itemId)
            } else {
                updateError('Error: something went wrong')
            }
        } else {
            let res = await APIDelUserProd(token, id)
            if (res.ok) {
                updateUserProd(-1, parentId, itemId)
                updateUserProdShow(false, false, false, parentId, itemId)
            } else {
                updateError('Error: something went wrong')
            }
        }
    }

    async function onShowChange(type){
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
            updateUserProdShow(tempDescription, tempPrice, tempFeatures, parentId, itemId)
        } else {
            updateError('Error: something went wrong')
        }
    }

    return(
        <div className="box-item card my-2">
            <div className="card-body">
                <div className="box-field d-flex box-name" onClick={(e) => router.push('/admin/users/' + id)}>
                    <div className="field-left mr-3">
                        {isParentUser?
                            <h5>Product Name:</h5>
                            :
                            <h5>User Login:</h5>
                        }
                    </div>
                    <div className="field-right">
                        <h5>{title}</h5>
                    </div>
                </div>
                <hr/>
                <div className="box-field d-flex">
                    <div className="field-left mr-3">
                        {isParentUser?
                            <p>Product ID:</p>
                            :
                            <p>User ID:</p>
                        }
                    </div>
                    <div className="field-right">
                        <p>{itemId}</p>
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