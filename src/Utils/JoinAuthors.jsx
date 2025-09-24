
export const joinAuthors = (authors) => {
    if (authors.length === 0) return "";
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return authors.join(" and ");
    return authors.slice(0, -1).join(", ") + ", and " + authors[authors.length - 1];
};