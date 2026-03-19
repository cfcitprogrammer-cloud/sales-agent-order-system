import Avatar from "boring-avatars";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuthStore } from "@/stores/auth-store";
import { Cog, LogOut } from "lucide-react";

export default function NavUser() {
  const { user, role, signOut } = useAuthStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="p-1 hover:bg-amber-500/20 rounded"
      >
        <div className="flex gap-2">
          <Avatar
            name={user?.email}
            colors={["#4d4250", "#b66e6f", "#cf8884", "#e6a972", "#f6d169"]}
            variant="beam"
            square
            size={32}
            className="rounded overflow-hidden"
          />

          <div>
            <p className="text-xs font-semibold">
              {user?.user_metadata.name || user?.email}
            </p>
            <p className="text-xs text-gray-500">{role}</p>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex gap-2">
              <Avatar
                name={user?.email}
                colors={["#4d4250", "#b66e6f", "#cf8884", "#e6a972", "#f6d169"]}
                variant="beam"
                square
                size={32}
                className="rounded overflow-hidden"
              />

              <div>
                <p className="text-xs font-semibold">
                  {user?.user_metadata.name || user?.email}
                </p>
                <p className="text-xs text-gray-500">{role}</p>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-xs" onClick={signOut}>
            <Cog /> Change Password
          </DropdownMenuItem>
          <DropdownMenuItem className="text-xs" onClick={signOut}>
            <LogOut /> Log Out
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs">
            Version 1.0.0
          </DropdownMenuLabel>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
