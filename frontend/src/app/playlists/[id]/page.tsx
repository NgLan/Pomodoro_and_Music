import { AuthGate } from "@/features/auth/components/AuthGate";
import { PlaylistDetail } from "@/features/playlist/components/PlaylistDetail";

export default async function PlaylistDetailPage({
  params,
}: PageProps<"/playlists/[id]">) {
  const { id } = await params;
  return (
    <AuthGate>
      <PlaylistDetail id={id} />
    </AuthGate>
  );
}
