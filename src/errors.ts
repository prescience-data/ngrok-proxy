/**
 * Throws when a required environment variable is not set.
 */
export class NgrokAuthError extends Error {
  public override readonly name = "NgrokAuthError" as const
  public constructor(key: string) {
    super(`${key} environment variable is required`)
  }
}

/**
 * Throws when an invalid option is provided.
 */
export class InvalidOptionError extends Error {
  public override readonly name = "InvalidOptionError" as const
  public constructor(message: string) {
    super(message)
  }
}
