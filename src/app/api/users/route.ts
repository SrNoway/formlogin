import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function GET() {
    try {
        const db = await openDb();
        const users = await db.all('SELECT id, name, email, role FROM users');
        return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Erro ao buscar usuários' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        const db = await openDb();
        await db.run('DELETE FROM users WHERE id = ?', id);
        return NextResponse.json({ message: 'Usuário deletado com sucesso' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Erro ao deletar usuário' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { id, name, email, role } = await req.json();
        const db = await openDb();
        await db.run(
            'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
            [name, email, role, id]
        );
        return NextResponse.json({ message: 'Usuário atualizado com sucesso' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Erro ao atualizar usuário' }, { status: 500 });
    }
}
