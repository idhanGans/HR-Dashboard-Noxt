import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "@/prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { LoginDto, AuthResponseDto, RefreshResponseDto } from "@/auth/dto";
import { UserResponseDto } from "@/users/dto";
import { JwtPayload } from "@/auth/strategies/jwt.strategy";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const accessToken = await this.generateAccessToken(user.id);
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string): Promise<RefreshResponseDto> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: this.configService.get<string>("REFRESH_TOKEN_SECRET"),
        },
      );

      if (payload.type !== "refresh") {
        throw new UnauthorizedException("Invalid token type");
      }

      const accessToken = await this.generateAccessToken(payload.sub);

      return {
        accessToken,
      };
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async validateUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        roleName: true,
        role: true,
        employmentType: true,
        taxNumber: true,
        identityNumber: true,
        startDate: true,
        leaveDate: true,
        location: true,
        bankNumber: true,
        bankName: true,
        bankAccountHolderName: true,
        photoUrl: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async getProfile(userId: number): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        roleName: true,
        role: true,
        employmentType: true,
        taxNumber: true,
        identityNumber: true,
        startDate: true,
        leaveDate: true,
        location: true,
        bankNumber: true,
        bankName: true,
        bankAccountHolderName: true,
        photoUrl: true,
        organizationId: true,
        organization: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return user as UserResponseDto;
  }

  private async generateAccessToken(userId: number): Promise<string> {
    const payload: JwtPayload = {
      sub: userId,
      type: "access",
    };

    const secret = this.configService.get<string>("ACCESS_TOKEN_SECRET");
    const expiresIn = this.configService.get<string>(
      "ACCESS_TOKEN_DURATION",
    ) as JwtSignOptions["expiresIn"];

    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });
  }

  private async generateRefreshToken(userId: number): Promise<string> {
    const payload: JwtPayload = {
      sub: userId,
      type: "refresh",
    };

    const secret = this.configService.get<string>("REFRESH_TOKEN_SECRET");
    const expiresIn = this.configService.get<string>(
      "REFRESH_TOKEN_DURATION",
    ) as JwtSignOptions["expiresIn"];

    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });
  }
}
