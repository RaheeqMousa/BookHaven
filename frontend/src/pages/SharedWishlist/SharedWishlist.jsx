
import BookCard from "../../Components/BookCard/BookCard";
import { useParams } from "react-router-dom";
import Style from './SharedWishlist.module.scss';
import Back from "../../Components/Back";
import { useEffect,useState, useCallback} from "react";
import api from "../../Utils/axios";

function SharedWishlist() {
    const [list,setList]= useState([]);

    const { token } = useParams();
    const fetchWishlist= useCallback(async () => {
        try {
            const res= await api.get("/favorites/get_favorites",{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setList(res.data.favorites)
        } catch (err) {
            console.log(err)
        }
    },[token])
    
    useEffect(()=>{
        fetchWishlist();
    },[fetchWishlist])

    return (
        <section className={`row justify-content-center flex-direction-column `}>
            <div className={`row justify-content-center ${Style['shared-books']} `}>
                <div className="width-100">
                    <Back className="align-self-start" />
                    <h1>Items shared by your friend</h1>
                </div>
                <div className={`row justify-content-center flex-direction-column ${Style.books}`}>
                    {list.map((book) =>
                        <BookCard book={book} key={book.id} isGridDisplay={false} showActions={false} />
                    )
                    }
                </div>
            </div>

        </section>
    );
}
export default SharedWishlist;