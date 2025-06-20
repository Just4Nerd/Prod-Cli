//API calls for clients to get data they can see

export async function APIGetClientProducts(token) {
    const res = await fetch('https://prod-cli.onrender.com/client', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', token: token }
    });

    return res;
}

export async function APIGetClientProductData(token, product_id) {
    const res = await fetch(`https://prod-cli.onrender.com/client/${product_id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', token: token }
    });

    return res;
}