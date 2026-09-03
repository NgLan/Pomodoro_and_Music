import { AuthGate } from "@/features/auth/components/AuthGate";
import { PomodoroWorkspace } from "@/features/pomodoro/components/PomodoroWorkspace";

export default function HomePage() {
  return (
    <AuthGate>
      <PomodoroWorkspace />
    </AuthGate>
  );
}
