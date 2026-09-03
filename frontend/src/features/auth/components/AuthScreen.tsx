import { AuthFormCard } from "./AuthFormCard";
import { AuthHero } from "./AuthHero";

export function AuthScreen() {
  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden px-4 py-10">
      <span className="bg-primary border-border absolute -top-20 -left-20 size-72 rotate-12 rounded-[4rem] border-3" aria-hidden="true" />
      <span className="bg-secondary border-border absolute -right-24 -bottom-24 size-80 -rotate-12 rounded-full border-3" aria-hidden="true" />
      <div className="relative grid w-full max-w-5xl gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <AuthHero />
        <AuthFormCard />
      </div>
    </main>
  );
}
