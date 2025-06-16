'use client';
import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/navigation';
import { APIGetClientProducts } from '@/api/client';
import ClientProductBox from '@/components/ClientProductBox';

// Home page where client sees all products visible to them
export default function Home(){
    const router = useRouter();
    const [products,  setProducts] = useState<any[]>([]); // object to store products
    const [token, setToken] = useState('')

    useEffect(() =>{
        // Check if localStorage has a valid client toke
        const token = localStorage.getItem('token');
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
            if (decoded['role'] != '1') {
                router.push('/');
                return;
            }
        } catch(error) {
            router.push('/');
        }

        // Fetch all products to display
        getProducts(token)
        setToken(token)
    }, [])

    // Function that gets all products available to user and sorts them based on ID
    async function getProducts(token){
        let res = await APIGetClientProducts(token)
        if (res.ok) {
            const data = await res.json(); 
            data.products.sort((a, b) => a.id - b.id);
            setProducts(data.products)
        } else {
            console.log(res)
        }
    }

    // Function that gets passed to children components that uses router to redirect to a clicked product
    function onBoxClick(id) {
        router.push('/home/'+id)
    }
        
    return(
        <div className="d-inline-block h-100 w-100">
            <button type="button" className="btn btn-warning logout-btn m-3" onClick={() => {localStorage.removeItem('token');router.push('/');}}>Logout</button>
            <div className="page-header d-flex justify-content-center w-100">
                <h1 className="page-title">Products</h1>
            </div>       
            <div className="page-content w-100 pt-5">
                <div className="container">
                    <div className="box-list">
                        {/* Each ClientProductBox is a component that renders one product in the list */}
                        {products.map((product, idx) => (
                            <ClientProductBox onBoxClick={onBoxClick} key={idx} id={product.id} token={token} name={product.name} category={product.category}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}