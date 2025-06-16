'use client';
import { useState } from 'react';
import { APICreateCategory } from '@/api/categories';

type CategoryBoxProps = {
    token: string;
    updateError: (string) => void
    createCategory: (id: number, name: string, layout: string) => void;
    updateIsNew: (state) => void 
}; 

// This component is used to display the new category form
export default function NewCategory({ updateIsNew, createCategory, updateError, token}: CategoryBoxProps){
    const [name, setName] = useState('')
    const validLayouts = ["Layout_A", "Layout_B", "Layout_C", "Layout_D", "Layout_E"] // valid layout options
    const [layout, setLayout] = useState(validLayouts[0])

    // Function that is called when submitting the new category
    async function onSubmit() {
        if (validLayouts.includes(layout)){
            if (name != "") {
                let res = await APICreateCategory(token, name, layout)
                if (res.ok) {
                    updateError('')
                    let data = await res.json()
                    let newId = data.id
                    // Update the parent object with the new valies and stop rendering the create new category form
                    createCategory(newId, name, layout)
                    updateIsNew(false)
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
    }

    return(
        <div className="box-item card my-2">
            <div className="card-body">
                <div className="box-field d-flex box-name">
                    <div className="field-left mr-3">
                        <h5>New Category Name:</h5>
                    </div>
                    <div className="field-right">
                        <input onClick={() => updateError('')} onChange={(e) => setName(e.target.value)} value={name} type="text" className="form-control" id="inputEmail3" placeholder="Enter Category Name"></input>
                    </div>
                </div>
                <hr/>
                <div className="box-field d-flex">
                    <div className="field-left mr-3">
                        <p>Layout type:</p>
                    </div>
                    <div className="field-right">
                        {/* Render category select elements based on valid layouts object */}
                        <select value={layout} onClick={() => updateError('')} onChange={(e) => setLayout(e.target.value)} className="form-select" aria-label="Default select example">
                            {validLayouts.map((layout, idx) => (
                                <option key={idx} value={layout}>{layout}</option>
                            ))
                        }
                        </select>
                    </div>
                </div>
                <hr/>
                <div>
                    <div className="row">
                        <div className="row">
                            <div className="col-sm">
                                <a href="#" onClick={onSubmit} className="btn btn-success" >Submit</a>
                            </div>
                            <div className="col-sm d-flex right-btn">
                                <a href="#" className="btn btn-danger" onClick={() => {updateError(''); setName(name); setLayout(layout); updateIsNew(false)}}>Cancel</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}