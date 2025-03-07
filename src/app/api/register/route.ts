import { openDb } from '@/lib/db';

export async function POST(req: Request) {
    const { name, email, password, agree } = await req.json();

    if (!name || !email || !password ||  agree === undefined) {
        return new Response(JSON.stringify({ message: 'Todos os campos são obrigatórios' }), {
            status: 400,
        });
    }

    try {
        const db = await openDb();

        const existingUser = await db.get('SELECT email FROM users WHERE email = ?', [email]);
        if (existingUser) {
            return new Response(JSON.stringify({ message: 'E-mail já cadastrado' }), { status: 409 });
        }

        await db.run('INSERT INTO users (name, email, password, agree) VALUES (?, ?, ?, ?)', [name, email, password, agree]);

        return new Response(JSON.stringify({ message: 'Usuário cadastrado com sucesso' }), {
            status: 201,
        });
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        return new Response(JSON.stringify({ message: 'Erro no servidor' }), { status: 500 });
    }
}