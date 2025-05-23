/* Definición unificada de la interfaz User para el frontend */

export interface User {
  id: (number | string); // (puede ser number o string según el contexto)
  username: string;
  isOnline?: boolean;
  profileImage?: string;
  email?: string;
  phone?: string;
 role?: string;
}

// Para el chat se usa un tipo ChatUser (id numérico, isOnline obligatorio, etcétera)
export type ChatUser = Pick<User, "id" | "username" | "profileImage"> & { isOnline: boolean };

// Para el perfil (EditProfileModal) se usa un tipo ProfileUser (id string, email, phone, role obligatorios, etcétera)
export type ProfileUser = Pick<User, "id" | "username" | "profileImage"> & { email: string; phone?: string; role: string }; 