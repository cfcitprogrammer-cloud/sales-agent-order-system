import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <section className="h-screen flex justify-center items-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Sales Agent Order System</CardTitle>
          <CardDescription>Login to access your account</CardDescription>
        </CardHeader>

        <CardContent>
          <form action="" className="space-y-2">
            <div>
              <Label className="font-semibold mt-1 text-sm">Email</Label>
              <Input type="email" placeholder="m@example.com" />
            </div>

            <div>
              <Label className="font-semibold mt-1 text-sm">Password</Label>
              <Input type="password" placeholder="******" />
            </div>

            <Button className="w-full" size={"sm"}>
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
