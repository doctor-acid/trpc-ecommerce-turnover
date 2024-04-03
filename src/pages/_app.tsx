import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import { useRouter } from 'next/router'

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getToken, setAuthUser, setToken } from "./local_data";
import { error } from "console";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false);
  // const [user, setUser] = useState({})

  let authCheck = api.auth.authenticateToken.useQuery(undefined, {
    retry : false
  });

  useEffect(()=>{
    if(authCheck.isFetched){
      try {
        if(authCheck.isSuccess){
          setLoggedIn(true);
          setAuthUser(authCheck.data.user)
          if(authCheck.data.redirect==='/verify') router.push('/verify')
          else if(router.pathname!=="/") router.push('/')
        }else{
          setLoggedIn(false)
          if(router.pathname!=="/signup") router.push('/signup')
        }
      } catch (error) {
          setLoggedIn(false)
          if(router.pathname==="/") router.push('/login')
      }
    }
  }, [authCheck.isFetched])



  const logoutUser: React.MouseEventHandler<HTMLButtonElement> = function(e){
    e.preventDefault();
    setToken(undefined)
    setAuthUser(undefined)
    router.push('/login')
  }

  return (
    <main className={`font-sans ${inter.variable}`}>
      <nav className={'grid grid-col-12 grid-flow-col border-2 border-gray-200 p-2 mt-0 mb-2 '}>
            <div key="nav-first" id="nav-first" style={{display:'flex'}} className="col-span-3">
              <div style={{display:'inline-flex', flexDirection:'column', textAlign:'left', margin:'5px', padding:'17px'}}>
                <span className="bg-gray-500 p-2 rounded-sm text-white">
                  <Link href={"/"}>ECOMMERCE</Link>
                </span>
              </div>
            </div>
            <div key="nav-second" id="nav-second" style={{display:'flex', alignItems:'center'}} className="col-span-7">
              <div id="nav-internal-second">
              {
                    ['Categories', 'Sale', 'Clearance', 'New Stock', 'Trending'].map((e, i)=>{
                        return (<span id={"pageslink"+i} style={{margin:'5px'}}><Link href={"/"}>{e}</Link></span>)
                    })
                }
              </div>
            </div>
            <div className="col-span-2" style={{display:'flex', alignItems:'center'}}>
              <div id="nav-internal-third" >
                  <span className="bg-red-500 p-2 rounded-md text-white">
                    {loggedIn ?(<button onClick={(e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>logoutUser(e)}>Logout</button>):(router.pathname === "/signup"? (<Link href={"/login"}>LOGIN</Link>):(<Link href={"/signup"}>SIGNUP</Link>))}
                  </span>
              </div>
            </div>
      </nav>
      <div >
        <div style={{minHeight:'400px', maxWidth: '500px', border:'2px solid red', margin:'auto'}}>
          <Component {...pageProps} />
        </div>
      </div>
    </main>
  );
};

export default api.withTRPC(MyApp);
