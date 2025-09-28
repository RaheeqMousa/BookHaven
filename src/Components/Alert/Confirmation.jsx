import React, { useState, useEffect, useCallback } from "react";
import Style from './Alert.module.scss';
import PropTypes from 'prop-types';

function Confirmation({message,onClose }) {
  const [closing, setClosing] = useState(false);

  const handleClose = useCallback(
    (choice) =>{
      console.log("close");
      setClosing(true);
      setTimeout(() => {
        onClose(choice);
        setClosing(false);
      }, 300);
    },
    [onClose]
  );

  const handleCloseClick=useCallback((c)=>
    ()=>{
    handleClose(c);
  },[handleClose])

  const handleOverlayClick=useCallback((e)=>{
    if(e.target === e.currentTarget){
      handleClose(false);
    }
  },[handleClose])

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        handleClose(false);
      }
    };
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [handleClose]);

  return (
    <div
      className={`row justify-center ${Style.overlay}`}
      onClick={handleOverlayClick}
      role="presentation"
    >
    <div
      className={`${Style.modal}`}
      aria-label="Confirmation Modal" aria-describedby='confirmation-alert-message' role="dialog" aria-modal="true"
    >
      <button className={Style['close-btn']} onClick={()=>{ handleClose(false); }} aria-label="Close modal">
        X
      </button>

        <div className={`row ${Style['modal-content']} ${closing ? Style.hide : Style.show}`}  >            
            <p id="confirmation-alert-message">{message}</p>
            <div className={`row ${Style.actions}`}>
                <button className={Style['cancel']} onClick={handleCloseClick(false)}>
                Cancel
                </button>
                <button className={Style['confirm']} onClick={handleCloseClick(true)}>
                Confirm
                </button>
            </div>
        </div>
    </div>
    </div>
  );
}
Confirmation.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Confirmation;
