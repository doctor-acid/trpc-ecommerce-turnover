import { ZodError } from "zod"

export function assertIsError(err: unknown): asserts err is Error{
    if(!(err instanceof Error)){
        throw err
    }
}

export function assertIsZodError(err: unknown): asserts err is ZodError{
    if(!(err instanceof ZodError)){
        throw err as ZodError
    }
}