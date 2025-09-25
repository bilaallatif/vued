import { Get, Route } from "tsoa";
import { injectable } from "inversify";

@injectable()
@Route("test/")
export class TestController {
  @Get()
  public test(): string {
    return "Hello World!";
  }
}
