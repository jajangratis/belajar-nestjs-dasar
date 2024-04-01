import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpException,
  HttpRedirectResponse,
  Inject,
  Param,
  ParseIntPipe,
  // Inject,
  // Optional,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UseFilters,
  // UseGuards,
  UseInterceptors,
  // UsePipes,
} from "@nestjs/common";
import { Request, Response } from "express";
import { UserService } from "./user.service";
import { Connection } from "../connection/connection";
import { MailService } from "../mail/mail.service";
import { UserRepository } from "../user-repository/user-repository";
import { MemberService } from "../member/member.service";
import { User } from "@prisma/client";
import { ValidationFilter } from "src/validation/validation.filter";
import {
  LoginUserRequest,
  loginUserRequestValidation,
} from "src/model/login.model";
import { ValidationPipe } from "src/validation/validation.pipe";
import { TimeInterceptor } from "src/time/time.interceptor";
import { Auth } from "src/auth/auth.decorator";
// import { RoleGuard } from "src/role/role.guard";
import { Roles } from "src/role/role.decorator";

// @UseGuards(RoleGuard)
@Controller("/api/users")
export class UserController {
  constructor(
    private service: UserService,
    private connection: Connection,
    private mailService: MailService,
    private userRepository: UserRepository,
    @Inject("EmailService") private emailService: MailService,
    private memberService: MemberService,
  ) {}
  // @Inject()
  // @Optional()
  // private userService: UserService;

  @Get("/current")
  @Roles(["admin", "operator"])
  current(@Auth() user: User): Record<string, any> {
    return {
      data: `Hello ${user.first_name}`,
      user,
    };
  }

  @UseFilters(ValidationFilter)
  // @UsePipes(new ValidationPipe(loginUserRequestValidation))
  @UseInterceptors(TimeInterceptor)
  @Header("Content-Type", "application/json")
  @Post("/login")
  async login(
    @Body(new ValidationPipe(loginUserRequestValidation))
    request: LoginUserRequest,
  ) {
    return {
      data: `Helo ${request.username}`,
    };
  }

  @Get("/connection")
  async getConnection(): Promise<string> {
    // return this.userService.sayHello(`${firstName + " " + LastName}`);
    // this.userRepository.save();
    this.mailService.send();
    this.emailService.send();
    console.info(this.memberService.getConnection());
    this.memberService.sendEmail();
    return this.connection.getName();
  }

  @Get("/hello")
  @UseFilters(ValidationFilter)
  async sayHello(
    // @Query("first_name") firstName: string,
    // @Query("last_name") LastName: string,
    @Query("name") name: string,
  ): Promise<string> {
    return this.service.sayHello(name);
    // return this.service.sayHello(`${firstName + " " + LastName}`);
  }

  @Get("/set-cookie")
  setCookie(@Query("name") name: string, @Res() response: Response) {
    response.cookie("name", name);
    response.status(200).send("Success Set Cookie");
  }

  @Get("/get-cookie")
  getCookie(@Req() request: Request): string {
    return request.cookies["name"];
  }

  @Post("/create")
  async saveUser(
    @Body("first_name") firstName: string,
    @Body("last_name") lastName: string,
  ): Promise<User> {
    if (!firstName) {
      throw new HttpException(
        {
          code: 400,
          errors: "first name is required",
        },
        400,
      );
    }
    return await this.userRepository.save(firstName, lastName);
  }

  @Post()
  post(): string {
    return "post";
  }

  @Get("/sample")
  get(): string {
    return "Get";
  }

  @Get("/sample-response")
  @HttpCode(200)
  @Header("Content-Type", "application/json")
  sampleResponse(): Record<string, string> {
    return {
      data: "Hello JSON",
    };
  }
  @Get("/redirect")
  @Redirect()
  redirect(): HttpRedirectResponse {
    return {
      url: "/api/users/sample-response",
      statusCode: 301,
    };
  }

  @Get("/:id")
  getId(@Param("id", ParseIntPipe) id: number): string {
    return `GET ${id}`;
  }
}
