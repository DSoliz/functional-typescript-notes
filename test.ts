type EnsureCorrectEnum<T extends { [K in Exclude<keyof T, number>]: K }> = true

const SOME_CONST = {
  some: 'some',
} as const
type TEST_SOME_CONST = EnsureCorrectEnum<typeof SOME_CONST>

