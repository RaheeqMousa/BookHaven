import Style from './IntroSection.module.scss'
import UpsideImg from '../../assets/Images/upside.svg'
import SearchImg from '../../assets/Images/search.svg'

function IntroSection() {
    return (
        <section className={`${Style.hero}`}>
            <div className='container'>
                <div className={`row flex-direction-column ${Style['hero-row']}`}>
                    <h1>Discover Your Next <span>Great Read</span></h1>
                    <p className={Style.subtitle}>Explore millions of books across all genres. From bestsellers to hidden gems, find
                        your perfect story today.</p>
                    <div className={`row flex-direction-column ${Style['search-field']}`}>
                        <div className={`row ${Style['search-box']}`}>
                            <div className={Style['search-input']}>
                                <img src={SearchImg}  width={16} height={16}/>
                                <input type="text" placeholder="Search books..." />
                            </div>
                            
                            <button>Search</button>
                        </div>

                        <p className={Style.tips}>Search tips: Use quotes for exact phrases, + to include words, - to exclude words</p>

                    </div>

                    <div className={`row ${Style['tags-container']}`}>
                        <div className='row'>
                            <img src={UpsideImg} width={16} height={16} />
                            <p>Trending:</p>
                        </div>

                        <div className={`row ${Style['tags']}`}>
                            <div className={Style['tag']}>Fiction</div>
                            <div className={Style['tag']}>Mystery</div>
                            <div className={Style['tag']}>Romance</div>
                            <div className={Style['tag']}>Sci-Fi</div>
                            <div className={Style['tag']}>Biography</div>
                        </div>
                    </div>

                    <div className={`row ${Style.stats}`}>
                        <div className={`row flex-direction-column ${Style.stat}`}>
                            <h2>1M+</h2>
                            <p>Books Available</p>
                        </div>
                        <div className={`row flex-direction-column ${Style.stat}`}>
                            <h2>50K+</h2>
                            <p>Happy Readers</p>
                        </div>
                        <div className={`row flex-direction-column ${Style.stat}`}>
                            <h2>4.8★</h2>
                            <p>Average Rating</p>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );

}
export default IntroSection;