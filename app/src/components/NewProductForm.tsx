'use client';
import React, { useRef, useState } from 'react';
import TiptapEditor from '@/components/TiptapEditor';
import { APICreateProduct, APIAddFeatures} from '@/api/products';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

type NewProductFormProps = {
    categories: any[];
    token: string;
    useRouter: (string) => void;
}; 


export default function NewProductForm({categories, token, useRouter}: NewProductFormProps) {
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [features, setFeature] = useState<any[]>([]);
    const featureListRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const categoryRef = useRef<HTMLSelectElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);

    async function onSubmit(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        let price = priceRef.current?.value
        let category = categoryRef.current?.value
        let name = nameRef.current?.value

        let err =  validateForm(name, category, price)
        if (err) {
            setError(err)
        } else{
            let resProduct = await APICreateProduct(token, name, description, Number(category), Number(price))
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

    function validateForm(name, category, price) {
        let error = ""
        console.log(features)
        features.forEach((feature) => {
            if (feature.content == "" || feature.content == "<p></p>") {
                error = "Failed to Submit: empty Features"
            }
        })
        
        let regExp = /^\d{0,9}(?:\.\d{1,2})?$/;
        if (!regExp.test(price) || price == ""){
            error = "Failed to Submit: empty or invalid Price"
        }
        if (description == ""){
            error = "Failed to Submit: empty Product Description"
        }
        
        if (category == ""){
            error = "Failed to Submit: Product Category not chosen"
        }
        
        if (name == ""){
            error = "Failed to Submit: empty Product Name"
        }

        return error
    }
    return (
        <form>
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
                    <input onClick={() => setError('')} type="text" ref={nameRef} className="form-control" id="inputEmail3" placeholder="Name"></input>
                </div>
            </div>
            <div className="form-group row my-2">
                <label className="col-sm-2 col-form-label">Product Category</label>
                <div className="col-sm-10">
                    <select onClick={() => setError('')} ref={categoryRef} defaultValue="" className="form-select" aria-label="Default select example">
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
                    <input onClick={() => setError('')} type="number" ref={priceRef} className="form-control" id="inputEmail3" placeholder="Price"></input>
                </div>
            </div>
            <div className="form-group row my-2">
                <label className="col-sm-2 col-form-label">Features</label>
                <div className="col-sm-10">
                    <div className="page-header my-4 d-flex justify-content-center w-100">
                        <button type="button" className="btn btn-success" onClick={() => setFeature(prev => [...prev, {content: ""}])}>Add Feature</button>
                    </div>
                    <div ref={featureListRef}>
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
                <button onClick={onSubmit} type="submit" className="w-25 btn btn-primary">Submit Changes</button>
            </div>
        </form>
    )
}