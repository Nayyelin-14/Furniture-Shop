import { z } from "zod";

export const authSchema = z.object({
  phone: z
    .string()
    .min(7, "Phone number is too short")
    .max(12, "Phone number is too long")
    .regex(/^\d+$/, "Phone number must be a number"),
  password: z
    .string()
    .min(8, "Password must be 8 digit")
    .max(8, "Password must be 8 digit")
    .regex(/^\d+$/, "Password  must be a number"),

  // /.../: Delimiters for the regular expression.
  // ^: Anchors the match to the start of the string.
  // \d: Matches any digit (equivalent to [0-9]).
  // +: Means "one or more" of the preceding token (\d in this case).
  // $: Anchors the match to the end of the string.
});

export const registerSchema = z.object({
  phone: z
    .string()
    .min(7, "Phone number is too short")
    .max(12, "Phone number is too long")
    .regex(/^\d+$/, "Phone number must be a number"),
});

export const confirmPwdSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be 8 digit")
    .max(8, "Password must be 8 digit")
    .regex(/^\d+$/, "Password  must be a number"),
  confirmPassword: z
    .string()
    .min(8, "Password must be 8 digit")
    .max(8, "Password must be 8 digit")
    .regex(/^\d+$/, "Password  must be a number"),
});
