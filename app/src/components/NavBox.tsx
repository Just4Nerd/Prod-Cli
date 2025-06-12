type NavBoxProps = {
  text: string;
  description: string;
  goToPage: (event: React.MouseEvent<HTMLDivElement>, page: string) => void
}; 

export default function NavBox({ text, description, goToPage }: NavBoxProps){
    return(
        <div className="card my-2 pe-auto" onClick={(e) => goToPage(e, text)}>
            <div className="card-body">
                <h5 className="card-title">{text}</h5>
                <p className="card-text">{description}</p>
            </div>
        </div>
    )
}