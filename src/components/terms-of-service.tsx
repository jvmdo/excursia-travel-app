"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function TermsOfService() {
  return (
    <Dialog>
      <DialogTrigger className="underline cursor-pointer">
        Termos de Serviço
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-scroll">
        <DialogHeader className="space-y-4 pb-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-center text-3xl font-bold">
            Termos de Uso e EULA
          </DialogTitle>
          <DialogDescription className="text-base text-center ">
            Por favor, leia atentamente antes de usar o aplicativo
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-100 rounded-lg border-2 px-6 py-2 bg-muted/30">
          <div className="space-y-6 text-sm leading-relaxed">
            <section>
              <h3 className="text-lg font-bold text-primary mb-3">
                1. ACEITAÇÃO DOS TERMOS
              </h3>
              <p className="text-muted-foreground">
                Ao utilizar o aplicativo da Excursia Viagens
                (&ldquo;Aplicativo&ldquo;), você concorda em estar vinculado a
                estes Termos de Uso. Se você não concordar com estes termos, não
                utilize o Aplicativo.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-primary mb-3">
                2. DESCRIÇÃO DO SERVIÇO
              </h3>
              <article className="text-muted-foreground">
                <p>O Aplicativo permite que usuários:</p>
                <ol>
                  <li>
                    1. Instruam uma ferramenta de Inteligência Artificial a
                    gerar roteiros de viagens;
                  </li>
                  <li>
                    2. Conversem com um assistente de IA para tirar dúvidas
                    sobre viagens;
                  </li>
                  <li>3. Criem álbuns de fotos de suas viagens;</li>
                  <li>4. Exportem álbuns em formato PDF;</li>
                  <li>
                    5. Armazenem álbuns exportados em um serviço em nuvem.
                  </li>
                  Todos os serviços são fornecido &ldquo;como está&ldquo; e
                  podem ser modificados ou descontinuados a qualquer momento.
                </ol>
              </article>
            </section>

            <section>
              <h3 className="text-lg font-bold text-primary mb-3">
                3. PROPRIEDADE DO CONTEÚDO
              </h3>
              <p className="text-muted-foreground mb-3">
                Você mantém todos os direitos sobre as fotos e conteúdos que
                envia para o Aplicativo. Ao fazer upload de conteúdo, você
                concede à Excursia Viagens uma licença não exclusiva para
                armazenar, processar e exibir este conteúdo com o único
                propósito de fornecer os serviços do Aplicativo.
              </p>
              <p className="text-muted-foreground">
                Você é responsável por garantir que possui os direitos
                necessários sobre todo o conteúdo que envia.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-destructive mb-3">
                4. ISENÇÃO DE RESPONSABILIDADE SOBRE INFORMAÇÕES
              </h3>
              <div className="bg-destructive/10 border-2 border-destructive/30 rounded-lg p-4 space-y-2">
                <p className="font-semibold text-destructive">IMPORTANTE:</p>
                <p className="text-muted-foreground">
                  Todas as informações, dados, sugestões ou conteúdos gerados ou
                  fornecidos pelo Aplicativo são baseados em dados obtidos da
                  internet e de fontes públicas. A Excursia Viagens NÃO se
                  responsabiliza por:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-muted-foreground">
                  <li>
                    Erros, imprecisões ou omissões nas informações fornecidas;
                  </li>
                  <li>
                    Danos diretos ou indiretos resultantes do uso dessas
                    informações;
                  </li>
                  <li>Falta ou ausência de informações específicas;</li>
                  <li>
                    Decisões tomadas com base nas informações do Aplicativo.
                  </li>
                </ul>
                <p className="text-muted-foreground font-semibold mt-3">
                  O usuário utiliza todas as informações e recursos do
                  Aplicativo por sua própria conta e risco.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-primary mb-3">
                5. USO PERMITIDO
              </h3>
              <p className="text-muted-foreground mb-2">Você concorda em:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-muted-foreground">
                <li>Usar o Aplicativo apenas para fins pessoais e legais;</li>
                <li>
                  Não fazer upload de conteúdo ilegal, ofensivo ou que viole
                  direitos de terceiros;
                </li>
                <li>
                  Não tentar acessar áreas restritas do sistema ou de outros
                  usuários;
                </li>
                <li>
                  Não usar o Aplicativo para qualquer propósito comercial não
                  autorizado;
                </li>
                <li>Manter suas credenciais de acesso em sigilo.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-primary mb-3">
                6. PRIVACIDADE E DADOS PESSOAIS
              </h3>
              <p className="text-muted-foreground">
                Seus dados pessoais e fotos são armazenados de forma segura e
                não serão compartilhados com terceiros sem seu consentimento,
                exceto quando exigido por lei. Utilizamos as informações apenas
                para fornecer e melhorar nossos serviços.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-primary mb-3">
                7. ARMAZENAMENTO E BACKUP
              </h3>
              <p className="text-muted-foreground">
                Embora façamos esforços para manter seus dados seguros,
                recomendamos que você mantenha cópias de backup de suas fotos
                importantes. Não garantimos armazenamento ilimitado ou
                permanente.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-destructive mb-3">
                8. LIMITAÇÃO DE RESPONSABILIDADE
              </h3>
              <div className="bg-destructive/10 border-2 border-destructive/30 rounded-lg p-4 space-y-2">
                <p className="text-muted-foreground font-semibold">
                  A EXCURSIA VIAGENS E O APLICATIVO NÃO SE RESPONSABILIZAM POR:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-muted-foreground">
                  <li>
                    Perda de dados, fotos ou conteúdos por qualquer motivo;
                  </li>
                  <li>
                    Interrupções, falhas técnicas ou indisponibilidade do
                    serviço;
                  </li>
                  <li>
                    Uso inadequado ou não autorizado de sua conta por terceiros;
                  </li>
                  <li>
                    Danos causados por vírus, malware ou outros problemas
                    técnicos;
                  </li>
                  <li>
                    Consequências de decisões tomadas com base em informações do
                    Aplicativo;
                  </li>
                  <li>
                    Qualquer uso que você faça do Aplicativo e seus resultados.
                  </li>
                </ul>
                <p className="text-muted-foreground font-semibold mt-3">
                  O USUÁRIO É TOTALMENTE RESPONSÁVEL PELO USO DO APLICATIVO E
                  SUAS CONSEQUÊNCIAS.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-primary mb-3">
                9. MODIFICAÇÕES DO SERVIÇO
              </h3>
              <p className="text-muted-foreground">
                Reservamos o direito de modificar, suspender ou descontinuar
                qualquer aspecto do Aplicativo a qualquer momento, com ou sem
                aviso prévio. Não seremos responsáveis por quaisquer
                modificações, suspensões ou descontinuações do serviço.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-primary mb-3">
                10. MODIFICAÇÕES DOS TERMOS
              </h3>
              <p className="text-muted-foreground">
                Podemos atualizar estes Termos de Uso periodicamente.
                Continuando a usar o Aplicativo após as alterações, você aceita
                os novos termos. Recomendamos revisar estes termos regularmente.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-primary mb-3">
                11. RESCISÃO
              </h3>
              <p className="text-muted-foreground">
                Podemos suspender ou encerrar seu acesso ao Aplicativo a
                qualquer momento, sem aviso prévio, por violação destes termos
                ou por qualquer outro motivo. Você pode encerrar sua conta a
                qualquer momento.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-primary mb-3">
                12. LEI APLICÁVEL
              </h3>
              <p className="text-muted-foreground">
                Estes Termos são regidos pelas leis brasileiras. Qualquer
                disputa será resolvida nos tribunais competentes do Brasil.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-primary mb-3">
                13. CONTATO
              </h3>
              <p className="text-muted-foreground">
                Para dúvidas sobre estes Termos de Uso, entre em contato com a
                Excursia Viagens através dos canais oficiais da empresa.
              </p>
            </section>

            <section className="pt-4 border-t-2">
              <p className="text-xs text-muted-foreground text-center">
                Última atualização:{" "}
                {new Date(1766116281459).toLocaleDateString("pt-BR")}
                <br />
                Excursia Viagens - Todos os direitos reservados
              </p>
            </section>
          </div>
        </ScrollArea>

        <div className="space-y-4">
          <div className="space-x-3 p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
            <p className="text-sm font-medium leading-relaxed">
              Li e aceito os Termos de Uso e EULA. Entendo que a Excursia
              Viagens não se responsabiliza por erros nas informações fornecidas
              pelo aplicativo nem pelo uso que faço do mesmo.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
