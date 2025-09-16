import Style from './BooksFilter.module.scss'
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { filters } from './constants';
import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

function BooksFilter(props) {
    const { filterChange } = props;

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const API_KEY = import.meta.env.VITE_API_KEY;

    const [selectedFilters, setSelectedFilters] = useState({
        Categories: [],
        Language: "",
        'Price Range': { min: "", max: "" }
    });
    const [expandedCategories, setExpandedCategories] = useState({});

    const toggleCategory = (title) => {
        setExpandedCategories(cat => ({
            ...cat,
            [title]: !cat[title]
        }));
    };

    const clearAllFilters =useCallback( () => {
        const defaultFilters = {
            Categories: [],
            Language: "",
            'Price Range': { min: "", max: "" }
        };
        
        setSelectedFilters(defaultFilters);

        let apiUrl = `${BASE_URL}/books/v1/volumes?q=search+terms&key=${API_KEY}`;
        if (filterChange) filterChange(apiUrl);
    },[filterChange, API_KEY, BASE_URL]);

    const handleFilterChange = useCallback((category, value,field) =>
        () => {
            setSelectedFilters((val) => {
                let newFilters;
                const current = val[category];
                if (Array.isArray(current)) {
                    if (current.includes(value)) {
                        newFilters = { ...val, [category]: current.filter(v => v !== value) };
                    } else {
                        newFilters = { ...val, [category]: [...current, value] };
                    }
                }else if (typeof current === "object" && current !== null) {
        newFilters = {
          ...val,
          [category]: { ...current, [field]: value },
        };

      } else {
                    newFilters = { ...val, [category]: value };
                }


                let apiUrl = `${BASE_URL}/books/v1/volumes?q=search+terms&key=${API_KEY}`;

                Object.entries(newFilters).forEach(([key, val]) => {
                    if (key === "Price Range") {
                        if (val.min) apiUrl += `&minPrice=${val.min}`;
                        if (val.max) apiUrl += `&maxPrice=${val.max}`;

                    } else if (Array.isArray(val)) {
                        val.forEach((v) => {
                            apiUrl += `&${key}=${encodeURIComponent(v)}`
                        });
                    } else if (val)
                        apiUrl += `&${key}=${val}`;
                });

                if (filterChange) filterChange(apiUrl);

                return newFilters;

            });


        }, [filterChange, BASE_URL, API_KEY]);


    return (
        <section className={`row flex-direction-column align-start ${Style.filter}`}>
            <div className={`row width-100`}>
                <h3>Filters</h3>
                <button className={Style['clear-all']} onClick={clearAllFilters}>Clear All</button>
            </div>

            <section className={`row flex-direction-column align-start width-100 ${Style['sort-by']}`}>
                <h4>Sort By</h4>
                <select onChange={e => handleFilterChange('orderBy', e.target.value)()}>
                    <option value={'relevance'}>Most Relevant</option>
                    <option value={'newest'} >Newest</option>
                </select>
            </section>


            {filters.map((category, index) => (
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
                                                <input min={0} type='number' name={f} value={selectedFilters["Price Range"][f] || ""} onChange={(e) => handleFilterChange(category.title, e.target.value, `${f}`)()} />
                                            </div>
                                        ))}
                                    </>
                                ) :

                                    (category.title === "Language") ? (
                                        <div className={`row align-start flex-direction-column ${Style.options}`}>
                                            <select
                                                name={category.title}
                                                onChange={(e) => handleFilterChange(category.title, e.target.value)()}
                                                value={selectedFilters[category.title] || ""}
                                            >
                                                {category.filterby.map((f) => (
                                                    <option key={f} value={f}>
                                                        {f}
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
                                                            onChange={handleFilterChange(category.title, f)}
                                                            checked={selectedFilters[category.title]?.includes(f) || false}
                                                        />
                                                        {f}
                                                    </label>
                                                ))
                                            ) : (
                                                category.filterby.map((f) => (
                                                    <label key={f} className="row">
                                                        <input
                                                            type="radio"
                                                            name={category.title}
                                                            onChange={handleFilterChange(category.title, f)}
                                                        // checked={selectedFilters[category.title] === f}
                                                        />
                                                        {f}
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

BooksFilter.PropTypes = {
    filterChange: PropTypes.func.isRequired
}

export default BooksFilter;