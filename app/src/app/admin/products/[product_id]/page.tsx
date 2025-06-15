'use client';
import { APIGetAllCategories } from '@/api/categories';
import { APIGetProduct, APIGetProductUserView } from '@/api/products';
import { APIGetUser, APIGetUserProductView } from '@/api/users';
import NewProductForm from '@/components/NewProductForm';
import NewUserForm from '@/components/NewUserForm';
import UserBox from '@/components/UserBox';
import ViewBox from '@/components/ViewBox';
import ViewUserBox from '@/components/ViewBox';
import { jwtDecode } from 'jwt-decode';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProductView() {
    const params = useParams();
    const productId = Number(params.product_id);
    const router = useRouter();
    const [token, setToken] = useState('')
    const [productName, setName] = useState('')
    const [productDescription, setDescription] = useState('')
    const [productPrice, setPrice] = useState('')
    const [productCategory, setCategory] = useState('')
    const [productUserView, setView] = useState([])
    const [error, setError] = useState('');

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
        // Fetch all Categories
        setToken(token)
        getProductData(token)
        getProductUserView(token)
    }, [token])

    async function getProductUserView(token) {
        let res = await APIGetProductUserView(token, productId)
        if (res.ok) {
            let data = await res.json()
            setView(data.prod_user_view)
        } else {
            router.push('/admin/products')
        }
    }

    async function getProductData(token) {
        let res = await APIGetProduct(token, productId)
        if (res.ok){
            let data = await res.json()
            data = data.product
            if (data.length > 0) {
                // Set values to an existing product values if we are editing a product
                // Set previous and current product name values
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

    function updateViewId(newId, productId, userId) {
        setView(prev => prev.map(view =>
            view.user_id === userId && view.product_id === productId
                ? { ...view, id: newId }
                : view
            )
        );
    }

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
                        {productUserView.map((view, idx) => ( 
                            <ViewBox isParentUser={false} updateUserProdShow={updateShows} updateUserProd={updateViewId} updateError = {setError} key={idx} id={view.id} token={token} parentId={view.product_id} itemId={view.user_id} title={view.login} showDescription={view.show_description} showPrice={view.show_price} showFeatures={view.show_features} />
                        )) }
                    </div>
                </div>
            </div>
        </div>
    )
}