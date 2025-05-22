// src/lib/auth.ts
export async function fakeLogin(username: string, password: string): Promise<boolean> {
    if (username === "test" && password === "123") return true;
    throw new Error("Usuario/contraseña inválidos");
  }
  
  export async function fakeRegister(username: string, email: string, password: string): Promise<boolean> {
    if (!username || !email || !password) throw new Error("Datos incompletos");
    return true;
  }
  