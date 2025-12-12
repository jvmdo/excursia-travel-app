"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { translateSupabaseError } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

const SignInFormSchema = z.object({
  email: z.email({ error: "Formato inválido" }),
  password: z.string().min(6, { error: "Insira pelo menos 6 dígitos" }),
});

type SignInFormValues = z.infer<typeof SignInFormSchema>;

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: SignInFormValues) => {
    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
      toast.error("Falha ao acessar", {
        description: translateSupabaseError(error),
      });
      return;
    }

    router.push("/criar-roteiro");
  };

  return (
    <div className="min-h-screen p-6 grid place-items-center bg-linear-to-br from-sky-500 via-cyan-400 to-purple-400">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="text-center">
          <span className="text-4xl animate-float">🌍</span>
          <CardTitle className="text-2xl">Entrar</CardTitle>
          <CardDescription>
            Entre com seu email para acessar{" "}
            <span className="font-semibold text-purple-500">TravelApp</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleLogin)}>
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
                        autoComplete="off"
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
                  {formState.isSubmitting ? "Acessando..." : "Entrar"}
                </Button>
                <FieldDescription className="text-center">
                  Não tem uma conta?{" "}
                  <Link
                    href="/auth/sign-up"
                    className="text-sky-600 hover:text-sky-500!"
                  >
                    Criar conta
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
