import { useState, useEffect } from "react";

function getStoredHistory() {
  const searchedHistory = localStorage.getItem("searchHistory");
  try {
    const array = JSON.parse(searchedHistory);
    return Array.isArray(array) ? array : [];
  } catch {
    return [];
  }
}


const useSearchHistory = () => {
  const [history, setHistory] = useState(getStoredHistory);

  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(history));
  }, [history]);

  return [history, setHistory];
};

export default useSearchHistory;
