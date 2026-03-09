"use client";

import { type FieldErrors, type UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type ContactFormData } from "@/types";

interface FormFieldProps {
  name: keyof Omit<ContactFormData, "website">;
  label: string;
  form: UseFormReturn<ContactFormData>;
  errors: FieldErrors<ContactFormData>;
  type?: string;
  fieldType?: "input" | "textarea";
  rows?: number;
  placeholder?: string;
}

export function FormField({
  name,
  label,
  form,
  errors,
  type = "text",
  fieldType = "input",
  rows = 6,
  placeholder,
}: FormFieldProps) {
  const error = errors[name]?.message;
  const sharedProps = {
    id: name,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${name}-error` : undefined,
    placeholder,
    ...form.register(name),
  };

  return (
    <div className="space-y-2.5">
      <label
        htmlFor={name}
        className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground"
      >
        {label}
      </label>

      {fieldType === "textarea" ? (
        <Textarea {...sharedProps} rows={rows} />
      ) : (
        <Input {...sharedProps} type={type} />
      )}

      {error ? (
        <p id={`${name}-error`} className="text-sm text-destructive">
          {String(error)}
        </p>
      ) : null}
    </div>
  );
}
