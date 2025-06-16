'use client';
import React, { useEffect, useState } from 'react';
import TiptapEditor from '@/components/TiptapEditor';
import { APICreateProduct, APIAddFeatures, APIGetProduct, APIGetFeatures, APIDelFeatures, APIUpdateProduct} from '@/api/products';

type NewProductFormProps = {
    categories: any[];
    token: string;
    useRouter: (string) => void;
    editingProductId: number;
}; 

// This component is in '/admin/products/new' and '/admin/products/:id/edit'
// This component is used to render the form for creating new product and editing an existing product
// editingProductId is used to indicate which one it is; if it is null then it is a new user
export default function NewProductForm({categories, token, useRouter, editingProductId}: NewProductFormProps) {
    // Error is used to display an error field when it is not ''
    const [error, setError] = useState('');

    // States to track current entered information
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

    // Get product data only if editing prodcut id is provided and therefore it is used for edit
    useEffect(() =>{
        if (editingProductId != null) {
            // isEdit = true;
            getProductData()
        }
    }, [token])

    // Function that gets prodcut data and sets both previous and current prodcut field valies
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

                // Get features (only for edit)
                getFeatures()
            } else {
                useRouter('/admin/products')
            }

        } else {
            useRouter('/admin/products')
        }
    }

    // This function gets features
    async function getFeatures() {
        let res = await APIGetFeatures(token, editingProductId)
        if (res.ok) {
            let feature_data = await res.json()
            feature_data = feature_data.features
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
                    // The server call needs an array of strings
                    let formattedFeatures = features.map(item => item.content);
                    let resFeatures = await APIAddFeatures(token, product_id, formattedFeatures)
                    if (resFeatures.ok) {
                        // If the call was successful, go to products (only for creating new product)
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
        // This validates the edit form and returnds error if something was invalid and edited fields if forms are correct
        let result = validateEditForm()
        let error = result.error

        if (error) {
            setError(error)
        } else{
            // As only edited fields are returned, check if they exist and add them to be sent to the server
            let updateProductBody : Record<string, any> = {};

            if (result.name) updateProductBody.name = result.name
            if (result.price) updateProductBody.price = result.price
            if (result.description) updateProductBody.description = result.description
            if (result.category_id) updateProductBody.category_id = result.category_id

            let updateSuccess = true;
            let deleteSuccess = true;
            let addSuccess = true;

            if (updateProductBody && Object.keys(updateProductBody).length > 0) {
                let resUpdate = await APIUpdateProduct(token, editingProductId, updateProductBody)
                if (!resUpdate.ok) {
                    updateSuccess = false
                    setError("Error: something went wrong while updating Product")
                }
            }
            let toDelete = result.toDelete.map(feature => Number(feature.id))
            let newFeatures = result.newFeatures
            // If any features needs to be deleted, make the API call
            if (toDelete.length > 0) {
                let resDel = await APIDelFeatures(token, toDelete)
                if (!resDel.ok) {
                    deleteSuccess = false
                    setError("Error: something went wrong while deleting Features")
                }
            }

            // If any features needs to be added, make the API call
            if (newFeatures.length > 0) {
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

    // This function validates input when the component is used for editing
    // It adds only the edited fields to the result
    function validateEditForm() {
        let error = ""
        let updatedFields = 0
        let result: Record<string, any> = {};

        let tempPrevFeatures = prevFeatures.map(feature => feature.content)
        let tempFeatures = features.map(feature => feature.content)

        // The section bellow checks which features have been added and which features have been removed.
        // Then make 2 API calls with features to delete and to add

        // This creates a list of features to be created 
        const prevCopy = [...tempPrevFeatures];
        const newFeatures = tempFeatures.filter(el => {
            const index = prevCopy.indexOf(el);
            if (index !== -1) {
                prevCopy.splice(index, 1); // Remove the first match
                return false;
            }
            return true;
        });
        // This creates a list of features to be deleted 
        const featuresCopy = [...features];
        const toDelete = prevFeatures.filter(el => {
            const index = featuresCopy.findIndex(f => f.content === el.content);
            if (index !== -1) {
                featuresCopy.splice(index, 1); // Remove one matched object
                return false; 
            } else {
                return true;
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

        // Validate Price
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

        // Validate Category
        if (selectedCategory != prevCategory) {
            updatedFields += 1
            if (selectedCategory == "" || selectedCategory == "<p></p>"){
                error = "Failed to Submit: empty Product Description"
            } else {
                result.category_id = selectedCategory
            }
        }

        // Validate Description
        if (description != prevDescription) {
            if (description == "" || description == "<p></p>"){
                error = "Failed to Submit: empty Product Description"
            } else {
                result.description = description
            }
            updatedFields += 1

        }

        // Validate Name
        if (productName != prevName) {
            updatedFields += 1
            if (productName == "") {
                error = "Failed to Submit: empty Product Name"
            } else {
                result.name = productName
            }
            updatedFields += 1
        }
        // Check if any fields have been changed
        if (updatedFields == 0) {
            error = "Failed to Submit: please edit at least 1 field"
        }
        result.error = error
        result.toDelete = toDelete
        result.newFeatures = newFeatures
        return result
    }

    // This function is used to validate fields when used for creating a new product
    function validateNewForm() {
        // As only new features can be created, jsut check if any of them are empty
        let error = ""
        features.forEach((feature) => {
            if (feature.content == "" || feature.content == "<p></p>") {
                error = "Failed to Submit: empty Features"
            }
        })
        
        // Validate price
        let regExp = /^\d{0,9}(?:\.\d{1,2})?$/;
        if (!regExp.test(productPrice) || productPrice == ""){
            error = "Failed to Submit: empty or invalid Price"
        }

        // Validate Description 
        if (description == "" || description == "<p></p>"){
            error = "Failed to Submit: empty Product Description"
        }
        
        // Validate Category
        if (selectedCategory == ""){
            error = "Failed to Submit: Product Category not chosen"
        }
        
        // Validate Name
        if (productName == ""){
            error = "Failed to Submit: empty Product Name"
        }

        return error
    }
    return (
        <form className="w-100 m-3">
            {/* Show error if there is text */}
            {error? 
                <div className="form-group row d-flex justify-content-center error-box bg-danger my-4">
                    {error}
                </div>
                :
                <div></div>
            }
            {/* Product Name */}
            <div className="form-group row my-2">
                <label className="col-sm-2 col-form-label">Product Name</label>
                <div className="col-sm-10">
                    <input onClick={() => setError('')} onChange={(e) => setProductName(e.target.value)} value={productName} type="text" className="form-control" id="inputEmail3" placeholder="Name"></input>
                </div>
            </div>
            {/* Category */}
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
            {/* Description with a WYSIWYG component */}
            <div className="form-group row my-2">
                <label className="col-sm-2 col-form-label">Description</label>
                <div onClick={() => setError('')} className="col-sm-10">
                    <TiptapEditor content={description} onChange={setDescription} />
                </div>
            </div>
            {/* Product Price */}
            <div className="form-group row my-2">
                <label className="col-sm-2 col-form-label">Product Price</label>
                <div className="col-sm-10">
                    <input onClick={() => setError('')} type="number" onChange={(e) => setProductPrice(e.target.value)} value = {productPrice} className="form-control" id="inputEmail3" placeholder="Price"></input>
                </div>
            </div>
            {/* Features */}
            <div className="form-group row my-2">
                <label className="col-sm-2 col-form-label">Features</label>
                <div className="col-sm-10">
                    <div className="page-header my-4 d-flex justify-content-center w-100">
                        <button type="button" className="btn btn-success" onClick={() => setFeature(prev => [...prev, {content: ""}])}>Add Feature</button>
                    </div>
                    <div>
                        {/* Features are dynamically rendered from features state */}
                        {/* Each is a WYSIWYG component */}
                        {features.map((feature, idx) => (
                            <div className="row mb-3" key={idx}>
                                <div onClick={() => setError('')} className="col-10">
                                    <TiptapEditor content={feature.content} onChange={(newContent) => {
                                        setFeature(prev =>
                                            prev.map((f, i) => i === idx ? { ...f, content: newContent } : f)
                                        );
                                    }}/>
                                </div>
                                {/* button to delete a specific feature */}
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
            {/* Submit buttons that calls different functions based on if the form is used to create new or edit a product */}
            <div className="form-group row">
                <button onClick={editingProductId? handleEditSubmit : handleNewSubmit} type="submit" className="w-25 btn btn-primary">Submit Changes</button>
            </div>
        </form>
    )
}