import React from "react";
import "./Homepage.css"

const SkeletonCard = () => {
    console.log("am skeleton card and being called here")
  return (
    <>
    {/* //<div className="chat left align-items-start">   */}
    <div className="skeleton-line" style={{ width: "280px" }}></div>
    <div className="skeleton-line" style={{ width: "70%" }}></div>
    <div className="skeleton-line" style={{ width: "50%" }}></div> 
      
    {/* </div> */}
     
    </>
  );
};

export default SkeletonCard;