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
        toast.success(
          "Password reset successful! Please log in with your new password.",
        );
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <h1 className="text-lg font-semibold">Change Password</h1>
            <Label>New Password</Label>
            <Input
              type="password"
              placeholder="Enter your new password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Label>Confirm New Password</Label>
            <Input
              type="password"
              placeholder="Confirm your new password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              size={"sm"}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
