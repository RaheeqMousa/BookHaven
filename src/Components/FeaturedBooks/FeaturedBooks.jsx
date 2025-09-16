import Style from './FeaturedBooks.module.scss';
import BooksFilter from '../BooksFilter/BooksFilter';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import BookList from '../BooksList/BooksList';

function FeatureBooks() {
    const [books,setBooks]=useState([]);

    const filterChange = useCallback((apiUrl) => {
        console.log(apiUrl);
        try{
            const res= axios.get(apiUrl);

            if(res.status === 200){
                setBooks(books);
            }

        }catch(e){
            console.log(e);
        }
    },[books])
 
    useEffect(()=>{
        filterChange();
    },[books,filterChange]);


    return (
        <div className={` container row flex-direction-column ${Style['feature-books-wrapper']}`}>
            <div className={`row flex-direction-column ${Style['section-intro']}`}>
                <h2>Featured Books</h2>
                <p>Discover popular and trending books from Google Books</p>
            </div>
            <section className={`${Style['featured-section']}`}>
                <BooksFilter filterChange={filterChange} />

                <BookList books={books} />
            </section>
        </div>
    );

}
export default FeatureBooks;