// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UpdateUserDto } from '../../auth/dto/update-user.dto';

@Injectable()
export class UsersService {
  private prisma = new PrismaClient();

  // Retorna todos los usuarios
  async getUsers() {
    return await this.prisma.user.findMany();
  }

  // Actualiza un usuario por ID (por ejemplo, para cambiar su imagen de perfil)
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { role, ...data } = updateUserDto;
      const updatedUser = await this.prisma.user.update({
        where: { id: parseInt(id) },
        data,
      });
      return updatedUser;
    } catch (error) {
      console.error('Error en el servicio updateUser:', error);
      throw error;
    }
  }

  // Método para marcar un usuario como online/offline utilizando upsert.
  // Se asume que "username" es único.
  async setOnlineStatus(username: string, isOnline: boolean) {
    try {
      return await this.prisma.user.upsert({
        where: { username },
        update: { isOnline },
        create: {
          username,
          isOnline,
          profileImage: '',
          email: `${username}@default.com`,
          password: 'defaultpassword',
          role: 'USER',
        },
      });
    } catch (error) {
      console.error(`Error en upsert para el usuario ${username}:`, error);
      throw error;
    }
  }
}
