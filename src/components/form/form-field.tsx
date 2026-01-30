"use client";

import { motion } from "framer-motion";
import { type FieldErrors, type UseFormReturn } from "react-hook-form";
import { type ContactFormData } from "@/types";

interface FormFieldProps {
  name: keyof ContactFormData;
  label: string;
  type?: string;
  form: UseFormReturn<ContactFormData>;
  errors: FieldErrors<ContactFormData>;
  focusedField: keyof ContactFormData | null;
  onFocus: (_field: keyof ContactFormData) => void;
  onBlur: () => void;
}

export function FormField({
  name,
  label,
  type = "text",
  form,
  errors,
  focusedField,
  onFocus,
  onBlur,
}: FormFieldProps) {
  return (
    <div className="relative">
      <input
        {...form.register(name)}
        type={type}
        id={name}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        onFocus={() => onFocus(name)}
        onBlur={onBlur}
        className={`w-full rounded-xl border bg-transparent px-4 py-3 pt-6 text-foreground transition-all duration-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${
          errors[name] ? "border-destructive" : "border-primary/10"
        }`}
      />
      <motion.label
        htmlFor={name}
        initial={false}
        animate={{
          y: focusedField === name || form.getValues()[name] ? -24 : 0,
          scale: focusedField === name || form.getValues()[name] ? 0.85 : 1,
        }}
        transition={{ duration: 0.2 }}
        className={`absolute left-4 origin-left cursor-text text-muted-foreground transition-colors ${
          focusedField === name ? "text-primary" : ""
        }`}
      >
        {label}
      </motion.label>

      {errors[name] && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-2 text-sm text-destructive"
        >
          {errors[name]?.message}
        </motion.p>
      )}
    </div>
  );
}
