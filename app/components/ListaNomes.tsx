"use client";

import { useState } from "react";
import NameCard from "./NameCard";

export type Nome = {
  nome: string;
  // Texto falado quando a pronúncia em pt-BR difere da escrita
  // (ex.: "Ryan" soa "Rian", "Ellen" soa "Élen").
  pronuncia?: string;
};

type Props = {
  nomes: Nome[];
};

export default function ListaNomes({ nomes }: Props) {
  const [destacarSilabas, setDestacarSilabas] = useState(false);

  return (
    <>
      <label className="controle">
        <input
          type="checkbox"
          className="interruptor-entrada"
          checked={destacarSilabas}
          onChange={(evento) => setDestacarSilabas(evento.target.checked)}
        />
        <span className="interruptor" aria-hidden="true" />
        Destacar sílabas
      </label>

      <ul className="lista">
        {nomes.map((item) => (
          <li key={item.nome}>
            <NameCard
              nome={item.nome}
              pronuncia={item.pronuncia}
              destacarSilabas={destacarSilabas}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
