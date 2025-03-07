'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await fetch('/api/user', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const result = await res.json();
                if (res.status === 200) {
                    setUser(result.user);
                } else {
                    setError(result.message);
                    localStorage.removeItem('token')
                }
            } catch (err) {
                setError('Erro ao carregar dados do usuário');
                localStorage.removeItem('token')
                router.push('/')
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    if (loading) return <p className="text-center">Carregando...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!user) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-600">
            <div className="bg-gray-200 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl mb-6 text-center font-semibold">Dashboard</h1>
                <div className="space-y-4">
                    <p className='bg-slate-800 text-white rounded-lg p-2'><strong>ID:</strong> {user.id}</p>
                    <p className='bg-slate-800 text-white rounded-lg p-2'><strong>Nome:</strong> {user.name}</p>
                    <p className='bg-slate-800 text-white rounded-lg p-2'><strong>E-mail:</strong> {user.email}</p>
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            router.push('/');
                        }}
                        className="bg-red-600 hover:bg-red-500 font-medium text-sm py-2 px-4 rounded-xl text-white mt-4"
                    >
                        Sair
                    </button>
                </div>
            </div>
        </div>
    );
}