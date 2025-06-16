'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { APICreateUserProd, APIDelUserProd, APIUpdateUserProd } from '@/api/userProd';

// As this component is called from both users and products parentId is user_id in users and product_id in products
// Similarly, itemId is the Id of a specific view. In /users it is product_id and in /products it is user_id
type ViewUserBoxProps = {
    isParentUser: boolean; // This is used to determine if the parent component is user or a product page
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

// This component is used in '/admin/users/:id' and '/admin/products/:id'
// To display user-product pairs that exist and dont yet exist for the broker to manage
export default function ViewBox({ isParentUser, updateUserProdShow, updateUserProd, updateError, id, token, parentId, itemId, title, showDescription, showPrice, showFeatures }: ViewUserBoxProps){
    const router = useRouter();

    // This function changes if the users sees the product at all or not. 
    // If the id was -1, change to the new id that gets returned from the server.
    // If it was not -1, delete the user-product pair and make it -1
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
                // When creating a new user-product entry, the visibilities are always false
                updateUserProdShow(false, false, false, parentId, itemId)
            } else {
                updateError('Error: something went wrong')
            }
        }
    }
    // This function changes the visibility of specific fields when pressed
    // As it is called when a checkbox is clicked, only 1 field changes at a time
    // However all the fields are still sent regardless
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
                    {/* Render description, price and feature visibility option only if client sees the product itself (id != -1) */}
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