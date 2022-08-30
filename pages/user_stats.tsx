import { useRouter } from "next/router";
import React from "react";

function UserStats() {
  const router = useRouter();
  const { email } = router.query as { email: string };
  return (
    <div>
      UserStats
      <p>My Email is {email}</p>
    </div>
  );
}

export default UserStats;
