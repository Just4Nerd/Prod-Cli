export async function APIGetAllCategories(token) {
    const res = await fetch('http://localhost:8000/category/getAll', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', token: token }
    });

    return res;
}
