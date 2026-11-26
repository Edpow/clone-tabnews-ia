import { Suspense } from "react";
import ConfettiLazy from "./confetti-lazy";

const TABNEWS_API_URL =
  process.env.TABNEWS_API_URL ??
  "https://api.tabnews.com.br/v1/contents?page=1&per_page=1";
const TABNEWS_URL = "https://www.tabnews.com.br";

// O total muda devagar: 60s de Data Cache evitam bater na API a cada acesso.
const TOTAL_REVALIDATE_SECONDS = 60;
// Sem timeout, uma API lenta pendura o render (e o request) indefinidamente.
const TOTAL_TIMEOUT_MS = 5000;

// Renderiza por request, mas transmite o shell antes de esperar a API.
export const dynamic = "force-dynamic";

async function getPublishedTotal(): Promise<number | null> {
  try {
    const response = await fetch(TABNEWS_API_URL, {
      next: { revalidate: TOTAL_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(TOTAL_TIMEOUT_MS),
    });
    if (!response.ok) return null;

    const total = response.headers.get("x-pagination-total-rows");
    if (!total) return null;

    const parsed = Number(total);
    return Number.isFinite(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

async function PublishedTotal() {
  const total = await getPublishedTotal();

  return (
    <p className="total">
      Total de trabalhos publicados no TabNews:{" "}
      <strong>
        {total === null
          ? "não foi possível carregar"
          : total.toLocaleString("pt-BR")}
      </strong>
    </p>
  );
}

function TotalFallback() {
  return (
    <p className="total" aria-busy="true">
      Total de trabalhos publicados no TabNews:{" "}
      <span className="total-skeleton" aria-hidden="true" />
    </p>
  );
}

export default function Home() {
  return (
    <main className="construction">
      <ConfettiLazy />

      <section className="card">
        <p className="badge">🚧 Página em Construção</p>

        <h1 className="phrase">
          Estamos neste exato momento reconstruindo o TabNews, um lugar na
          internet para quem trabalha com tecnologia e precisa de conteúdos, com
          valor concreto
        </h1>

        <Suspense fallback={<TotalFallback />}>
          <PublishedTotal />
        </Suspense>

        <a
          className="official-link"
          href={TABNEWS_URL}
          target="_blank"
          rel="noreferrer"
        >
          Conheça o site oficial: tabnews.com.br ↗
        </a>
      </section>
    </main>
  );
}
