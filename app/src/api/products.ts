export async function APIGetAllProducts(token) {
    const res = await fetch('http://localhost:8000/product/getAll', {
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

export async function APIAddFeatures(token: string, product_id: number, features: string[]) {
    const res = await fetch(`http://localhost:8000/product/${product_id}/feature/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', token: token},
        body: JSON.stringify({ features}),
    });

    return res;
}