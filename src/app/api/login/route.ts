import { openDb } from '@/lib/db';
import jwt from 'jsonwebtoken'

const JWT_SECRET = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzEwMDM2MDAwLCJleHAiOjE3MTAwMzY2MDB9.f4VbYIoXMxYh92XG0BPCfHR7EnT56CrKxE5zCNv7uLw'

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ message: 'E-mail e senha são obrigatórios' }), {
      status: 400,
    });
  }

  try {
    const db = await openDb();
    const user = await db.get('SELECT * FROM users WHERE email = ? AND password = ?', [
      email,
      password,
    ]);

    
    if (!user) {
      return new Response(JSON.stringify({ message: 'Credenciais inválidas' }), { status: 401 });
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' })
    console.log('Token gerado:', token)
    
    return new Response(JSON.stringify({ message: 'Login bem-sucedido', token, role: user.role}), 
    {status: 200, });
    
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return new Response(JSON.stringify({ message: 'Erro no servidor' }), { status: 500 });
  }
}