import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import * as Zod from 'zod'
import { useRouter } from "next/router";
import { setToken } from "../local_data";
import { error } from "console";
import { assertIsZodError } from "~/utils/exception";


export default function Login(){

    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const mutation = api.auth.login.useMutation()

    useEffect(()=>{
        // if(mutation.isSuccess){
        //     // router.push('/verify')
        // }else{
            
        //     console.log(typeof window)
        //     window.alert(mutation.error)
        // }
    })

    async function handleSubmit(){
        try {
            Zod.string().email().parse(email)
            Zod.string().min(8).parse(password)
        } catch (e) {
            assertIsZodError(e)
            if(typeof window !== undefined)
            window.alert(JSON.stringify(e.flatten()))
        }
        try {
            mutation.mutate({email, password}, {
                onSuccess: (data)=>{
                    setToken(data.token)
                    router.push(data.redirect)
                },
                onError: (error)=>{
                    window.alert(JSON.stringify(error.message))
                }
            })
            // setToken()
        } catch (error) {
            if(typeof window !== undefined)
            window.alert(JSON.stringify(error))
        }
        
    }
    function handleEmailChange(email:string){
        setEmail(email)
    }
    function handlePasswordChange(password:string){
        setPassword(password)
    }
    return (

        <div style={{textAlign:'center'}}>
            <h2>
                login page
            </h2>
            <div>
                <div style={{border: '2px solid black'}}>
                <label>
                    Email:
                    <input type="text" name="email" onChange={(e)=>{handleEmailChange(e.target.value)}} />
                </label>
                </div>
                <div style={{border: '2px solid black'}}>
                <label>
                    Password:
                    <input type="text" name="password" onChange={(e)=>{handlePasswordChange(e.target.value)}} />
                </label>
                </div>


            </div>
            <div>
            <button onClick={()=>handleSubmit()}>LOGIN</button>
            </div>
            <div>
                <Link href={"/signup"}>signUp</Link>
            </div>

        </div>

    )
}