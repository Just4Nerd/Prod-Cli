'use client';
import { useRouter } from 'next/navigation';
import { APIDelProduct } from '@/api/products';

type ProductBoxProps = {
    id: number,
    name: string;
    category: string;
    category_id: number;
    description: string;
    layout_type: string;
    price: string;
    token: string;
    deleteProduct: (number) => void;
}; 

// This component is used to show one product in /admin/products 
export default function ProductBox({ deleteProduct, token, id, name, category, description, layout_type, price}: ProductBoxProps){
    const router = useRouter();

    // Function that redirects to a specific product edit page when clicked
    function onEditClick(event: React.MouseEvent<HTMLAnchorElement>){
        event.preventDefault()
        router.push('/admin/products/' + id + '/edit');
    }

    // Function that makes a product delete call and removes the product from parent object on success
    async function onDelClick(event: React.MouseEvent<HTMLAnchorElement>, product_id: number) {
        event.preventDefault()
        let res = await APIDelProduct(token, product_id)

        if (res.ok) {
            deleteProduct(product_id)
        } else {
            console.log("error")
        }

    }

    return(
        <div className="box-item card my-2">
            <div className="card-body">
                <div className="box-field d-flex box-name" onClick={(e) => router.push('/admin/products/' + id)}>
                    <div className="field-left mr-3">
                        <h5>Name:</h5>
                    </div>
                    <div className="field-right">
                        <h5>{name}</h5>
                    </div>
                </div>
                <hr/>
                <div className="box-field d-flex">
                    <div className="field-left mr-3">
                        <p>ID:</p>
                    </div>
                    <div className="field-right">
                        <p>{id}</p>
                    </div>
                </div>
                <div className="box-field d-flex">
                    <div className="field-left mr-3">
                        <p>Category:</p>
                    </div>
                    <div className="field-right">
                        <p>{category}</p>
                    </div>
                </div>
                <div className="box-field d-flex">
                    <div className="field-left mr-3">
                        <p>Price:</p>
                    </div>
                    <div className="field-right">
                        <p>{price}</p>
                    </div>
                </div>
                <hr/>
                {/* Edit and Delete buttons */}
                <div>
                    <div className="row">
                        <div className="col-sm">
                            <a href="#" className="btn btn-primary" onClick={onEditClick}>Edit</a>
                        </div>
                        <div className="col-sm d-flex right-btn">
                            <a href="#" className="btn btn-danger" onClick={(e) => onDelClick(e, id)}>Delete</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}