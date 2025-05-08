import { useEffect, useRef } from "react";

function Trial(){
  const iframeRef=useRef(null);
    const iframeSrc = iframeRef.current;
    console.log(iframeSrc);
    //console.log(iframeSrc);
    if(iframeSrc&& iframeSrc.contentWindow)
      iframeSrc.contentWindow.postMessage({ userName: "Rohan" },"http://localhost:3002" ); 

   
    return(
        <>

        <iframe
        ref={iframeRef}
        id="SHRMproIframe"
        src="http://localhost:3002/?baseURL=http://myapi.com&customerID=12345&UserName=JohnDoe"

      ></iframe>
        </>
    )
}
export default Trial