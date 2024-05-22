import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(1, { message: "Username must be greater than 1 characters!" }),
    email: z
      .string()
      .min(1, { message: "Email must be greater than 1 characters!" }),
    password: z
      .string({ description: "Password is required" })
      .min(8, { message: "Password must be greater than 8 characters!" }),
    role: z
      .string()
      .min(1, { message: "Role must be greater than 1 characters!" })
      .refine(
        (value) =>
          value === "admin" || value === "customer" || value === "manager",
        {
          message: "Role must be a valid role!",
        }
      ),
  }),
});

export type createUserType = z.infer<typeof createUserSchema>;
