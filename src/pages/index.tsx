import { api } from "~/utils/api";
import CategoriesPage from "../components/CategoriesPage";
import { setUserInterests } from "../components/local_data";
import { useEffect } from "react";

function Home() {

  const userInterests = api.interest.getUserPreferences.useQuery(undefined,{
    refetchOnMount: false
  })

  useEffect(()=>{
    if(userInterests.data){
      setUserInterests(userInterests.data)
    }
  },[userInterests.isFetched])

  return (
    <div>
      <div style={{textAlign:'center', margin:'5px', padding:'2px'}}>
        <h1 style={{fontSize: '30px'}}>
          Please mark your interests!
        </h1>
      </div>
      <div style={{textAlign:'center', margin:'5px', padding:'2px'}}>
          <h6>
            We will keep you informed.
          </h6>
      </div>
      <div style={{minHeight:'10px', margin:'5px', padding:'2px'}}>
      </div>
      <div>
        {userInterests.data?<CategoriesPage />: '...Loading Interests'}
      </div>
    </div>

  );
}

// export default isAuth(Home)
export default Home
