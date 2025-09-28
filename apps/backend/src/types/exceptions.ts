export class HttpError extends Error {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export class Rollback extends Error {
  constructor() {
    super("ROLLBACK_ONLY");
  }
}
