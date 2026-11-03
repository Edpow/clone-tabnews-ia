import NameCard from "./components/NameCard";

const names = [
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
        Clique no nome para ouvir tudo · clique numa sílaba para ouvir só ela
      </p>
      <ul className="lista">
        {names.map((name) => (
          <li key={name.nome}>
            <NameCard nome={name.nome} pronuncia={name.pronuncia} />
          </li>
        ))}
      </ul>
    </main>
  );
}
