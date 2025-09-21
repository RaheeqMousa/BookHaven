export const getBookDetails = (book) => [
  { label: "Publisher", value: book.volumeInfo.publisher },
  { label: "Publication Date", value: book.volumeInfo.publishedDate || "Unknown" },
  { label: "Pages", value: book.volumeInfo.pageCount || "Unknown" },
  { label: "Language", value: book.volumeInfo.language || "Unknown" },
  { label: "Print Type", value: book.volumeInfo.printType || "None" },
  { label: "ISBN-13", value: book.volumeInfo.industryIdentifiers?.[0]?.identifier || "None" },
  { label: "ISBN-10", value: book.volumeInfo.industryIdentifiers?.[1]?.identifier || "None" },
  { label: "Maturity Rating", value: book.volumeInfo.maturityRating || "None" },
];
