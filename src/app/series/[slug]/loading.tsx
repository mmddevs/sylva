/* Squelette de la page série : mêmes proportions que le contenu réel, pour
   qu'aucun bloc ne saute à l'arrivée. Pulsation d'opacité, coupée en
   reduced motion. */
export default function Loading() {
  return (
    <main id="main" aria-busy="true" className="flex-1 pt-16">
      <div className="mx-auto w-full max-w-6xl px-6 pt-10 pb-section">
        <div className="h-11 w-40 animate-pulse rounded-full bg-muted motion-reduce:animate-none" />
        <div className="mt-6 aspect-3/2 animate-pulse rounded-sm bg-muted motion-reduce:animate-none sm:aspect-21/9" />
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          <div className="space-y-4">
            <div className="h-14 w-2/3 animate-pulse rounded-sm bg-muted motion-reduce:animate-none" />
            <div className="h-6 w-full max-w-xl animate-pulse rounded-sm bg-muted motion-reduce:animate-none" />
            <div className="h-6 w-4/5 max-w-xl animate-pulse rounded-sm bg-muted motion-reduce:animate-none" />
          </div>
          <div className="h-40 animate-pulse rounded-lg bg-muted motion-reduce:animate-none" />
        </div>
      </div>
    </main>
  );
}
