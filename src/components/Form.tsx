'use client'
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const schema = z.object({
    name: z.string().min(1, 'O nome é obrigatório'),
    email: z.string().email('E-mail inválido'),
    agree: z.boolean().refine(value => value === true, 'Você deve concordar com os termos')
});

type FormData = z.infer<typeof schema>;

export function Form() {
    const { formState: { errors }, register, handleSubmit, reset } = useForm<FormData>({
        mode: 'onBlur',
        resolver: zodResolver(schema)
    });

    const onSubmit = (data: FormData) => {
        console.log(data)
        alert('Cadastrado com sucesso');
        reset();
    };




    return (
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col">
                <label className="text-sm" htmlFor="name">
                    Nome
                </label>
                <div className="flex flex-col w-full">
                    <input
                        type="text"
                        placeholder="Digite seu nome"
                        className={`rounded-lg py-2 px-2 text-sm placeholder:text-stone-400 bg-stone-50 ${errors.name ? ' border border-red-500' : ' border border-white'} focus:outline-none focus:border-slate-900`}
                        {...register('name')}
                    />
                    {errors.name && (
                        <p className="text-xs text-red-500 mt-2 font-semibold">
                            {errors.name.message}
                        </p>
                    )}
                </div>

            </div>

            <div className="flex flex-col">
                <label className="text-sm" htmlFor="email">
                    E-mail
                </label>

                    <div className="flex flex-col w-full"> 
                        <input
                            type="email"
                            placeholder="Insira seu e-mail"
                            className={`rounded-lg py-2 px-2 text-sm placeholder:text-stone-400 bg-stone-50 ${errors.email ? ' border border-red-500' : ' border border-white'}focus:outline-none focus:border-slate-900`}
                            {...register('email')}
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500 mt-2 font-semibold">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

            </div>

            <div className="flex flex-col">
                <a href="#" className="text-xs underline mb-2">Leia os termos</a>
                <div className="flex gap-2 items-center">

                    <input type="checkbox"
                        {...register('agree')}
                    />

                    <label className="text-sm" htmlFor="agree">
                        Concordo com os termos.
                    </label>
                </div>
                {errors.agree && (
                    <p className="text-xs text-red-500 mt-2 font-semibold">
                        {errors.agree.message}
                    </p>
                )}
            </div>
            <button type="submit" className="bg-slate-600 hover:bg-slate-500 font-medium text-sm py-2 px-4 rounded-xl 4 text-white">
                Cadastrar</button>
        </form>
    )
}
