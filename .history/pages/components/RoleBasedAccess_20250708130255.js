// components/RoleBasedAccess.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { userAtom } from "@/recoil/userAtom";

export default function RoleBasedAccess({ allowedRoles, children }) {
  const router = useRouter();
  const user = useRecoilValue(userAtom);

  useEffect(() => {
    if (!user.role || !allowedRoles.includes(user.role)) {
      router.push("/"); // Redirect to home if not authorized
    }
  }, [user.role, allowedRoles, router]);

  if (!user.role || !allowedRoles.includes(user.role)) {
    return null; // Or a loading spinner
  }

  return children;
}
