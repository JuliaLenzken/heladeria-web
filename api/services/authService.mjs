import { readDb, writeDb } from '../repositories/dataRepository.mjs';

export async function loginUser({ email, password, username }) {
  const db = await readDb();
  const normalizedIdentifier = String(email ?? username ?? '').trim().toLowerCase();
  const user = db.users.find((item) => {
    const matchesEmail = item.email?.toLowerCase() === normalizedIdentifier;
    const matchesUsername = item.username?.toLowerCase() === normalizedIdentifier;
    const matchesName = item.name?.toLowerCase() === normalizedIdentifier;
    return (matchesEmail || matchesUsername || matchesName) && item.password === password;
  });

  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  return {
    id: user.id,
    username: user.username ?? user.name,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function registerUser({ name, email, password }) {
  const db = await readDb();
  const exists = db.users.find((item) => item.email.toLowerCase() === String(email).toLowerCase());

  if (exists) {
    throw new Error('El usuario ya existe');
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    role: 'customer',
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  await writeDb(db);

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
  };
}
