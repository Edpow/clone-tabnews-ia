import Confetti from "./confetti";

const TABNEWS_API_URL = "https://api.tabnews.com.br/v1/contents?page=1&per_page=1";
const TABNEWS_URL = "https://www.tabnews.com.br";

// Garante leitura da API a cada acesso (renderização por request).
export const dynamic = "force-dynamic";

async function getPublishedTotal(): Promise<number | null> {
  try {
    const response = await fetch(TABNEWS_API_URL, { cache: "no-store" });
    if (!response.ok) return null;

    const total = response.headers.get("x-pagination-total-rows");
    if (!total) return null;

    const parsed = Number(total);
    return Number.isFinite(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export default async function Home() {
  const total = await getPublishedTotal();

  return (
    <main className="construction">
      <Confetti />

      <section className="card">
        <p className="badge">🚧 Página em Construção</p>

        <h1 className="phrase">
          Estamos neste exato momento reconstruindo o TabNews, um lugar na
          internet para quem trabalha com tecnologia e precisa de conteúdos,
          com valor concreto
        </h1>

        <p className="total">
          Total de trabalhos publicados no TabNews:{" "}
          <strong>
            {total === null ? "não foi possível carregar" : total.toLocaleString("pt-BR")}
          </strong>
        </p>

        <a className="official-link" href={TABNEWS_URL} target="_blank" rel="noreferrer">
          Conheça o site oficial: tabnews.com.br ↗
        </a>
      </section>
    </main>
  );
}
