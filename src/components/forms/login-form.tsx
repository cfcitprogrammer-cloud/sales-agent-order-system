import { AlertCircle, GalleryVerticalEnd } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useState, type SubmitEvent } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [searchParams] = useSearchParams();
  const recentlyRegistered = searchParams.get("recentlyRegistered") === "true";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn, role } = useAuthStore();
  const navigate = useNavigate();

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn({ email, password });

      if (role) {
        alert(role);
        navigate("/", { replace: true });
      } else {
        toast.error(
          "Account is not approved yet. Please wait for administrator approval.",
        );
      }
    } catch (error: any) {
      toast.error(`${error?.message || error}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Sales Agent Order System</span>
            </a>
            <h1 className="text-xl font-bold">
              Welcome to Sales Agent Order System
            </h1>
            <FieldDescription>
              Don&apos;t have an account? <Link to="/register">Sign up</Link>
            </FieldDescription>

            {recentlyRegistered && (
              <Alert className="bg-green-300">
                <AlertCircle />
                <AlertTitle>Account Registered Successfully</AlertTitle>
                <AlertDescription>
                  Your account has been created and is awaiting administrator
                  approval.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>

          <Link
            to="/forgot-password"
            className="text-sm text-primary underline"
          >
            Forgot password?
          </Link>

          <Field>
            <Button type="submit" disabled={loading}>
              {loading ? <Spinner /> : "Login"}
            </Button>
          </Field>
        </FieldGroup>
      </form>

      <FieldDescription className="px-6 text-center">
        If your account is new, it may take a while for admin approval before
        you can log in.
      </FieldDescription>
    </div>
  );
}
