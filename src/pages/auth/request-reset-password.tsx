import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function RequestChangePasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Request Submitted. Please check your email.");
      }
    } catch (error: any) {
      toast.error(error);
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
            <Button
              className="w-full bg-amber-600 text-white hover:bg-amber-700"
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : "Request Change Password"}
            </Button>
            <Link to={"/login"}>
              <Button className="w-full" variant={"outline"}>
                Back to Login
              </Button>
            </Link>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
