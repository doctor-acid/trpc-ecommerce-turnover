import Link from "next/link";
import { useState } from "react";
import { api } from "~/utils/api";
import * as Zod from 'zod'
import { useRouter } from "next/router";
import { setToken } from "../../components/local_data";
import { assertIsZodError } from "~/utils/exception";


export default function Login(){

    const router = useRouter()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')


    const mutation = api.auth.signUp.useMutation()

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
            Zod.string().email().parse(email)
            Zod.string().min(8).parse(password)
            Zod.string().min(3).parse(name)
        } catch (e) {
            assertIsZodError(e)
            if(typeof window !== undefined)
            window.alert(JSON.stringify(e.flatten()))
        }
        try {
            mutation.mutate({email, password, name},{
                onSuccess: async (data)=>{
                    setToken(data.token)
                    await router.push('/verify')
                },
                onError: (error)=>{
                    window.alert(JSON.stringify(error.message))
                }

            });
        } catch (error) {
            if(typeof window !== undefined)
            window.alert(JSON.stringify(error))
        }
    }
    function handleEmailChange(email:string){
        setEmail(email)
    }
    function handleNameChange(name:string){
        setName(name)
    }
    function handlePasswordChange(password:string){
        setPassword(password)
    }
    return (

        <div style={{textAlign:'center'}}>
            <h2>
                Create an account
            </h2>
            <div>
                <div style={{border: '2px solid black'}}>
                <label>
                    Name:
                    <input type="text" name="name" onChange={(e)=>{handleNameChange(e.target.value)}} />
                </label>
                </div>
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
            <button onClick={()=>handleSubmit()}>SIGNUP</button>
            </div>
            <div>
                <Link href={"/login"}>Already a user? Login</Link>
            </div>

        </div>

    )
}