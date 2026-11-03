import NameCard from "./components/NameCard";

const names = ["Edgar", "Rita", "Ryan", "Ellen"];

export default function Home() {
  return (
    <main className="pagina">
      <h1 className="titulo">Nomes</h1>
      <p className="dica">
        Clique no nome para ouvir tudo · clique numa sílaba para ouvir só ela
      </p>
      <ul className="lista">
        {names.map((name) => (
          <li key={name}>
            <NameCard nome={name} />
          </li>
        ))}
      </ul>
    </main>
  );
}
