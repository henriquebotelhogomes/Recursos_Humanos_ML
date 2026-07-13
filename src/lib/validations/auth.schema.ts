import { z } from "zod";

// Permite email válido OU o identificador especial da conta demo ("demo123").
const emailOrDemo = z
  .string()
  .min(1, "Informe o email")
  .refine((v) => v === "demo123" || z.string().email().safeParse(v).success, {
    message: "Email inválido",
  });

export const loginSchema = z.object({
  email: emailOrDemo,
  password: z.string().min(1, "Informe a senha"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Informe seu nome"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
