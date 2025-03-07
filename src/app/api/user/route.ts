import { openDb } from '@/lib/db';
import jwt from 'jsonwebtoken'

const JWT_SECRET = 'MySuperSecretKey2023!@#$%^&*()'

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

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number};
    const userId = decoded.userId;

    const db = await openDb();
    const user = await db.get('SELECT id, name, email FROM users WHERE id = ?', [userId]);

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