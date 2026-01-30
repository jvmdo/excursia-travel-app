"use client";

import { TermsOfService } from "@/components/terms-of-service";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { createClient } from "@/lib/supabase/client";
import { translateSupabaseError } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const SUPABASE_REDIRECT_URL =
  process.env.NEXT_PUBLIC_APP_URL || `${window.location.origin}/criar-roteiro`;

const SignUpFormSchema = z
  .object({
    email: z.email({ error: "Formato inválido" }),
    password: z.string().min(6, { error: "Insira pelo menos 6 dígitos" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas devem ser iguais",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof SignUpFormSchema>;

export default function SignUpPage() {
  const supabase = createClient();
  const router = useRouter();
  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSignUp = async (data: SignUpFormValues) => {
    const { count, error: errorCustomer } = await supabase
      .from("customers")
      .select("*", { count: "exact", head: true })
      .ilike("email", data.email);

    if (errorCustomer) {
      console.log(errorCustomer);
      toast.error("Falha ao buscar email inserido");
      return;
    }

    if (count === 0) {
      toast.warning("Email não reconhecido", {
        description: "Registre com o mesmo email usado na compra do app",
      });
      return;
    }

    const { error } = await supabase.auth.signUp({
      ...data,
      options: {
        emailRedirectTo: SUPABASE_REDIRECT_URL,
      },
    });

    if (error) {
      console.log(error);
      toast.error("Falha ao criar conta", {
        description: translateSupabaseError(error),
      });
      return;
    }

    toast.success("Conta criada com sucesso!", {
      description:
        "Verifique seu email para confirmar sua conta antes de entrar.",
      action: {
        label: "Entrar",
        onClick: () => router.push("/auth/login"),
      },
    });
  };

  return (
    <div className="min-h-screen p-6 grid place-items-center bg-linear-to-br from-sky-500 via-cyan-400 to-purple-400">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="text-center">
          <div className="text-4xl mb-2 animate-float">🌍</div>
          <CardTitle className="text-2xl">Criar Conta</CardTitle>
          <CardDescription>Crie sua conta para começar</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(handleSignUp)}>
            <FieldGroup>
              <Controller
                control={control}
                name="email"
                render={({ field, fieldState }) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              />

              <Controller
                control={control}
                name="password"
                render={({ field, fieldState }) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor="password">Senha</FieldLabel>
                      <Input
                        {...field}
                        id="password"
                        type="password"
                        placeholder="******"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              />

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field, fieldState }) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor="confirmPassword">
                        Confirmar senha
                      </FieldLabel>
                      <Input
                        {...field}
                        id="confirmPassword"
                        type="password"
                        placeholder="******"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              />

              <Field>
                <Button
                  disabled={formState.isSubmitting}
                  className="w-full bg-blue-500 hover:bg-blue-700 cursor-pointer"
                >
                  {formState.isSubmitting && <Spinner />}
                  {formState.isSubmitting ? "Criando..." : "Criar Conta"}
                </Button>

                <FieldDescription className="text-center">
                  Já tem uma conta?{" "}
                  <Link
                    href="/auth/login"
                    className="text-sky-600 hover:text-sky-500!"
                  >
                    Entrar
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter>
          <div className="text-center text-gray-400 text-sm">
            Ao clicar em continuar, você concorda com os nossos{" "}
            <TermsOfService />.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
