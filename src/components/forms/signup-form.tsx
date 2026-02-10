import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormValues } from "@/db/schema/signup-schema";
import { Spinner } from "../ui/spinner";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const { register: signup } = useAuth();
  const navigate = useNavigate();

  async function onSubmit(values: SignupFormValues) {
    try {
      const data = await signup({
        email: values.email,
        password: values.password,
        name: values.name,
      });

      if (data) {
        navigate("/login?recentlyRegistered=true", { replace: true });
      }
    } catch (error: any) {
      toast.error(error?.message || "Unexpected error occurred");
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Enter your info below to create your account
                </p>
              </div>

              {/* Name */}
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...register("name")}
                />
                {errors.name?.message && (
                  <FieldDescription>{errors.name.message}</FieldDescription>
                )}
              </Field>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email?.message && (
                  <FieldDescription>{errors.email.message}</FieldDescription>
                )}
              </Field>

              {/* Password & Confirm Password */}
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      {...register("password")}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="confirmPassword">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...register("confirmPassword")}
                    />
                  </Field>
                </Field>

                {(errors.password?.message ||
                  errors.confirmPassword?.message) && (
                  <FieldDescription>
                    {errors.password?.message ||
                      errors.confirmPassword?.message}
                  </FieldDescription>
                )}
              </Field>

              {/* Submit Button */}
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Spinner /> : "Create Account"}
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card" />

              <FieldDescription className="text-center">
                Already have an account? <Link to={"/login"}>Sign In</Link>
              </FieldDescription>
            </FieldGroup>
          </form>

          {/* Right-side image */}
          <div className="bg-muted relative hidden md:block">
            <img
              src="https://picsum.photos/800/?blur=1"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      {/* Admin approval message */}
      <FieldDescription className="px-6 text-center">
        Your registration will be reviewed by an administrator. You'll be able
        to sign in once your account has been approved.
      </FieldDescription>
    </div>
  );
}
