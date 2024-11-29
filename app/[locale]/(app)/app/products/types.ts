import { Control, FieldValues } from "react-hook-form";

export interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  isDisabled?: boolean;
  form: Record<string, unknown>;
}
