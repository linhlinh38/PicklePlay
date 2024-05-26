import { z } from "zod";

const regexPhoneNumber = /(0[3|5|7|8|9])+([0-9]{8})\b/g;

export const createUserSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(1, { message: "Username must be greater than 1 characters!" }),
    email: z
      .string()
      .min(1, { message: "Email must be greater than 1 characters!" })
      .email("This is not a valid email."),
    password: z
      .string({ description: "Password is required" })
      .min(8, { message: "Password must be greater than 8 characters!" }),
    role: z
      .string()
      .min(1, { message: "Role must be greater than 1 characters!" })
      .refine(
        (value) =>
          value === "admin" ||
          value === "customer" ||
          value === "manager" ||
          value === "operator",
        {
          message: "Role must be a valid role!",
        }
      ),
    gender: z
      .string()
      .min(1, { message: "Gender must be greater than 1 characters!" })
      .refine(
        (value) => value === "other" || value === "male" || value === "female",
        {
          message: "Gender must be Male/Female/Other!",
        }
      ),
    firstname: z
      .string()
      .min(1, { message: "First name must be greater than 1 characters!" }),
    lastname: z
      .string()
      .min(1, { message: "Last Name must be greater than 1 characters!" }),
    phone: z
      .string()
      .min(1, { message: "Phone must be greater than 1 number!" })
      .max(10, { message: "Phone must be less than 10 number!" })
      .regex(regexPhoneNumber, { message: "Phone must be a valid phone" }),
  }),
});

export type createUserType = z.infer<typeof createUserSchema>;
