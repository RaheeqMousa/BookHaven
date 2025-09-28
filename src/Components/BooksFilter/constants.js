export const filters = [
  {
    title: "Content Type",
    name: "printType",
    filterby: [
      { label: "All Types", value: "all" },
      { label: "Books Only", value: "books" },
      { label: "Magazines Only", value: "magazines" }
    ]
  },
  {
    title: "Availability",
    name: "filter",
    filterby: [
      { label: "All Books", value: null },
      { label: "Preview Available", value: "partial" },
      { label: "Full View Available", value: "full" },
      { label: "Free eBooks", value: "free-ebooks" },
      { label: "Paid eBooks", value: "paid-ebooks" },
      { label: "All eBooks", value: "ebooks" }
    ]
  },
  {
    title: "Categories",
    name: "subject",
    filterby: [
      "Fiction",
      "Mystery",
      "Romance",
      "Science Fiction",
      "Fantasy",
      "Biography",
      "History"
    ]
  },
  {
    title: "Language",
    name: "langRestrict",
    filterby: [
      { label: "Any Language", value: null },
      { label: "French", value: "fr" },
      { label: "Arabic", value: "ar" },
      { label: "English", value: "en" },
    ]
  },

];
