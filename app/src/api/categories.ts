//API calls for categories; Goes to /category

export async function APIGetAllCategories(token) {
    const res = await fetch('https://prod-cli.onrender.com/category/getAll', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', token: token }
    });

    return res;
}

export async function APIUpdateCategory(token, id, name, layout_type: string, ) {
    const res = await fetch(`https://prod-cli.onrender.com/category/${id}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', token: token },
        body: JSON.stringify({name, layout_type}),
    });

    return res;
}

export async function APICreateCategory(token, name, layout_type: string, ) {
    const res = await fetch(`https://prod-cli.onrender.com/category/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', token: token },
        body: JSON.stringify({name, layout_type}),
    });

    return res;
}