import { Inject, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { PrismaService } from "src/prisma/prisma/prisma.service";
import { Logger } from "winston";

@Injectable()
export class UserRepository {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {
    this.logger.info("Create User repository");
  }

  async save(firstName: string, lastName?: string): Promise<User> {
    this.logger.info(`Create DATA User`);
    return await this.prismaService.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    });
  }
}
