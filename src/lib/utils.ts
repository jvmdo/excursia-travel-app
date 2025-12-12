import { AuthError } from "@supabase/supabase-js";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const authErrorMessages: Record<string, string> = {
  email_exists: "E-mail já foi cadastrado no sistema.",
  email_not_confirmed: "Confirme seu e-mail antes de entrar.",
  over_email_send_rate_limit:
    "Muitos e-mails de confirmação enviados. Tente novamente daqui a pouco.",
  over_request_rate_limit: "Muitas tentativas. Tente novamente daqui a pouco.",
  invalid_credentials: "E-mail ou senha incorretos.",
  request_timeout: "Serviço de login ocupado. Tente novamente daqui a pouco.",
  session_not_found:
    "Sessão de login não encontrada. Por favor, atualize a página",
  unexpected_failure: "Ocorreu um erro inesperado no serviço.",
  user_already_exists: "Usuário já existe no sistema.",
  user_not_found: "Usuário não encontrado.",
  weak_password: "A senha não atende aos requisitos.",
  default: "Erro inesperado na aplicação.",
};

export function translateSupabaseError(error: AuthError) {
  return (
    authErrorMessages[error?.code ?? "default"] ??
    "Erro inesperado na aplicação."
  );
}
