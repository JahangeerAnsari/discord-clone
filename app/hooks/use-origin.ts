
import { useEffect, useState } from "react"
  export const getOriginValue = () =>{
   // eslint-disable-next-line react-hooks/rules-of-hooks
   const [isMounted, setIsMounted] = useState(false);
   
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() =>{
  setIsMounted(true)
  },[])

  const origin  = typeof window !== 'undefined' && window.location.origin 
   ? window.location.origin : ''
   if(!isMounted){
    return ""
   }
  
   return origin;

  }