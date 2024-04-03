"use client";
import { useEffect, useRef, useState } from "react";
import { api } from "~/utils/api";
import { Category } from "./Category";
import { PaginateButtons } from "./PaginateButtons";
import { getUserInterests } from "../local_data";

type Icategory = {
    id: number;
    name: string;
    metadata: string | null;
    createdAt: Date;
    updatedAt: Date;
}
let typedEmptyArr:Icategory[] = []

type IUserInterest = {
    id: number;
    userId: number;
    interestId: number;
    metadata: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export default function CategoriesPage(){
    const [page, setPage] = useState(1);
    const [totalPages, settotalPages] = useState(1);
    const [categories, setCategories] = useState(typedEmptyArr);
    
    const [lastId, setLastId] = useState(0);
    
    const limit = 6;
    
    const userInterests: IUserInterest[] = getUserInterests();

    function calculatePagableNumbers():number[]{
        if(totalPages<=5){
            // console.log('total pages less than 5')
            // numbers from 1 to totalPages
            return new Array(totalPages).fill(0).map((e,i)=>i+1)
        }else{
            if(page-2<1){
                // console.log('total pages more than 5')
                // numbers from 1 to 5
                return new Array(5).fill(0).map((e,i)=>i+1)
            }else if(page+2>totalPages){
                // numbers from last-4 to last
                return new Array(5).fill(0).map((e,i)=>(totalPages-(4-i)))
            }else{
                return [page-2, page-1,page,page+1, page+2]
            }
        }
    }

    const count = api.interest.countOfTotalCategories.useQuery(undefined, {
        retry: false,
        refetchOnMount: false
    })

    const mutation = api.interest.getCategoriesPaginated.useMutation();

    useEffect(()=>{
        if(count.data)
        settotalPages(Math.ceil((count.data.data)/limit))
    },[count.isFetched])

    useEffect(()=>{
        mutation.mutate({page:1, lastId: undefined, limit: 6 },{
            onSuccess: (data)=>{
                setCategories(data);
            },
            onError: (err)=>{
                window.alert(JSON.stringify(err.message))
            }
        })
    },[])

    const handlePageChange = function(newPage: number){
        mutation.mutate({page:newPage, lastId: (newPage===page+1)&&lastId? lastId : undefined, limit: 6 },{
            onSuccess: (data)=>{
                setPage(newPage);
                setCategories(data);
            },
            onError: (err)=>{
                window.alert(JSON.stringify(err.message))
            }
        })
    }

    return(
        <div style={{textAlign:'center'}}>
            <div style={{minHeight:'300px'}}>
                {categories.map((cat, i)=>
                    <Category 
                        key={cat.id}
                        selected={userInterests.findIndex((e, i)=>e.interestId===cat.id)>=0?true:false}
                        id={cat.id}
                        name={cat.name}
                    />
                )}
            </div>
            {count.data?.data? (<div>
                <PaginateButtons disabled={page===1} handlePageChange={handlePageChange} value={"<<"} pageValue={1}/>
                <PaginateButtons disabled={page===1} handlePageChange={handlePageChange} value={"<"} pageValue={page-1} />
                {/* <ul> */}
                    {calculatePagableNumbers().map((n, i)=>{
                        return (<PaginateButtons disabled={page===n} handlePageChange={handlePageChange} value={n+""} pageValue={n} />)
                    })}
                {/* </ul> */}
                <PaginateButtons disabled={page===totalPages} handlePageChange={handlePageChange} value={">"} pageValue={page+1}/>
                <PaginateButtons disabled={page===totalPages} handlePageChange={handlePageChange} value={">>"} pageValue={totalPages} />
            </div>) : "...Loading Pagination Bar"}
        </div>
    )
}