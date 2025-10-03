import Style from './BooksFilter.module.scss'
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { filters } from './constants';
import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

function BooksFilter(props) {
    const { filterChange, handleFilterChange,handleCategoryClick, setSelectedFilters, selectedFilters } = props;

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const API_KEY = import.meta.env.VITE_API_KEY;

    const [expandedCategories, setExpandedCategories] = useState({});
    const [expandFilters, setExpandFilters] = useState(true);

    const toggleCategory = (title) => {
        setExpandedCategories(cat => ({
            ...cat,
            [title]: !cat[title]
        }));
    };

    const clearAllFilters = useCallback(() => {
        const defaultFilters = {
            Categories: [],
            Language: "",
            'Price Range': { min: "", max: "" }
        };

        setSelectedFilters(defaultFilters);

        let apiUrl = `${BASE_URL}/books/v1/volumes?q=search+terms&maxResults=20&key=${API_KEY}`;
        if (filterChange) filterChange(0, apiUrl);
    }, [filterChange, API_KEY, BASE_URL, setSelectedFilters]);


    const toggleFilters = useCallback(() => {
        setExpandFilters(prev => !prev);
    }, []);

    return (
        <section className={`row flex-direction-column align-start ${Style.filter}`}>
            <div className={`row width-100`}>
                <div className={`row justify-content-center gap-2`} onClick={toggleFilters} >
                    {expandFilters ? (
                        <IoIosArrowDown size={16} color="#666666" />
                    ) : (
                        <IoIosArrowUp size={16} color="#666666" />
                    )}
                    <h3>Filters</h3>
                </div>
                <button className={Style['clear-all']} onClick={clearAllFilters}>
                    Clear All
                </button>
            </div>

            <section className={`row flex-direction-column align-start width-100 ${Style['sort-by']}`}>
                <h4>Sort By</h4>
                <select onChange={e => handleFilterChange('orderBy', e.target.value)()}>
                    <option value={'relevance'}>Most Relevant</option>
                    <option value={'newest'} >Newest</option>
                </select>
            </section>


            {expandFilters && filters.map((category, index) => (
                <section
                    key={`${category.title}-${index}`}
                    className={`row flex-direction-column align-start ${Style['filter-section']} width-100`}
                >
                    <div className="row width-100" onClick={() => toggleCategory(category.title)}>
                        <h4>{category.title}</h4>
                        {expandedCategories[category.title] ? (
                            <IoIosArrowDown size={16} color="#666666" />
                        ) : (
                            <IoIosArrowUp size={16} color="#666666" />
                        )}
                    </div>


                    {expandedCategories[category.title] && category.filterby && category.filterby.length > 0 && (
                        <>

                            {
                                (category.title === "Price Range") ? (
                                    <>
                                        {category.filterby.map((f) => (
                                            <div className={`row ${Style.price}`} key={`${category.title}-${f}`}>
                                                <label htmlFor={f}>{f}</label>
                                                <input min={0} type='number' name={f} value={selectedFilters["Price Range"][f] || ""} onChange={(e) => handleFilterChange(category.name, e.target.value, `${f}`)()} />
                                            </div>
                                        ))}
                                    </>
                                ) :

                                    (category.title === "Language") ? (
                                        <div className={`row align-start flex-direction-column ${Style.options}`}>
                                            <select
                                                name={category.title}
                                                onChange={(e) => handleFilterChange(category.name, e.target.value)()}
                                                value={selectedFilters[category.title] || ""}
                                            >
                                                {category.filterby.map((f, i) => (
                                                    <option key={i} value={typeof f === "object" ? f.value : f}>
                                                        {typeof f === "object" ? f.label : f}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    ) : (
                                        <div className={`row align-start flex-direction-column ${Style.options}`}>
                                            {category.title === "Categories" ? (
                                                category.filterby.map((f) => (
                                                    <label key={f} className="row">
                                                        <input
                                                            type="checkbox"
                                                            name={category.title}
                                                            onChange={() => handleCategoryClick(typeof f === "object" ? f.value : f)}
                checked={selectedFilters[category.title]?.includes(typeof f === "object" ? f.value : f) || false}
                                                        />
                                                        {typeof f === "object" ? f.label : f}
                                                    </label>
                                                ))
                                            ) : (
                                                category.filterby.map((f, index) => (
                                                    <label key={index} className="row">
                                                        <input
                                                            type="radio"
                                                            name={category.title}
                                                            onChange={handleFilterChange(category.name, typeof f === "object" ? f.value : f)}
                                                        />
                                                        {typeof f === "object" ? f.label : f}
                                                    </label>
                                                ))
                                            )}
                                        </div>
                                    )}
                        </>
                    )}
                </section>
            ))}


            <div className={`row flex-direction-column align-start ${Style['filter-section']} width-100`}>
                <section>
                    <h4>Active Filters</h4>
                    <ul>
                        {Object.entries(selectedFilters).map(([category, value], index) => {
                            if (!value || (Array.isArray(value) && value.length === 0)) return null;
                            if (category === "Price Range") {
                                const { min, max } = value;
                                if (!min && !max) return null;
                                return (
                                    <li key={`${category}-${index}`}>
                                        {category}: {min && `Min ${min}`} {max && `Max ${max}`}
                                    </li>
                                );
                            }

                            if (Array.isArray(value)) {
                                return (
                                    <li key={`${category}-${index}`}>
                                        {category}: {value.join(", ")}
                                    </li>
                                );
                            }

                            return (
                                <li key={`${category}-${index}`}>
                                    {category}: {value}
                                </li>
                            );
                        })}
                    </ul>


                </section>
            </div>

        </section>
    );

}

BooksFilter.propTypes = {
    filterChange: PropTypes.func.isRequired,
    handleFilterChange: PropTypes.func.isRequired,
    setSelectedFilters: PropTypes.func.isRequired,
    selectedFilters: PropTypes.object.isRequired
}

export default BooksFilter;