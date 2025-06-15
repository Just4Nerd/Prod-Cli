export async function APIGetAllUsers(token : string) {
    const res = await fetch('http://localhost:8000/user/getAll', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', token: token }
    });

    return res;
}

export async function APIGetUser(token: string, user_id : number) {
    const res = await fetch(`http://localhost:8000/user/${user_id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', token: token }
    });

    return res;
}

export async function APIGetUserProductView(token: string, user_id : number) {
    const res = await fetch(`http://localhost:8000/user/${user_id}/productview`, {
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

export async function APICreateUser(token: string, login: string, password: string) {
    const res = await fetch(`http://localhost:8000/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', token: token },
        body: JSON.stringify({ login, password }),
    });

    return res;
}

export async function APIUpdateUser(token, user_id, body: Record<string, any>) {
    const res = await fetch(`http://localhost:8000/user/${user_id}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', token: token },
        body: JSON.stringify(body),
    });

    return res;
}

export async function APIVerifyBrokerCode(token: string, broker_code: string) {
    const res = await fetch(`http://localhost:8000/user/verifybroker`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', token: token },
        body: JSON.stringify({ broker_code }),
    });

    return res;
}
