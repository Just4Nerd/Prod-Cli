export async function APIGetAllUsers(token) {
    const res = await fetch('http://localhost:8000/user/getAll', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', token: token }
    });

    return res;
}

export async function APIDelUser(token: string, user_id: number) {
    const res = await fetch(`http://localhost:8000/user/${user_id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', token: token},
    });
    return res;
}

export async function APICreateUser(token, login: string, password: string) {
    const res = await fetch(`http://localhost:8000/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', token: token },
        body: JSON.stringify({ login, password }),
    });

    return res;
}