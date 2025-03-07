import { openDb } from '@/lib/db';
import jwt from 'jsonwebtoken'

const JWT_SECRET = 'MySuperSecretKey2023!@#$%^&*()'

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
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' })
    
    return new Response(JSON.stringify({ message: 'Login bem-sucedido', token}), {
      status: 200, });
    
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return new Response(JSON.stringify({ message: 'Erro no servidor' }), { status: 500 });
  }
}