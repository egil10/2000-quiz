import { Suspense } from "react";
import PlayClient from "./PlayClient";

export const dynamic = "force-dynamic";

export default function PlayPage() {
  return (
    <Suspense fallback={<div className="container-narrow py-20 text-center text-mute">Laster spill...</div>}>
      <PlayClient />
    </Suspense>
  );
}
