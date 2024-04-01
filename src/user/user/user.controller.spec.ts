import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

// import * as httpMock from "node-mocks-http";

describe("UserController", () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      imports: [],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should can say hello", async () => {
    const response = await controller.sayHello("Trian", "Afiansyah");
    expect(response).toBe("Hello Trian Afiansyah");
  });

  it("should test with express req res", async () => {
    // const sampleResponse = await httpMock.createResponse({});
    const response = await controller.sampleResponse();
    expect(response.data).toEqual("Hello JSON");
  });
});
