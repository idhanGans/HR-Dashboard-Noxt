import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { CreateUserDto, UpdateUserDto, UserResponseDto } from "@/users/dto";

@Injectable()
export class UsersService {
  private users: UserResponseDto[] = [];

  constructor(private prisma: PrismaService) {}

  createUser(createUserDto: CreateUserDto): UserResponseDto {
    const newUser: UserResponseDto = {
      id: (this.users.length + 1).toString(),
      ...createUserDto,
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id: string, updateUserDto: UpdateUserDto): UserResponseDto {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.users[userIndex] = { ...this.users[userIndex], ...updateUserDto };
    return this.users[userIndex];
  }

  getAllUsers(): UserResponseDto[] {
    return this.users;
  }

  getUserById(id: string): UserResponseDto {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
