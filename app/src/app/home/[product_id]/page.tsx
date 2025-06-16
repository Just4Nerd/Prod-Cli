'use client';
import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { useParams, useRouter } from 'next/navigation';
import { APIGetClientProductData } from '@/api/client';
import LayoutA from '@/components/Layouts/LayoutA';
import LayoutC from '@/components/Layouts/LayoutC';
import LayoutD from '@/components/Layouts/LayoutD';
import LayoutB from '@/components/Layouts/LayoutB';
import LayoutE from '@/components/Layouts/LayoutE';

export default function Admin(){
    const router = useRouter();
    const [token, setToken] = useState('')
    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState(undefined)
    const [price, setPrice] = useState(undefined)
    const [features, setFeatures] = useState(undefined)
    const [layout, setLayout] = useState('')
    const params = useParams();
    const productId = Number(params.product_id);
    const validLayouts = ["Layout_A", "Layout_B", "Layout_C", "Layout_D", "Layout_E"]

    useEffect(() =>{
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
            } else {

            }
        } catch(error) {
            router.push('/');
        }

        // Fetch all Products
        getProductData(token)
        setToken(token)
    }, [])

    async function getProductData(token){
        console.log(productId)
        let res = await APIGetClientProductData(token, productId)
        if (res.ok) {
            const data = await res.json(); 
            const product = data.products

            setName(product.name)
            setCategory(product.category)
            setLayout(product.layout)

            if (product.hasOwnProperty('features')) {
                setFeatures(product.features)
            }
            if (product.hasOwnProperty('description')) {
                setDescription(product.description)
            }
            if (product.hasOwnProperty('price')) {
                setPrice(product.price)
            }
        } else {
            console.log(res)
            router.push('/home')
        }
    }
        
    return(
        <div className="d-inline-block h-100 w-100">
            <div className="page-header d-flex justify-content-center w-100">
                <div className="page-back-admin p-1">
                    <button type="button" className="btn btn-secondary " onClick={() => router.push('/home')}>Back Home</button>
                </div>
                <h1 className="page-title">Product: </h1>
            </div>       
            <div className="page-content w-100 pt-5">
                <div className="container">
                    <div className="box-list">
                        { layout==validLayouts[0] &&
                            <LayoutA features={features} token={token} id={productId} name={name} category={category} price={price} description={description}/>
                        }
                        { layout==validLayouts[1] &&
                            <LayoutB features={features} token={token} id={productId} name={name} category={category} price={price} description={description}/>
                        }
                        { layout==validLayouts[2] &&
                            <LayoutC features={features} token={token} id={productId} name={name} category={category} price={price} description={description}/>
                        }
                        { layout==validLayouts[3] &&
                            <LayoutD features={features} token={token} id={productId} name={name} category={category} price={price} description={description}/>
                        }
                        { layout==validLayouts[4] &&
                            <LayoutE features={features} token={token} id={productId} name={name} category={category} price={price} description={description}/>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}