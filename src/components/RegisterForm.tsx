'use client';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const schema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'A senha é obrigatória'),
  agree: z.boolean().refine((value) => value === true, 'Você deve concordar com os termos'),
});

type FormData = z.infer<typeof schema>;

export default function RegisterForm() {
  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
    setValue,
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: zodResolver(schema),
  });

  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null)

  useEffect(()=>{
    setValue('email', '')
    setValue('password', '')
  })

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      setMessage(result.message);

      if (res.status === 201) {
        reset();
      }
    } catch (error) {
      setMessage('Erro ao cadastrar. Tente novamente.');
      setStatus(500)
    }
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
      {message && (
        <p
          className={`text-sm text-center ${message.includes('sucesso') ? 'text-green-800' : 'text-red-500'}`}
        >
          {message}
        </p>
      )}

      <div className="flex flex-col">
        <label className="text-sm" htmlFor="name">
          Nome
        </label>
        <div className="flex flex-col w-full">
          <input
            type="text"
            placeholder="Digite seu nome"
            className={`rounded-lg py-2 px-2 text-sm placeholder:text-stone-400 bg-stone-50 ${
              errors.name ? 'border border-red-500' : 'border border-white'
            } focus:outline-none`}
            {...register('name')}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-2 font-semibold">{errors.name.message}</p>
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
            className={`rounded-lg py-2 px-2 text-sm placeholder:text-stone-400 bg-stone-50 ${
              errors.email ? 'border border-red-500' : 'border border-white'
            } focus:outline-none`}
            {...register('email')}
            autoComplete='new-email'
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-2 font-semibold">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <label className="text-sm" htmlFor="password">
          Senha
        </label>
        <div className="flex flex-col w-full">
          <input
            type="password"
            placeholder="Digite sua senha"
            className={`rounded-lg py-2 px-2 text-sm placeholder:text-stone-400 bg-stone-50 ${
              errors.password ? 'border border-red-500' : 'border border-white'
            } focus:outline-none`}
            {...register('password')}
            autoComplete='new-password'
          />
          {errors.password && (
            <p className="text-xs text-red-500 mt-2 font-semibold">{errors.password.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <a href="#" className="text-xs underline mb-2">
          Leia os termos
        </a>
        <div className="flex gap-2 items-center">
          <input type="checkbox" {...register('agree')} />
          <label className="text-sm" htmlFor="agree">
            Concordo com os termos.
          </label>
        </div>
        {errors.agree && (
          <p className="text-xs text-red-500 mt-2 font-semibold">{errors.agree.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="cursor-pointer bg-slate-600 hover:bg-slate-500 font-medium text-sm py-2 px-4 rounded-xl text-white"
      >
        Cadastrar
      </button>

      <Link
        href="/"
        className="text-sm text-center text-slate-600 font-semibold hover:underline"
      >
        Já tem uma conta? Faça login
      </Link>
    </form>
  );
}