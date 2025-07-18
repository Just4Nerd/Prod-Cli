'use client';

type ProductBoxProps = {
    onBoxClick: (number) => void;
    id: number;
    name: string;
    category: string;
    token: string;

}; 

// This is a component that visualizes each product for the client products overview.
export default function ClientProductBox({ onBoxClick, id, token, name, category}: ProductBoxProps){

    return(
        // When a product box is clicked, go to that components page, specified by /home/id
        <div onClick={() => onBoxClick(id)} className="box-item card my-2">
            <div className="card-body">
                <div className="box-field d-flex box-name">
                    <div className="field-left mr-3">
                        <h5>Product Name:</h5>
                    </div>
                    <div className="field-right">
                        <h5>{name}</h5>
                    </div>
                </div>
                <hr/>
                <div className="box-field d-flex">
                    <div className="field-left mr-3">
                        <p>Category:</p>
                    </div>
                    <div className="field-right">
                        <p>{category}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}