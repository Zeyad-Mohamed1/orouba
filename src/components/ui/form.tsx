import React from "react";
import { cn } from "@/lib/utils";

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {}

export const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, ...props }, ref) => {
    return <form ref={ref} className={cn("space-y-6", className)} {...props} />;
  }
);
Form.displayName = "Form";

export interface FormRowProps extends React.HTMLAttributes<HTMLDivElement> {}

export const FormRow = React.forwardRef<HTMLDivElement, FormRowProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("grid gap-6 md:grid-cols-2", className)}
        {...props}
      />
    );
  }
);
FormRow.displayName = "FormRow";

export interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  span?: "full" | number;
}

export const FormGroup = React.forwardRef<HTMLDivElement, FormGroupProps>(
  ({ className, span, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "space-y-2",
          span === "full" && "md:col-span-2",
          typeof span === "number" && `md:col-span-${span}`,
          className
        )}
        {...props}
      />
    );
  }
);
FormGroup.displayName = "FormGroup";

export interface FormLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn("block text-sm font-medium text-gray-700", className)}
        {...props}
      >
        {children}
      </label>
    );
  }
);
FormLabel.displayName = "FormLabel";

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  icon?: React.ReactNode;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, error, icon, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "block w-full rounded-md shadow-sm",
            icon ? "pl-10" : "px-3",
            "py-2",
            error
              ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
FormInput.displayName = "FormInput";

export interface FormHelperTextProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  error?: boolean;
}

export const FormHelperText = React.forwardRef<
  HTMLParagraphElement,
  FormHelperTextProps
>(({ className, error, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn(
        "mt-2 text-sm",
        error ? "text-red-600" : "text-gray-500",
        className
      )}
      {...props}
    />
  );
});
FormHelperText.displayName = "FormHelperText";

export interface FormActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const FormActions = React.forwardRef<HTMLDivElement, FormActionsProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-end gap-3 mt-8", className)}
        {...props}
      />
    );
  }
);
FormActions.displayName = "FormActions";

export interface FormSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
}

export const FormSection = React.forwardRef<HTMLDivElement, FormSectionProps>(
  ({ className, title, subtitle, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white rounded-lg border border-gray-200 p-6 mb-8",
          className
        )}
        {...props}
      >
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
        {children}
      </div>
    );
  }
);
FormSection.displayName = "FormSection";
