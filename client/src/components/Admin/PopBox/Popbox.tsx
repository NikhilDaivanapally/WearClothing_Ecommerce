import React from "react";

interface ChildComponentProps {
  isPopupOpen: boolean;
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>> | any;
  children:React.ReactNode
}

const Popbox: React.FC<ChildComponentProps> = ({
  isPopupOpen,
  setIsPopupOpen,
  children
}) => {
  return (
    <div
      className="parentContainer fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)]"
      onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const target = e.target as HTMLElement; // Cast target to HTMLElement
        if (target.classList.contains("parentContainer")) {
          setIsPopupOpen(!isPopupOpen);
        }
      }}
    >
      {children}
    </div>
  );
};

export default Popbox;
