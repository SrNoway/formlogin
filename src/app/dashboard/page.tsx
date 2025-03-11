'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const [user, setUser] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([])
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
                    const userData = result.user
                    if (userData.role !== 'admin') {
                        localStorage.removeItem('token')
                        router.push('/')
                        return
                    }
                    setUser(userData)
                    fetchUsers()
                } else {
                    setError(result.message);
                    localStorage.removeItem('token')
                    router.push('/')
                }
            } catch (err) {
                setError('Erro ao carregar dados do usuário');
                localStorage.removeItem('token')
                router.push('/')
            } finally {
                setLoading(false);
            }
        };

        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/users', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const result = await res.json();
                if (res.status === 200) {
                    setUsers(result.users);
                } else {
                    setError(result.message);
                }
            } catch (err) {
                setError('Erro ao carregar lista de usuários');
            }
        }

        fetchUser();
    }, [router]);

    if (loading) return <p className="text-center">Carregando...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!user) return null;

    const handleDelete = async (id: number) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/users', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ id }),
            });
            if (res.status === 200) {
                setUsers(users.filter(user => user.id !== id)); // Remove da lista
            } else {
                alert('Erro ao excluir usuário');
            }
        } catch (error) {
            alert('Erro ao excluir usuário');
        }
    };

    const handleUpdate = async (id: number, newName: string, newEmail: string, newRole: string) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ id, name: newName, email: newEmail, role: newRole }),
            });
            if (res.status === 200) {
                setUsers(users.map(user => (user.id === id ? { ...user, name: newName, email: newEmail, role: newRole } : user)));
            } else {
                alert('Erro ao atualizar usuário');
            }
        } catch (error) {
            alert('Erro ao atualizar usuário');
        }
    };



    return (
        <div className='bg-slate-600 flex'>
            <div className="container mx-auto max-w-sm md:max-w-xl lg:max-w-3xl px4 mb-10">
                <h1 className='font-mono text-white text-center  text-4xl mt-5'>Dashboard</h1>
                <div className='flex justify-end mb-6 mt-4'>
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            router.push('/');
                        }}
                        className="bg-red-600 hover:bg-red-500 font-medium text-sm py-2 px-4 md:px-5 rounded-xl text-white transition-colors duration-200"
                    >
                        Sair
                    </button>
                </div>
                <p className='text-white text-lg mt-10 flex font-semibold justify-center rounded-lg mb-2'>Usuários cadastrados:</p>
                <ul className="space-y-5">
                    {users.map((user) => (
                        <li key={user.id} className="bg-gray-300 p-4 rounded-lg shadow flex flex-col gap-2">
                            <input
                                type="text"
                                value={user.name}
                                onChange={(e) => setUsers(users.map(u => u.id === user.id ? { ...u, name: e.target.value } : u))}
                                className="border border-slate-500 p-2 rounded font-mono focus:outline-none focus:ring-1 focus:ring-slate-400"
                            />
                            <input
                                type="email"
                                value={user.email}
                                onChange={(e) => setUsers(users.map(u => u.id === user.id ? { ...u, email: e.target.value } : u))}
                                className="border border-slate-500 p-2 rounded font-mono focus:outline-none focus:ring-1 focus:ring-slate-400"
                            />
                            <select
                                value={user.role}
                                onChange={(e) => setUsers(users.map(u => u.id === user.id ? { ...u, role: e.target.value } : u))}
                                className="border border-slate-500 p-2 rounded font-mono focus:outline-none focus:ring-1 focus:ring-slate-400"
                            >
                                <option value="user">Usuário</option>
                                <option value="admin">Admin</option>
                            </select>
                            <div className="flex gap-2">
                                <button onClick={() => handleUpdate(user.id, user.name, user.email, user.role)} className="cursor-pointer bg-slate-600 hover:bg-slate-500 transition-colors duration-200 text-white px-4 py-2 rounded">Salvar</button>
                                <button onClick={() => handleDelete(user.id)} className="cursor-pointer bg-red-500 hover:bg-red-400 transition-colors duration-200 text-white px-4 py-2 rounded">Excluir</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}