"use client";
import { isAuthenticated, isVerified } from "~/utils/Auth";
import { useEffect } from "react";
import { redirect } from "next/navigation";


export default function isAuth(Component: any) {
  return function IsAuth(props: any) {
    const auth = isAuthenticated;
    const verified = isVerified;


    useEffect(() => {
      if (!auth && verified) {
        return redirect("/verify");
      }else if(!auth){
        return redirect("/login");
      }
    }, []);


    if (!auth) {
      return null;
    }

    return <Component {...props} />;
  };
}