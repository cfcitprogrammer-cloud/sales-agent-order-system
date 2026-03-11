import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (password != confirmPassword) {
        throw Error("Password did not match");
      }

      if (error) {
        toast.error(error.message);
      } else {
        navigate("/login", { replace: true });
      }
    } catch (error: any) {
      if (error.message) {
        toast.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="h-screen w-screen flex justify-center items-center p-2">
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-2">
            <h1 className="text-lg font-semibold">Change Password</h1>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button className="w-full" disabled={isLoading}>
              {isLoading ? <Spinner /> : "Request Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
