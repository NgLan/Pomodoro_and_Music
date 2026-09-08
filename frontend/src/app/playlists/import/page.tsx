import { AuthGate } from "@/features/auth/components/AuthGate";
import { YoutubeImportWorkspace } from "@/features/youtube-import/components/YoutubeImportWorkspace";

export default function ImportPlaylistPage() {
  return (
    <AuthGate>
      <YoutubeImportWorkspace />
    </AuthGate>
  );
}
