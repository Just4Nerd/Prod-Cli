'use client';
import { APIGetProduct, APIGetProductUserView } from '@/api/products';
import NewProductForm from '@/components/NewProductForm';
import NewUserForm from '@/components/NewUserForm';
import UserBox from '@/components/UserBox';
import ViewBox from '@/components/ViewBox';
import { jwtDecode } from 'jwt-decode';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// This page is used for broker to manage user-product entries for a specific product
export default function ProductView() {
    // Get product id from url
    const params = useParams();
    const productId = Number(params.product_id);
    const router = useRouter();
    const [token, setToken] = useState('')
    // States used for product information
    const [productName, setName] = useState('')
    const [productDescription, setDescription] = useState('')
    const [productPrice, setPrice] = useState('')
    const [productCategory, setCategory] = useState('')
    const [productUserView, setView] = useState([])
    const [error, setError] = useState(''); // State is used to display an error if it contains text

    // Validate token and verify if the role is broker
    useEffect(() =>{
        let token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
            return;
        }
        try {
            const decoded = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
            if (decoded.exp && decoded.exp < currentTime) {
                localStorage.removeItem('token');
                router.push('/');
                return;
            }
            if (decoded['role'] != '2') {
                router.push('/');
                return;
            }
        } catch(error) {
            router.push('/');
        }
        // Fetch Product data and all user-product entries.
        setToken(token)
        getProductData(token)
        getProductUserView(token)
    }, [token])

    // This function gets all user-product entries;
    // For users that currently see the product the id is set to >=0;
    // For users that don't see it the id is set to -1
    async function getProductUserView(token) {
        let res = await APIGetProductUserView(token, productId)
        if (res.ok) {
            let data = await res.json()
            setView(data.prod_user_view)
        } else {
            router.push('/admin/products')
        }
    }

    // This function gets currect product data
    async function getProductData(token) {
        let res = await APIGetProduct(token, productId)
        if (res.ok){
            let data = await res.json()
            data = data.product
            if (data.length > 0) {
                setName(data[0].product_name)
                setCategory(data[0].category_name)
                setDescription(data[0].description)
                setPrice(data[0].price)
            } else {
                router.push('/admin/products')
            }

        } else {
            router.push('/admin/products')
        }
    }
    // Function to update the ID of a user-product entry. If it is -1, the user doesn't see the product. If it set to anything else, they see it.
    // This updates only the js object to dynamically render changes. If this is called, the change has already been applied on backend
    function updateViewId(newId, productId, userId) {
        setView(prev => prev.map(view =>
            view.user_id === userId && view.product_id === productId
                ? { ...view, id: newId }
                : view
            )
        );
    }

    // Function to update user-product entry with a specific id to show/dont show price, features or description
    // This updates only the js object to dynamically render changes. If this is called, the change has already been applied on backend
    function updateShows(new_description, new_price, new_features, productId, userId) {
        setView(prev => prev.map(view =>
            view.user_id === userId && view.product_id === productId
                ? { ...view, show_description: new_description, show_price: new_price, show_features: new_features }
                : view
            )
        );
    }

    return(
        <div className="d-inline-block h-100 w-100">
            <div className="page-header d-flex justify-content-center w-100">
                <div className="page-back-admin p-1">
                    <button type="button" className="btn btn-secondary " onClick={() => router.push('/admin/products')}>Back</button>
                </div>
                <h1 className="page-title">Manage User Product View</h1>
            </div>
            
            <div className="page-content w-100 pt-5">
                <div className="container">
                    <div className="box-list">
                        <div className="box-item card my-2">
                            <div className="card-body">
                                <div className="box-field d-flex">
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
                                        <p>ID:</p>
                                    </div>
                                    <div className="field-right">
                                        <p>{productId}</p>
                                    </div>
                                </div>
                                <div className="box-field d-flex">
                                    <div className="field-left mr-3">
                                        <p>Category:</p>
                                    </div>
                                    <div className="field-right">
                                        <p>{productCategory}</p>
                                    </div>
                                </div>
                                <div className="box-field d-flex">
                                    <div className="field-left mr-3">
                                        <p>Product Description:</p>
                                    </div>
                                    <div className="field-right">
                                        <div dangerouslySetInnerHTML={{ __html: productDescription }} />
                                    </div>
                                </div>
                                <div className="box-field d-flex">
                                    <div className="field-left mr-3">
                                        <p>Price:</p>
                                    </div>
                                    <div className="field-right">
                                        <p>{productPrice}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr></hr>
            <div className="page-content w-100 pt-5">
                <div className="container">
                    <div className="box-list">
                        {error? 
                            <div className="form-group row d-flex justify-content-center error-box bg-danger my-4">
                                {error}
                            </div>
                            :
                            <div></div>
                        }
                        {/* Dynamically render user-product boxes. Here each box will be for a user. */}
                        {productUserView.map((view, idx) => ( 
                            <ViewBox isParentUser={false} updateUserProdShow={updateShows} updateUserProd={updateViewId} updateError = {setError} key={idx} id={view.id} token={token} parentId={view.product_id} itemId={view.user_id} title={view.login} showDescription={view.show_description} showPrice={view.show_price} showFeatures={view.show_features} />
                        )) }
                    </div>
                </div>
            </div>
        </div>
    )
}