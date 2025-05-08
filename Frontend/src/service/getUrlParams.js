export function getUrlParams(){
    const url = new URL(window.location.href);
    const iframeSrc = url.pathname;
  
    
    const baseURLMatch = iframeSrc.match(/baseURL=([^&]+)/); 
    const customerIDMatch = iframeSrc.match(/customerID=([^&]+)/); 
    const userNameMatch = iframeSrc.match(/UserName=([^&]+)/); 
  
   
    return {
      baseURL: baseURLMatch ? (baseURLMatch[1]) : null,
      customerID: customerIDMatch ? (customerIDMatch[1]) : null,
      userName: userNameMatch ? (userNameMatch[1]) : null,
    };
}