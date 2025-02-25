'use client'
import { useState, FormEvent } from "react"
import { User } from "@/types/User"
import { validate } from "@/utils/validate"

export function Form () {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [agree, setAgree] = useState(false)

    const [errors, setErrors] = useState<User | null>(null)

    const handleSubimit = (event: FormEvent) => {
        event.preventDefault()
        setErrors(null)

        const data: User = {
            name,
            email,
            agree
        }

        const validateErrors = validate(data)


        if(Object.keys(validateErrors).length > 0) {
            setErrors(validateErrors)
            return;

        }
        setAgree(false)
        setName('')
        setEmail('')
        alert('Cadastrado com sucesso')
        
    };


    return (
        <form className="flex flex-col gap-3" onSubmit={handleSubimit}>
            <div className="flex flex-col">
                <label className="text-sm" htmlFor="name">
                  Nome
                </label>
                <input 
                type="text" 
                placeholder="Digite seu nome" 
                className="rounded-lg py-2 px-2 text-sm placeholder:text-stone-400 bg-stone-50"  
                value={name} 
                onChange={(event) => setName(event.target.value)}
                />
                {errors?.name && (<small className="text-red-400 text-xs mt-1">{errors.name}</small>)}
            </div>

            <div className="flex flex-col">
                <label className="text-sm" htmlFor="email">
                  E-mail
                </label>
                <input 
                type="email" 
                placeholder="Insira seu e-mail" 
                className="rounded-lg py-2 px-2 text-sm placeholder:text-stone-400 bg-stone-50"  
                value={email} 
                onChange={(event) => setEmail(event.target.value)}
                />
                {errors?.email && (<small className="text-red-400 text-xs mt-1">{errors.email}</small>)}
            </div>

            <div className="flex flex-col">
                <a href="#" className="text-xs underline mb-2">Leia os termos</a>
                <div className="flex gap-2 items-center">
                <input type="checkbox"   
                checked={agree} 
                onChange={(event) => setAgree(event.target.checked)}
                />
                <label className="text-sm" htmlFor="agree">
                  Concordo com os termos</label>
                </div>
                {errors?.agree && (<small className="text-red-400 text-xs mt-1">{errors.agree}</small>)}
            </div>
            <button type="submit" className="bg-slate-600 hover:bg-slate-500 font-medium text-sm py-2 px-4 rounded-xl 4 text-white">
                Cadastrar</button>
        </form>
    )
}
