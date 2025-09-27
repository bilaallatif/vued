export type Result<T, E = undefined> =
  | { ok: true; value: T }
  | { ok: false; error: E | undefined };

export const OK = <T>(data: T): Result<T | never> => ({
  ok: true,
  value: data,
});
export const ERR = <E>(error?: E): Result<never, E> => ({
  ok: false,
  error: error,
});

export enum DatabaseError {
  NOT_FOUND = "NOT_FOUND",
  NOT_CREATED = "NOT_CREATED",
  COLLISION = "COLLISION",
}
