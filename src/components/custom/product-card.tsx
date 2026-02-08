import { Minus, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

export default function ProductCard() {
  return (
    <Card>
      <CardContent className="space-y-2">
        <figure className="overflow-hidden rounded-lg">
          <img
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            alt="card"
          />
        </figure>

        <h2 className="font-semibold text-sm">Mini Do Choco 40g</h2>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-1">
        <p>₱56.00</p>

        <div className="flex items-center">
          <Button variant={"ghost"} className="rounded-full" size={"icon-sm"}>
            <Minus />
          </Button>
          <p>1</p>
          <Button variant={"ghost"} className="rounded-full" size={"icon-sm"}>
            <Plus />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
