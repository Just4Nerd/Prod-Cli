// API calls to authenticate

//API call for Login
export async function APILogin(login: string, password: string) {
    const res = await fetch('http://localhost:8000/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
    });

    return res;
}

//API call for Registration
export async function APIRegister(login: string, password: string) {
    const res = await fetch('http://localhost:8000/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
    });

    return res;
}