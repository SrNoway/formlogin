import { openDb } from '@/lib/db';
import jwt from 'jsonwebtoken'

const JWT_SECRET = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzEwMDM2MDAwLCJleHAiOjE3MTAwMzY2MDB9.f4VbYIoXMxYh92XG0BPCfHR7EnT56CrKxE5zCNv7uLw'

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer')){
    return new Response(JSON.stringify({ message: 'Token não fornecido ou inválido'}), {
      status: 401,
    });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token recebido:', token); // Adiciona log
  
  try {

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string};
    const userId = decoded.userId;

    const db = await openDb();
    const user = await db.get('SELECT id, name, email, role FROM users WHERE id = ?', [userId]);

    if (!user) {
      return new Response(JSON.stringify({ message: 'Usuário não encontrado' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Dados do usuário recuperados', user }), {
      status: 200,
    });
  } catch (error) {
    console.error('Erro ao verificar token ou buscar usuário:', error);
    return new Response(JSON.stringify({ message: 'Token inválido ou expirado' }), { status: 500 });
  }
}