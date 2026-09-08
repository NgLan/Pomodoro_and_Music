import { AuthGate } from "@/features/auth/components/AuthGate";
import { PlaylistDetail } from "@/features/playlist/components/PlaylistDetail";

interface PlaylistDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PlaylistDetailPage({
  params,
}: PlaylistDetailPageProps) {
  const { id } = await params;
  return (
    <AuthGate>
      <PlaylistDetail id={id} />
    </AuthGate>
  );
}
