import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div
            // onClick={onClose}
            onClick={(e) => {
                if (e.target.className === 'modal' || e.target.className === 'close') {
                  onClose();
                }
            }}
            className="modal"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgb(0,0,0)",
                background: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                // onclick={((e)=>{e.stopPropagation()})}
                className="modal-content"
                style={{
                    zIndex: "1",
                    width: "90%",
                    padding: "2%",
                    borderRadius: "10px",
                    boxShadow: "2px solid black",
                }}
            >
                <span className="close">&times;</span>
                {children}
            </div>
        </div>
    );
};

export default Modal;