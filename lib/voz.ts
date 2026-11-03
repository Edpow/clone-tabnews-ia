// Captura de voz (reconhecimento de fala) em pt-BR via Web Speech API.
//
// A API não faz parte do lib.dom do TypeScript, então os tipos mínimos
// são declarados aqui. Cada chamada invalida a anterior (contador de
// geração), para cliques rápidos não misturarem respostas.
//
// Estratégia de captura: continuous + interimResults acumulam tudo o que
// aparecer (inclusive texto parcial, melhor para sílabas curtas) e a
// entrega acontece no 1º resultado final. Sem nada em 6s, a escuta
// termina e uma lista vazia é entregue — a interface responde
// "Não consegui ouvir" em vez de ficar em silêncio.

type Opcoes = {
  aoIniciar?: () => void;
  aoTranscrever?: (transcricoes: string[]) => void;
  aoEncerrar?: () => void;
  aoErro?: (tipo: string) => void;
};

type Alternativa = {
  transcript: string;
};

type EventoResultado = {
  results: {
    length: number;
    [indice: number]: {
      length: number;
      isFinal: boolean;
      [alternativa: number]: Alternativa;
    };
  };
};

type EventoErro = {
  error: string;
};

type Reconhecimento = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onstart: (() => void) | null;
  onresult: ((evento: EventoResultado) => void) | null;
  onerror: ((evento: EventoErro) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type ConstrutorReconhecimento = new () => Reconhecimento;

const TEMPO_MAXIMO_MS = 6000;

let geracao = 0;
let atual: Reconhecimento | null = null;
let timeout: ReturnType<typeof setTimeout> | null = null;

function construtor(): ConstrutorReconhecimento | null {
  if (typeof window === "undefined") return null;
  const janela = window as unknown as {
    SpeechRecognition?: ConstrutorReconhecimento;
    webkitSpeechRecognition?: ConstrutorReconhecimento;
  };
  return janela.SpeechRecognition ?? janela.webkitSpeechRecognition ?? null;
}

export function vozDisponivel(): boolean {
  return construtor() !== null;
}

export function ouvir(opcoes: Opcoes = {}): void {
  const Construtor = construtor();
  if (!Construtor) return;

  parar(); // encerra e invalida qualquer escuta anterior
  const minhaGeracao = ++geracao;

  const reconhecimento = new Construtor();
  reconhecimento.lang = "pt-BR";
  reconhecimento.interimResults = true;
  reconhecimento.continuous = true;
  reconhecimento.maxAlternatives = 10;
  atual = reconhecimento;

  let finalizado = false;
  let entregue = false;
  const transcricoes: string[] = [];

  const entregar = () => {
    if (entregue) return;
    entregue = true;
    opcoes.aoTranscrever?.([...transcricoes]);
  };

  const encerrar = (erro?: string) => {
    if (finalizado || minhaGeracao !== geracao) return;
    finalizado = true;
    atual = null;
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (erro) {
      // Erro sem transcrição: repassa o tipo para a interface tratar.
      if (!entregue) opcoes.aoErro?.(erro);
    } else if (!entregue) {
      // Fim de escuta sem transcrição nenhuma: entrega lista vazia para
      // a interface responder "Não consegui ouvir" (nunca fica mudo).
      entregar();
    }
    opcoes.aoEncerrar?.();
  };

  reconhecimento.onstart = () => {
    if (minhaGeracao === geracao) opcoes.aoIniciar?.();
  };

  reconhecimento.onresult = (evento) => {
    if (minhaGeracao !== geracao) return;
    let temFinal = false;
    for (let i = 0; i < evento.results.length; i++) {
      const resultado = evento.results[i];
      for (let j = 0; j < resultado.length; j++) {
        const texto = resultado[j].transcript;
        if (texto && !transcricoes.includes(texto)) {
          transcricoes.push(texto);
        }
      }
      if (resultado.isFinal) temFinal = true;
    }
    if (temFinal) {
      entregar();
      try {
        reconhecimento.stop();
      } catch {
        // já parado
      }
    }
  };

  reconhecimento.onerror = (evento) => encerrar(evento.error);
  reconhecimento.onend = () => encerrar();

  timeout = setTimeout(() => {
    if (minhaGeracao !== geracao) return;
    try {
      reconhecimento.stop();
    } catch {
      // já parado
    }
  }, TEMPO_MAXIMO_MS);

  try {
    reconhecimento.start();
  } catch {
    encerrar("aborted");
  }
}

export function parar(): void {
  geracao++; // callbacks da escuta atual passam a ser ignorados
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  if (atual) {
    const reconhecimento = atual;
    atual = null;
    try {
      reconhecimento.stop();
    } catch {
      // já parado
    }
  }
}
