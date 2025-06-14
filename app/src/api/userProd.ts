export async function APICreateUserProd(token: string, user_id: number, product_id: number, show_description: boolean, show_price: boolean, show_features: boolean) {
    const res = await fetch(`http://localhost:8000/userprod/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', token: token },
        body: JSON.stringify({ user_id, product_id, show_description, show_price, show_features}),
    });

    return res;
}

export async function APIDelUserProd(token: string, id: number) {
    const res = await fetch(`http://localhost:8000/userprod/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', token: token},
    });
    return res;
}

export async function APIUpdateUserProd(token: string, id: number, show_description: boolean, show_price: boolean, show_features: boolean) {

    const res = await fetch(`http://localhost:8000/userprod/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', token: token },
        body: JSON.stringify({show_description, show_price, show_features}),
    });

    return res;
}
