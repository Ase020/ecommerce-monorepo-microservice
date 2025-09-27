"use client";

import { UserButton } from "@clerk/nextjs";
import { ShoppingBag } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import React, { JSX } from "react";

function ProfileButton(): JSX.Element {
  const router: AppRouterInstance = useRouter();
  return (
    <UserButton>
      <UserButton.MenuItems>
        <UserButton.Action
          label="See Orders"
          labelIcon={<ShoppingBag className="size-4" />}
          onClick={() => router.push("/orders")}
        />
      </UserButton.MenuItems>
    </UserButton>
  );
}

export default ProfileButton;
