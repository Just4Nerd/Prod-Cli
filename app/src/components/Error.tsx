type ErrorProps = {
  message: string;
}; 

export default function ShowError({ message }: ErrorProps){

    return(
        <div className="bg-danger rounded">
            <h4 className="p-3">{message}</h4>
        </div>
    )
}