import { AuthGate } from "@/features/auth/components/AuthGate";
import { PlaylistLibrary } from "@/features/playlist/components/PlaylistLibrary";

export default function PlaylistsPage() {
  return (
    <AuthGate>
      <PlaylistLibrary />
    </AuthGate>
  );
}
