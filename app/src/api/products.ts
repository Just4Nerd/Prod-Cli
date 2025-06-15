export async function APIGetAllProducts(token) {
    const res = await fetch('http://localhost:8000/product/getAll', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', token: token }
    });

    return res;
}

export async function APIGetProduct(token, product_id) {
    const res = await fetch(`http://localhost:8000/product/${product_id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', token: token }
    });

    return res;
}


export async function APICreateProduct(token, name: string, description: string, category_id: number, price: number) {
    const res = await fetch(`http://localhost:8000/product/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', token: token },
        body: JSON.stringify({ name, description, category_id, price }),
    });

    return res;
}

export async function APIUpdateProduct(token, product_id, body: Record<string, any>) {

    const res = await fetch(`http://localhost:8000/product/${product_id}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', token: token },
        body: JSON.stringify(body),
    });

    return res;
}

export async function APIGetProductUserView(token: string, product_id : number) {
    const res = await fetch(`http://localhost:8000/product/${product_id}/productview`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', token: token }
    });

    return res;
}


export async function APIAddFeatures(token: string, product_id: number, features: string[]) {
    const res = await fetch(`http://localhost:8000/product/${product_id}/feature/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', token: token},
        body: JSON.stringify({ features}),
    });

    return res;
}

export async function APIGetFeatures(token: string, product_id: number) {
    const res = await fetch(`http://localhost:8000/product/${product_id}/features`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', token: token},
    });

    return res;
}

export async function APIDelFeatures(token: string, features: number[]) {
    const res = await fetch(`http://localhost:8000/product/features/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', token: token},
        body: JSON.stringify({ features}),
    });
    return res;
}

export async function APIDelProduct(token: string, product_id: number) {
    const res = await fetch(`http://localhost:8000/product/${product_id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', token: token},
    });
    return res;
}