"use client";

import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

interface EditProfileButtonProps {
  username: string;
  classname?: string;
}

function EditProfileButton({ username, classname }: EditProfileButtonProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated || user?.username != username) {
    return null;
  }

  return (
    <Button onPress={() => router.push("/settings")} className={classname}>
      Edit Profile
    </Button>
  );
}

export default EditProfileButton;
