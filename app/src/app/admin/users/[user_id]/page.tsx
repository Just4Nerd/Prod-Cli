'use client';
import { APIGetAllCategories } from '@/api/categories';
import { APIGetUser, APIGetUserProductView } from '@/api/users';
import NewProductForm from '@/components/NewProductForm';
import NewUserForm from '@/components/NewUserForm';
import UserBox from '@/components/UserBox';
import ViewBox from '@/components/ViewBox';
import ViewUserBox from '@/components/ViewBox';
import { jwtDecode } from 'jwt-decode';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Page to show and manage user-product logic
export default function ShowUser() {
    const params = useParams();
    // Get user ID from url
    const userId = Number(params.user_id);
    const router = useRouter();
    const [token, setToken] = useState('')
    const [userLogin, setUserLogin] = useState('')
    const [userRole, setUserRole] = useState('')
    const [userProductView, setView] = useState([]) // Object to store all user-prodcut entries
    const [error, setError] = useState(''); // Field to display error text if it contains any

    // Validate token and user role to be broker
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
        // Fetch User data and get all user-product entries
        setToken(token)
        getUserData(token)
        getUserProductView(token)
    }, [token])

    // Function that get all user-product views for specific user
    async function getUserProductView(token) {
        let res = await APIGetUserProductView(token, userId)
        if (res.ok) {
            let data = await res.json()
            // Set the object if successful
            setView(data.user_prod_view)

        } else {
            router.push('/admin/users')
        }
    }

    // Function to get all user data
    async function getUserData(token) {
        let res = await APIGetUser(token, userId)
        if (res.ok){
            let data = await res.json()
            data = data.user
            if (data.length > 0) {
                setUserLogin(data[0].login)
                setUserRole(data[0].role_name)
            } else {
                router.push('/admin/users')
            }

        } else {
            router.push('/admin/users')
        }
    }

    // Function to update the ID of a user-product entry. If it is -1, the user doesn't see the product. If it set to anything else, they see it.
    // This updates only the js object to dynamically render changes. If this is called, the change has already been applied on backend
    function updateViewId(newId, userId, productId) {
        setView(prev => prev.map(view =>
            view.user_id === userId && view.product_id === productId
                ? { ...view, id: newId }
                : view
            )
        );
    }

    // Function to update user-product entry with a specific id to show/dont show price, features or description
    // This updates only the js object to dynamically render changes. If this is called, the change has already been applied on backend
    function updateShows(new_description, new_price, new_features, userId, productId) {
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
                    <button type="button" className="btn btn-secondary " onClick={() => router.push('/admin/users')}>Back</button>
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
                                        <h5>Login:</h5>
                                    </div>
                                    <div className="field-right">
                                        <h5>{userLogin}</h5>
                                    </div>
                                </div>
                                <hr/>
                                <div className="box-field d-flex">
                                    <div className="field-left mr-3">
                                        <p>ID:</p>
                                    </div>
                                    <div className="field-right">
                                        <p>{userId}</p>
                                    </div>
                                </div>
                                <div className="box-field d-flex">
                                    <div className="field-left mr-3">
                                        <p>Role:</p>
                                    </div>
                                    <div className="field-right">
                                        <p>{userRole}</p>
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
                        {/* Render all products the user sees or doesn't for the broker to manage their visibility */}
                        {userProductView.map((view, idx) => ( 
                            <ViewBox isParentUser={true} updateUserProdShow={updateShows} updateUserProd={updateViewId} updateError = {setError}key={idx} id={view.id} token={token} parentId={view.user_id} itemId={view.product_id} title={view.product_name} showDescription={view.show_description} showPrice={view.show_price} showFeatures={view.show_features} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}