'use client';
import { APIGetAllCategories } from '@/api/categories';
import CategoryBox from '@/components/CategoryBox';
import NewCategory from '@/components/NewCategory';
import NewProductForm from '@/components/NewProductForm';
import { jwtDecode } from 'jwt-decode';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Categories() {
    const router = useRouter();
    const [token, setToken] = useState('')
    const [categories,  setCategories] = useState([]);
    const [error, setError] = useState('')
    const [isNewCategory, setNewCategory] = useState(false)

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
        getCategories(token)
        setToken(token)
    }, [])

    function updateCategory(id, name, layout) {
        setCategories(prev => prev.map(category =>
            category.id === id
                ? { ...category, name: name, layout_type: layout }
                : category
            )
        );
    }

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
                        {error? 
                            <div className="form-group row d-flex justify-content-center error-box bg-danger my-4">
                                {error}
                            </div>
                            :
                            <div></div>
                        }
                        {isNewCategory?
                            <NewCategory updateIsNew={setNewCategory} createCategory={createCategory} token={token} updateError={setError}/>
                            :
                            <div></div>
                        }
                        {token &&
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