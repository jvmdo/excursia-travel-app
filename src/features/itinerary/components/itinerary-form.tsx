"use client";

import { useEffect, useEffectEvent, useRef } from "react";

import { ItineraryData } from "@/app/api/generate-itinerary/route";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { generateItinerary } from "@/features/itinerary/api/generate-itinerary";
import AnnButton from "@/features/itinerary/components/ann-button";
import { PreferencesTemplates } from "@/features/itinerary/components/template-selector";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const ItineraryFormSchema = z.object({
  days: z.coerce
    .number<number>()
    .positive({ error: "Informe um número entre 1 e 10" })
    .min(1, { error: "Mínimo: 1 dia" })
    .max(10, { error: "Máximo: 10 dias" }),
  destination: z.string().min(2, { error: "Informe um destino válido" }),
  preferences: z.string().max(60).optional(),
});

export type ItineraryFormValues = z.infer<typeof ItineraryFormSchema>;

interface ItineraryFormProps {
  setItinerary: (itinerary: ItineraryData) => void;
  saveItinerary: (itinerary: ItineraryData) => void;
}

export function ItineraryForm({
  setItinerary,
  saveItinerary,
}: ItineraryFormProps) {
  const { handleSubmit, control, formState, reset, setError, clearErrors } =
    useForm({
      resolver: zodResolver(ItineraryFormSchema),
      defaultValues: {
        days: 0,
        destination: "",
        preferences: "",
      },
    });
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const handleGenerateItinerary = async (data: ItineraryFormValues) => {
    try {
      const newItinerary = await generateItinerary(data);
      setItinerary(newItinerary);
      saveItinerary(newItinerary);
    } catch (err) {
      // 3 attempts
      if (formState.submitCount >= 2) {
        toast.error((err as Error).message, { position: "top-right" });
      }
      setError("root.api", { type: "API Error" });
    }
  };

  const { isSubmitSuccessful } = formState;
  const resetForm = useEffectEvent(() => reset());
  useEffect(() => {
    setTimeout(() => resetForm(), 5000);
  }, [isSubmitSuccessful]);

  const status = formState.errors.root?.api
    ? "error"
    : formState.isSubmitSuccessful
    ? "success"
    : formState.isSubmitting
    ? "processing"
    : "idle";

  useEffect(() => {
    if (status === "success") {
      btnRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [status, btnRef]);

  const clearFormApiError = () => {
    if (status === "error") {
      clearErrors("root");
    }
  };

  return (
    <Card className="gap-4 mb-4">
      <CardTitle className="px-4 text-lg font-bold">
        🎯 Detalhes do Roteiro
      </CardTitle>

      <CardContent className="px-4">
        <form
          onSubmit={handleSubmit(handleGenerateItinerary)}
          noValidate={true}
        >
          <FieldGroup className="flex flex-col gap-4">
            <Controller
              name="destination"
              control={control}
              render={({ field, fieldState }) => (
                <Field className="gap-0.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-destination">Destino</FieldLabel>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ls">
                      ✈️
                    </span>
                    <Input
                      {...field}
                      id="form-destination"
                      className="pl-10 text-sm"
                      placeholder="Porto de galinhas em Ipojuca, Pernambuco"
                      autoComplete="off"
                      aria-invalid={fieldState.invalid}
                      onChange={(e) => {
                        field.onChange(e);
                        clearFormApiError();
                      }}
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="days"
              control={control}
              render={({ field, fieldState }) => (
                <Field className="gap-0.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-days">Dias</FieldLabel>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ls">
                      📅
                    </span>
                    <Input
                      {...field}
                      id="form-days"
                      type="number"
                      min={1}
                      max={10}
                      className="pl-10 text-sm"
                      placeholder="Quantos dias de viagem? Ex.: 5"
                      autoComplete="off"
                      aria-invalid={fieldState.invalid}
                      value={field.value || ""} // Make sure placeholder is shown
                      onChange={(e) => {
                        field.onChange(e);
                        clearFormApiError();
                      }}
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="preferences"
              control={control}
              render={({ field, fieldState }) => (
                <Field className="gap-0.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-preferences">
                    Preferências (opcional)
                  </FieldLabel>
                  <InputGroup className="relative">
                    <InputGroupText className="absolute left-3 top-3 text-lg">
                      🧭
                    </InputGroupText>
                    <InputGroupTextarea
                      {...field}
                      id="form-preferences"
                      className="min-h-24 resize-none text-sm pl-10"
                      placeholder="Escreva suas preferências ou selecione dentre as pré-definidas abaixo"
                      rows={3}
                      maxLength={60}
                      aria-invalid={fieldState.invalid}
                      onChange={(e) => {
                        field.onChange(e);
                        clearFormApiError();
                      }}
                    />
                    {field.value && (
                      <InputGroupText
                        className={cn(
                          "tabular-nums text-xs absolute right-3 bottom-3",
                          field.value.length >= 60 && "text-red-500"
                        )}
                      >
                        {field.value.length}/60
                      </InputGroupText>
                    )}
                  </InputGroup>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}

                  <PreferencesTemplates onSelect={field.onChange} />
                </Field>
              )}
            />
          </FieldGroup>

          <AnnButton ref={btnRef} status={status} />
        </form>
      </CardContent>
    </Card>
  );
}
