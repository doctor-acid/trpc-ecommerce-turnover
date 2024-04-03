"use client";
import React, { useState } from "react";
import { api } from "~/utils/api";
import { addUserInterest, removeUserInterest } from "../local_data";

export const Category: React.FunctionComponent<{selected:boolean, id: number, name: string}> = ({selected, id, name}:{selected:boolean, id: number, name: string})=>{
    const [checked, setChecked] = useState(selected);

    function checkVal(){
        if(selected){
            // console.log(id," ", name)
        }
    }
    checkVal()
    const deletion = api.interest.removeInterest.useMutation();
    const mutation = api.interest.addInterest.useMutation();

    const handleChecked = function(e:React.ChangeEvent<HTMLInputElement>){
        
        if(checked){
            deletion.mutate({id: id},{
                onSuccess: (data)=>{
                    setChecked(false);
                    if(data.data)
                    removeUserInterest(data.data)
                    else{
                        const interestId = Number(e.target.value)
                        removeUserInterest(data.data, interestId)
                    }
                },
                onError: (err)=>{
                    window.alert(JSON.stringify(err.message))
                }
            })
        }else{
            mutation.mutate({id: id},{
                onSuccess: (data)=>{
                    setChecked(true);
                    addUserInterest(data.data)
                },
                onError: (err)=>{
                    window.alert(JSON.stringify(err.message))
                }
            })
        }
    }

    return(
        <div id={"cat_"+id} key={id} style={{padding: '5px', margin:'6px', border:'1px solid grey'}}>
            <div style={{display:'inline-flex'}}>
                <span>
                    <input type="checkbox" value={id} checked={checked} onChange={handleChecked}></input>
                </span>
                <span>
                    <p>{name}</p>
                </span>
            </div>
        </div>
    )
}