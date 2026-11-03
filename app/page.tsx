import ListaNomes, { type Nome } from "./components/ListaNomes";

const names: Nome[] = [
  { nome: "Edgar" },
  { nome: "Rita" },
  { nome: "Ryan", pronuncia: "Rian" },
  { nome: "Ellen", pronuncia: "Élen" },
];

export default function Home() {
  return (
    <main className="pagina">
      <h1 className="titulo">Nomes</h1>
      <p className="dica">
        Clique na palavra para ouvir o nome · ative o destaque para tocar cada
        sílaba
      </p>
      <ListaNomes nomes={names} />
    </main>
  );
}
