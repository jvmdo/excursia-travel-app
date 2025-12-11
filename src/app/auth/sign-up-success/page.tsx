import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-linear-to-br from-sky-500 via-cyan-400 to-purple-400 p-6">
      <div className="w-full max-w-sm">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="text-4xl mb-2">✉️</div>
            <CardTitle className="text-2xl">
              Conta criada com sucesso!
            </CardTitle>
            <CardDescription>
              Verifique seu email para confirmar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              Você criou sua conta com sucesso. Por favor, verifique seu email
              para confirmar sua conta antes de entrar.
            </p>
            <div className="mt-4 text-center">
              <Link
                href="/auth/login"
                className="text-sm underline underline-offset-4 text-sky-600"
              >
                Voltar para o login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
