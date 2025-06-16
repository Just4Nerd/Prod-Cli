'use client';
import { useState } from 'react';
import { APIUpdateCategory } from '@/api/categories';

type CategoryBoxProps = {
    id: number,
    name: string;
    layout: string;
    token: string;
    updateError: (string) => void
    updateCategory: (id: number, name: string, layout: string) => void;
}; 

// This component displays categories and edits them if edit button is pressed
export default function CategoryBox({ updateCategory, updateError, id, name, layout, token}: CategoryBoxProps){
    const [isEdit, setEdit] = useState(false) // Indicates if the category is being edited
    // Editing and previous values
    const [editName, setName] = useState(name)
    const [prevName, setPrevName] = useState(name)
    const [editLayout, setLayout] = useState(layout)
    const [prevLayout, setPrevLayout] = useState(layout)
    const validLayouts = ["Layout_A", "Layout_B", "Layout_C", "Layout_D", "Layout_E"] // valid layout options

    // Function that is called when edit submit is pressed
    async function onSubmit() {
        if (prevName != editName || prevLayout != editLayout) {
            if (validLayouts.includes(editLayout)){
                if (editName != "") {
                    let res = await APIUpdateCategory(token, id, editName, editLayout)
                    if (res.ok) {
                        // If the API call was successful, update the parent object 
                        updateError('')
                        setEdit(false)
                        updateCategory(id, editName, editLayout)
                    } else {
                        let data = await res.json()
                        if (data.Error.code.includes("ER_DUP_ENTRY")) {
                            updateError('Error: Category Name already exists.')
                        } else {
                            updateError('Error: something went wrong')
                        }
                    }
                } else {
                    updateError('Error: Category Name cant be empty')
                }
            } else {
                updateError('Error: Invalid layout')
            }
            
        } else {
            updateError('Please make changes to a category')
        }
    }

    return(
        <div className="box-item card my-2">
            <div className="card-body">
                <div className="box-field d-flex box-name">
                    <div className="field-left mr-3">
                        <h5>Category Name:</h5>
                    </div>
                    <div className="field-right">
                        {/* Show input field if editing*/}
                        {!isEdit?
                            <h5>{name}</h5>
                            : 
                            <input onClick={() => updateError('')} onChange={(e) => setName(e.target.value)} value={editName} type="text" className="form-control" id="inputEmail3" placeholder="Enter Category Name"></input>
                        }
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
                        <p>Layout type:</p>
                    </div>
                    <div className="field-right">
                        {/* Show a select field if editing*/}
                        {!isEdit?
                            <p>{layout}</p>
                            :
                            <select value={editLayout} onClick={() => updateError('')} onChange={(e) => setLayout(e.target.value)} className="form-select" aria-label="Default select example">
                                {validLayouts.map((layout, idx) => (
                                    <option key={idx} value={layout}>{layout}</option>
                                ))
                            }
                            </select>
                        }
                    </div>
                </div>
                <hr/>
                <div>
                    {/* When not editing an edit button is present */}
                    {/* When edit is pressed, a submit and cancel buttons are shown */}
                    {/* On cancel, editing stops and values are discarded*/}
                    {!isEdit? 
                        <div className="col-sm">
                            <a href="#" className="btn btn-primary" onClick={() => {setEdit(true); updateError('')}}>Edit</a>
                        </div>
                        :
                        <div className="row">
                            <div className="row">
                                <div className="col-sm">
                                    <a href="#" onClick={onSubmit} className="btn btn-success" >Submit</a>
                                </div>
                                <div className="col-sm d-flex right-btn">
                                    <a href="#" className="btn btn-danger" onClick={() => {setEdit(false); updateError(''); setName(name); setLayout(layout)}}>Cancel</a>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}