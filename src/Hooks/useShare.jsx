import { useState, useCallback } from "react";
import { joinAuthors } from "../Utils/JoinAuthors";

function useShare(shareTarget, URL=null) {
  const [shareBtnSuccess, setShareBtnSuccess] = useState("");
  const [disableShareBtn, setShareBtnDisable] = useState(false);

  const handleShare = useCallback(async () => {
    if (!shareTarget) return;

    let title, text, url;

    if (Array.isArray(shareTarget)) {
      title = "Book Wishlist Collection";
      text = shareTarget
        .map(
          (b, i) =>
            `${i + 1}. ${b.volumeInfo.title} by ${joinAuthors(
              b.volumeInfo.authors
            )}`
        )
        .join("\n");
      url = URL;
    } else {
      title = shareTarget.volumeInfo.title;
      text = `${shareTarget.volumeInfo.title} by ${joinAuthors(
        shareTarget.volumeInfo.authors
      )}`;
      url = shareTarget.volumeInfo.canonicalVolumeLink;
    }

    const shareData = { title, text, url };

    setShareBtnDisable(false);

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log("Shared successfully!");
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      setShareBtnSuccess("Link copied to clipboard!");
      setTimeout(() => {
        setShareBtnSuccess("");
        setShareBtnDisable(true);
      }, 1000);
    }
  }, [shareTarget,URL]);

  return [ shareBtnSuccess, disableShareBtn, handleShare ];
}


export default useShare;
