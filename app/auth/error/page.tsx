import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-sky-500 via-cyan-400 to-orange-400 p-6">
      <div className="w-full max-w-sm">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="text-4xl mb-2">😕</div>
            <CardTitle className="text-2xl">Algo deu errado</CardTitle>
          </CardHeader>
          <CardContent>
            {params?.error ? (
              <p className="text-sm text-muted-foreground text-center">Código do erro: {params.error}</p>
            ) : (
              <p className="text-sm text-muted-foreground text-center">Ocorreu um erro não especificado.</p>
            )}
            <div className="mt-4 text-center">
              <Link href="/auth/login" className="text-sm underline underline-offset-4 text-sky-600">
                Voltar para o login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
