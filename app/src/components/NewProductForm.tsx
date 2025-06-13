'use client';
import React, { useEffect, useRef, useState } from 'react';
import TiptapEditor from '@/components/TiptapEditor';
import { APICreateProduct, APIAddFeatures, APIGetProduct, APIGetFeatures, APIDelFeatures, APIUpdateProduct} from '@/api/products';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

type NewProductFormProps = {
    categories: any[];
    token: string;
    useRouter: (string) => void;
    editingProductId: number;
}; 


export default function NewProductForm({categories, token, useRouter, editingProductId}: NewProductFormProps) {
    // Error is used to display an error field when it is not ''
    const [error, setError] = useState('');

    const [productName, setProductName] = useState('')
    const [description, setDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [productPrice, setProductPrice] = useState('')

    const [features, setFeature] = useState<any[]>([]);

    //states for previous product values
    const [prevName, setPrevName] = useState('');
    const [prevDescription, setPrevDescription] = useState('');
    const [prevPrice, setPrevPrice] = useState('');
    const [prevCategory, setPrevCategory] = useState('');
    const [prevFeatures, setPrevFeatures] = useState<any[]>([]);
    // let isEdit = false;

    useEffect(() =>{
        if (editingProductId != null) {
            // isEdit = true;
            getProductData()
        }
    }, [])

    async function getProductData() {
        let res = await APIGetProduct(token, editingProductId)
        if (res.ok){
            let data = await res.json()
            data = data.product
            if (data.length > 0) {
                // Set values to an existing product values if we are editing a product
                // Set previous and current product name values
                setPrevName(data[0].product_name)
                setProductName(data[0].product_name)
                // Set previous and current product description values
                setPrevDescription(data[0].description)
                setDescription(data[0].description)
                // Set previous and current product category values
                setPrevCategory(data[0].category_id)
                setSelectedCategory(data[0].category_id)
                // Set previous and current product price values
                setPrevPrice(Number(data[0].price).toFixed(2))
                setProductPrice(Number(data[0].price).toFixed(2))

                getFeatures()
            } else {
                useRouter('/admin/products')
            }

        } else {
            useRouter('/admin/products')
        }
    }

    async function getFeatures() {
        let res = await APIGetFeatures(token, editingProductId)
        console.log(res)
        if (res.ok) {
            let feature_data = await res.json()
            feature_data = feature_data.features
            console.log(feature_data) 
            setFeature(feature_data)
            setPrevFeatures(feature_data)
        } else {
            console.log(res)
        }
    }
    
    // function that handles submit when creating a new product
    async function handleNewSubmit(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()

        // validate form fields that would return error text if an error was present
        let err =  validateNewForm()
        if (err) {
            setError(err)
        } else{
            let resProduct = await APICreateProduct(token, productName, description, Number(selectedCategory), Number(productPrice))
            if (resProduct.ok) {
                let data = await resProduct.json()
                let product_id = data.id
                if (features.length > 0){
                    let formattedFeatures = features.map(item => item.content);
                    let resFeatures = await APIAddFeatures(token, product_id, formattedFeatures)
                    if (resFeatures.ok) {
                        useRouter('/admin/products')
                    } else {
                        let err = await resProduct.json()
                        setError('Error: ' + err['Error'])
                    }
                } else {
                    useRouter('/admin/products')
                }
            } else{
                let err = await resProduct.json()
                setError('Error: ' + err['Error'])
            }
        }
    }
    // function that handles submit when editing an existing product
    async function handleEditSubmit(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        let result = validateEditForm()
        let error = result.error

        if (error) {
            setError(error)
        } else{

            let updateProductBody : Record<string, any> = {};

            if (result.name) updateProductBody.name = result.name
            if (result.price) updateProductBody.price = result.price
            if (result.description) updateProductBody.description = result.description
            if (result.category_id) updateProductBody.category_id = result.category_id
            console.log("body", updateProductBody)

            let updateSuccess = true;
            let deleteSuccess = true;
            let addSuccess = true;
            console.log("updateProductBody")
        if (updateProductBody && Object.keys(updateProductBody).length > 0) {
            console.log("updateProductBody", updateProductBody)
            let resUpdate = await APIUpdateProduct(token, editingProductId, updateProductBody)
            if (!resUpdate.ok) {
                updateSuccess = false
                setError("Error: something went wrong while updating Product")
            }
        }

            let toDelete = result.toDelete.map(feature => Number(feature.id))
            let newFeatures = result.newFeatures

            console.log("toDelete", toDelete);
            console.log("newFeatures", newFeatures)
            
            if (toDelete.length > 0) {
                console.log("doing delete")
                let resDel = await APIDelFeatures(token, toDelete)
                if (!resDel.ok) {
                    deleteSuccess = false
                    setError("Error: something went wrong while deleting Features")
                }
            }

            if (newFeatures.length > 0) {
                console.log("doing adding")
                let resAdd = await APIAddFeatures(token, editingProductId, newFeatures)
                if (!resAdd.ok) {
                    addSuccess = false
                    setError("Error: something went wrong while adding new Features")
                }
            }
            if (updateSuccess && deleteSuccess && addSuccess) {
                useRouter('/admin/products')
            }
        }

    }

    function validateEditForm() {
        let error = ""
        let updatedFields = 0
        let result: Record<string, any> = {};

        let tempPrevFeatures = prevFeatures.map(feature => feature.content)
        let tempFeatures = features.map(feature => feature.content)

        // This creates a list of features to be created 
        const prevCopy = [...tempPrevFeatures];
        const newFeatures = tempFeatures.filter(el => {
            const index = prevCopy.indexOf(el);
            if (index !== -1) {
                prevCopy.splice(index, 1); // Remove the first match
                return false; // Skip this element from result
            }
            return true; // Keep this element
        });
        // This creates a list of features to be deleted 
        const featuresCopy = [...features];
        const toDelete = prevFeatures.filter(el => {
            const index = featuresCopy.findIndex(f => f.content === el.content);
            if (index !== -1) {
                featuresCopy.splice(index, 1); // Remove one matched object
                return false; // Skip this element — matched
            } else {
                console.log("delete", el.id); // Log ID of the kept (unmatched) element
                return true; // Keep this element — not matched
            }
        });

        newFeatures.forEach((feature) => {
            if (!feature || feature == "<p></p>") {
                error = "Failed to Submit: empty Features"
            }
        })

        if (toDelete.length > 0 || newFeatures.length > 0) {
            updatedFields += 1
        }   

        let regExp = /^\d{0,9}(?:\.\d{1,2})?$/;
        if (!regExp.test(productPrice) || productPrice == ""){
            error = "Failed to Submit: empty or invalid Price"
        }

        if (productPrice != prevPrice) {
            if (!regExp.test(productPrice) || productPrice == ""){
                error = "Failed to Submit: empty or invalid Price"
            } else {
                result.price = productPrice
            }
            updatedFields += 1
        }

        if (selectedCategory != prevCategory) {
            updatedFields += 1
            if (selectedCategory == "" || selectedCategory == "<p></p>"){
                error = "Failed to Submit: empty Product Description"
            } else {
                result.category_id = selectedCategory
            }
        }

        if (description != prevDescription) {
            if (description == "" || description == "<p></p>"){
                error = "Failed to Submit: empty Product Description"
            } else {
                result.description = description
            }
            updatedFields += 1

        }

        if (productName != prevName) {
            updatedFields += 1
            if (productName == "") {
                error = "Failed to Submit: empty Product Name"
            } else {
                result.name = productName
            }
            updatedFields += 1
        }

        if (updatedFields == 0) {
            error = "Failed to Submit: please edit at least 1 field"
        }
        result.error = error
        result.toDelete = toDelete
        result.newFeatures = newFeatures
        return result
    }

    function validateNewForm() {
        let error = ""
        console.log(features)
        features.forEach((feature) => {
            if (feature.content == "" || feature.content == "<p></p>") {
                error = "Failed to Submit: empty Features"
            }
        })
        
        let regExp = /^\d{0,9}(?:\.\d{1,2})?$/;
        if (!regExp.test(productPrice) || productPrice == ""){
            error = "Failed to Submit: empty or invalid Price"
        }
        if (description == "" || description == "<p></p>"){
            error = "Failed to Submit: empty Product Description"
        }
        
        if (selectedCategory == ""){
            error = "Failed to Submit: Product Category not chosen"
        }
        
        if (productName == ""){
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
                <label className="col-sm-2 col-form-label">Product Name</label>
                <div className="col-sm-10">
                    <input onClick={() => setError('')} onChange={(e) => setProductName(e.target.value)} value={productName} type="text" className="form-control" id="inputEmail3" placeholder="Name"></input>
                </div>
            </div>
            <div className="form-group row my-2">
                <label className="col-sm-2 col-form-label">Product Category</label>
                <div className="col-sm-10">
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} onClick={() => setError('')} className="form-select" aria-label="Default select example">
                        <option value="">Select Category</option>
                        {categories.map((category, idx) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="form-group row my-2">
                <label className="col-sm-2 col-form-label">Description</label>
                <div onClick={() => setError('')} className="col-sm-10">
                    <TiptapEditor content={description} onChange={setDescription} />
                </div>
            </div>
            <div className="form-group row my-2">
                <label className="col-sm-2 col-form-label">Product Price</label>
                <div className="col-sm-10">
                    <input onClick={() => setError('')} type="number" onChange={(e) => setProductPrice(e.target.value)} value = {productPrice} className="form-control" id="inputEmail3" placeholder="Price"></input>
                </div>
            </div>
            <div className="form-group row my-2">
                <label className="col-sm-2 col-form-label">Features</label>
                <div className="col-sm-10">
                    <div className="page-header my-4 d-flex justify-content-center w-100">
                        <button type="button" className="btn btn-success" onClick={() => setFeature(prev => [...prev, {content: ""}])}>Add Feature</button>
                    </div>
                    <div>
                        {features.map((feature, idx) => (
                            <div className="row mb-3" key={idx}>
                                <div onClick={() => setError('')} className="col-10">
                                    <TiptapEditor content={feature.content} onChange={(newContent) => {
                                        setFeature(prev =>
                                            prev.map((f, i) => i === idx ? { ...f, content: newContent } : f)
                                        );
                                    }}/>
                                </div>
                                <div className="col">
                                    <button type="button" className="btn btn-outline-danger" onClick={() => { setFeature(prev => prev.filter((_, i) => i !== idx)); setError('')}}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="form-group row">
                <button onClick={editingProductId? handleEditSubmit : handleNewSubmit} type="submit" className="w-25 btn btn-primary">Submit Changes</button>
            </div>
        </form>
    )
}