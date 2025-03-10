'use client';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'A senha é obrigatória'),
});



type FormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
    setValue,
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: zodResolver(loginSchema),
  });

  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null)
  const router = useRouter()

  useEffect(()=>{
    setValue('email', '')
    setValue('password', '')
  }, [setValue])

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      setMessage(result.message);
      setStatus(res.status)

      if (res.status === 200) {
        const token = result.token
        const role = result.role
        localStorage.setItem('token', token)
        if (role === 'admin'){
        router.push('/dashboard')
        } else if (role === 'user'){
          router.push('/profile')
        } else {
          setMessage('Role inválido')
          setStatus(500)
          return
        }
        reset();
      }
    } catch (error) {
      setMessage('Erro ao fazer login. Tente novamente.');
      setStatus(500)
    }
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      {message && (
        <p
          className={`text-sm text-center ${status === 200 ? 'text-green-800' : 'text-red-500'}`}
        >
          {message}
        </p>
      )}

      <div className="flex flex-col">
        <label className="text-sm" htmlFor="email">
          E-mail
        </label>
        <div className="flex flex-col w-full">
          <input
            type="email"
            placeholder="Insira seu e-mail"
            className={`rounded-lg py-2 px-2 text-sm placeholder:text-stone-400 bg-stone-50 ${errors.email ? 'border border-red-500' : 'border border-white'
              } focus:outline-none`}
            {...register('email')}
            autoComplete="new-email"
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
            className={`rounded-lg py-2 px-2 text-sm placeholder:text-stone-400 bg-stone-50 ${errors.password ? 'border border-red-500' : 'border border-white'
              } focus:outline-none`}
            {...register('password')}
            autoComplete="new-password"
          />
          {errors.password && (
            <p className="text-xs text-red-500 mt-2 font-semibold">{errors.password.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="bg-slate-600 hover:bg-slate-500 font-medium text-sm py-2 px-4 rounded-xl text-white"
      >
        Entrar
      </button>
      <div className='text-center'>
        <p className='' >Ainda não tem uma conta?</p>
        <Link className='' href="/register">
          Cadastre-se
        </Link>
      </div>

    </form>
  );
}