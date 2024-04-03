import { useState } from "react";
import { api } from "~/utils/api";
import * as Zod from 'zod'
import { useRouter } from "next/router";
import { assertIsZodError } from "~/utils/exception";


export default function Verify(){

    const router = useRouter()

    const [code, setCode] = useState('')

    const mutation = api.auth.verify.useMutation()

    // useEffect(()=>{
    //     // if(mutation.isSuccess){
    //     //     router.push('/verify')
    //     // }else{
            
    //     //     console.log(typeof window)
    //     //     window.alert(mutation.error)
    //     // }
    // })

    function handleSubmit(){
        try {
            Zod.string().min(8).max(8).parse(code)
        } catch (e) {
            assertIsZodError(e)
            if(typeof window !== undefined)
            window.alert(JSON.stringify(e.flatten()))
        }
        try {
            mutation.mutate({code}, {
                onSuccess: async (_data)=>{
                    await router.push('/')
                },
                onError: (err)=>{
                    window.alert(JSON.stringify(err.message))
                }
            });
            // router.push('/')
        } catch (error) {
            if(typeof window !== undefined)
            window.alert(JSON.stringify(error))
        }
    }
    function handleCodeChange(code:string){
        setCode(code)
    }

    
    return (
        <div style={{textAlign:'center'}}>
            <div style={{padding:'10px', 'margin':'10px'}}>
            <h2>
                {"CODE VERIFICATION PAGE"}
            </h2>
            </div>

            <div>
                <div style={{border: '2px solid black'}}>
                <label>
                    CODE:
                    <input type="text" name="code" onChange={(e)=>{handleCodeChange(e.target.value)}} />
                </label>
                </div>
            </div>
            <div>
            <button onClick={()=>handleSubmit()}>VERIFY CODE</button>
            </div>

        </div>
    )
}