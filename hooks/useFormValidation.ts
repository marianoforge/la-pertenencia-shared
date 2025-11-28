import { useState } from "react";

type ValidationRules<T> = {
  [K in keyof T]?: {
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: T[K]) => string | null;
    message?: string;
  };
};

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  rules: ValidationRules<T>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = (field: keyof T, value: any): string | null => {
    const fieldRules = rules[field];
    if (!fieldRules) return null;

    if (fieldRules.required) {
      if (value === undefined || value === null || value === "") {
        return fieldRules.message || `El campo ${String(field)} es requerido`;
      }
      if (Array.isArray(value) && value.length === 0) {
        return fieldRules.message || `Debe seleccionar al menos un ${String(field)}`;
      }
    }

    if (typeof value === "number") {
      if (fieldRules.min !== undefined && value < fieldRules.min) {
        return `El valor debe ser mayor o igual a ${fieldRules.min}`;
      }
      if (fieldRules.max !== undefined && value > fieldRules.max) {
        return `El valor debe ser menor o igual a ${fieldRules.max}`;
      }
    }

    if (typeof value === "string") {
      if (fieldRules.minLength !== undefined && value.length < fieldRules.minLength) {
        return `Debe tener al menos ${fieldRules.minLength} caracteres`;
      }
      if (fieldRules.maxLength !== undefined && value.length > fieldRules.maxLength) {
        return `Debe tener máximo ${fieldRules.maxLength} caracteres`;
      }
    }

    if (fieldRules.pattern && typeof value === "string" && !fieldRules.pattern.test(value)) {
      return fieldRules.message || "Formato inválido";
    }

    if (fieldRules.custom) {
      return fieldRules.custom(value);
    }

    return null;
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};

    (Object.keys(rules) as Array<keyof T>).forEach((field) => {
      const error = validateField(field, values[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const setValue = (field: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const setFieldTouched = (field: keyof T) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const reset = (newValues?: T) => {
    setValues(newValues || initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    setValues,
    setValue,
    setFieldTouched,
    validate,
    reset,
    isValid: Object.keys(errors).length === 0,
  };
}

