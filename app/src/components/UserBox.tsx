'use client';
import { useRouter } from 'next/navigation';
import { APIDelUser } from '@/api/users';

type UserBoxProps = {
    id: number,
    login: string;
    token: string;
    role_name: string;
    role_id: number;
    deleteUser: (number) => void;
}; 

// This component renders the client information for /admin/users/
export default function UserBox({ deleteUser, token, id, login, role_name, role_id}: UserBoxProps){
    const router = useRouter();

    // When edit is clicked go to the edit page of that specific client
    function onEditClick(event: React.MouseEvent<HTMLAnchorElement>){
        event.preventDefault()
        router.push('/admin/users/' + id + '/edit');
    }

    // Function that executes when delete button is pressed. 
    // It sends an API call to delete the user and if successful modifies the users object of the parent 
    async function onDelClick(event: React.MouseEvent<HTMLAnchorElement>, user_id: number) {
        event.preventDefault()
        let res = await APIDelUser(token, user_id)

        if (res.ok) {
            deleteUser(user_id)
        } else {
            console.log("error")
        }

    }

    return(
        <div className="box-item card my-2">
            <div className="card-body">
                <div className="box-field d-flex box-name" onClick={(e) => router.push('/admin/users/' + id)}>
                    <div className="field-left mr-3">
                        <h5>Login:</h5>
                    </div>
                    <div className="field-right">
                        <h5>{login}</h5>
                    </div>
                </div>
                <hr/>
                <div className="box-field d-flex">
                    <div className="field-left mr-3">
                        <p>ID:</p>
                    </div>
                    <div className="field-right">
                        <p>{id}</p>
                    </div>
                </div>
                <div className="box-field d-flex">
                    <div className="field-left mr-3">
                        <p>Role:</p>
                    </div>
                    <div className="field-right">
                        <p>{role_name}</p>
                    </div>
                </div>
                <hr/>
                {/* Edit and Delete buttons */}
                <div>
                    <div className="row">
                        <div className="col-sm">
                            <a href="#" className="btn btn-primary" onClick={onEditClick}>Edit</a>
                        </div>
                        <div className="col-sm d-flex right-btn">
                            <a href="#" className="btn btn-danger" onClick={(e) => onDelClick(e, id)}>Delete</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}