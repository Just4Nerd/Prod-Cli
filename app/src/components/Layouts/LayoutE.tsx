'use client';
import { useRef } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { APIDelProduct } from '@/api/products';

type LayoutAProps = {
    id: number,
    name: string;
    category: string;
    description: string;
    price: string;
    token: string;
    features: any[]
}; 

export default function LayoutE({ features, price, token, id, name, category, description}: LayoutAProps){

    return(
        <div className="box-item card my-2 bg-light">
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
                { description &&
                    <div>
                        <hr></hr>
                        <div className="box-field d-flex">
                            <div className="field-left mr-3">
                                <p>Description:</p>
                            </div>
                            <div className="field-right">
                                <div dangerouslySetInnerHTML={{ __html: description }} />
                            </div>
                        </div>
                    </div>
                }
                { price &&
                    <div>
                        <hr></hr>
                        <div className="box-field d-flex">
                            <div className="field-left mr-3">
                                <p>Price:</p>
                            </div>
                            <div className="field-right">
                                <p>{price}</p>
                            </div>
                        </div>
                    </div>
                }
                { features &&
                    <div>
                        <hr></hr>
                        <div className="box-field d-flex">
                            <div className="field-left mr-3">
                                <p>Features:</p>
                            </div>
                            <div className="field-right">
                                {features.map((feature, idx) => (
                                    <div key={idx}>
                                        <div dangerouslySetInnerHTML={{ __html: feature.content }} />
                                        <hr></hr>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}