import Cabecalho from "./components/Cabecalho";
import Rodape from "./components/Rodape";
import ListaNomes, { type Nome } from "./components/ListaNomes";

const names: Nome[] = [
  { nome: "Edgar", cor: "amarelo" },
  { nome: "Rita", cor: "verde" },
  { nome: "Ryan", pronuncia: "Rían", cor: "azul" },
  { nome: "Ellen", pronuncia: "Élen", cor: "rosa" },
];

export default function Home() {
  return (
    <>
      <Cabecalho />
      <main className="relative flex min-h-screen w-full flex-col bg-surface px-4 pb-28 pt-20">
        <ListaNomes nomesIniciais={names} />
      </main>
      <Rodape />
    </>
  );
}
