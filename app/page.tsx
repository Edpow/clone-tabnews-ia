const names = ["Edgar", "Rita", "Ryan", "Ellen"];

export default function Home() {
  return (
    <main>
      <ul>
        {names.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </main>
  );
}
