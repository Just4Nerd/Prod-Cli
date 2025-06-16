'use client';
import { APIGetAllCategories } from '@/api/categories';
import CategoryBox from '@/components/CategoryBox';
import NewCategory from '@/components/NewCategory';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// This page is used to display all categories and facilitate new category and edit category functionality
export default function Categories() {
    const router = useRouter();
    const [token, setToken] = useState('')
    const [categories,  setCategories] = useState([]); // Store all categories
    const [error, setError] = useState('') // This is used to display error text if it is present
    const [isNewCategory, setNewCategory] = useState(false) // This is used to indicate if add new has been pressed the form should be displayed

    // Verify token and role to be broker
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
        // Fetch all categories
        getCategories(token)
        setToken(token)
    }, [])

    // Function that is used to dynamically update the categories state after edit was successful
    function updateCategory(id, name, layout) {
        setCategories(prev => prev.map(category =>
            category.id === id
                ? { ...category, name: name, layout_type: layout }
                : category
            )
        );
    }

    // This function is used to create a new category in the state object when the API call was successful
    function createCategory(newId, newName, newLayout) {
        categories.push({id: newId, name: newName, layout_type: newLayout})
    }

    return(
        <div className="d-inline-block h-100 w-100">
            <div className="page-header d-flex justify-content-center w-100">
                <div className="page-back-admin p-1">
                    <button type="button" className="btn btn-secondary " onClick={() => router.push('/admin')}>Back To Admin Panel</button>
                </div>
                <h1 className="page-title">Categories</h1>
            </div>
            <div className="page-header mt-4 d-flex justify-content-center w-100">
                <button type="button" onClick={() => setNewCategory(true)}className="btn btn-success add-new-btn" >Add New</button>
            </div>
            
            <div className="page-content w-100 pt-5">
                <div className="container">
                    <div className="box-list">
                        {/* Field to dsiplay an error */}
                        {error? 
                            <div className="form-group row d-flex justify-content-center error-box bg-danger my-4">
                                {error}
                            </div>
                            :
                            <div></div>
                        }
                        {/* If the new category button was pressed display this form */}
                        {isNewCategory?
                            <NewCategory updateIsNew={setNewCategory} createCategory={createCategory} token={token} updateError={setError}/>
                            :
                            <div></div>
                        }
                        {token &&
                        // Create category boxes for each category in the state object
                            categories.map((category, idx) => (
                                <CategoryBox key={idx} updateCategory={updateCategory} updateError={setError} id={category.id} name={category.name} token={token} layout={category.layout_type}/>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )

    async function getCategories(token){
        let res = await APIGetAllCategories(token)
        if (res.ok) {
            const data = await res.json();
            setCategories(data.categories)
        } else {
            console.log(res)
        }
    }
}