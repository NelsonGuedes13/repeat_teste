const pt = {
  meta: {
    title: "Produção técnica de eventos — palco, luz e som",
    description:
      "Montagem de palcos, iluminação, sistemas de som e criação de espetáculos para concertos, congressos, festivais e eventos privados em todo o país.",
  },
  switchLang: "EN",
  hero: {
    kicker: "Produção técnica de eventos",
    title: ["Montamos o palco.", "Acendemos a noite."],
    lead: "Palcos, luz, som e espetáculo — de um congresso para 200 pessoas a um festival para 20 000. Nós tratamos da parte técnica, tu tratas do resto.",
    scroll: "Desliza para acender as luzes",
  },
  lights: {
    lines: ["Luz.", "Som.", "Palco.", "Espetáculo."],
    caption: "Tudo sai do mesmo armazém. Tudo chega pronto a ligar.",
  },
  warehouse: {
    kicker: "O armazém",
    title: "Tudo começa aqui.",
    lead: "Cada evento sai do nosso armazém já testado, etiquetado e pronto a montar. Desliza para carregar o camião.",
    items: [
      { title: "Palcos", text: "Estrados modulares, escadas e saias de palco — do púlpito de um congresso ao palco principal de um festival." },
      { title: "Estruturas", text: "Truss, torres e pórticos certificados para suspender luz, som e cenografia em segurança." },
      { title: "Iluminação", text: "Moving heads, wash, perfis e LED. Desenho de luz pensado para o espaço e para o momento." },
      { title: "Som", text: "Line arrays, monição e microfonia — de salas para 50 pessoas a praças com milhares." },
      { title: "Régie e equalização", text: "Mesa, técnicos e medição acústica: equalizamos o ambiente para que cada lugar oiça bem." },
      { title: "Espetáculo", text: "Fumo, CO₂, chuva de papel e direção técnica para transformar um evento num momento." },
    ],
    outro: "Carga completa. Vamos para a estrada.",
  },
  trip: {
    depart: "Portão aberto. O camião sai carregado — e a estrada é longa.",
    kicker: "A estrada",
    title: "De norte a sul, o país é o nosso palco.",
    enRoute: "A caminho de",
    stop: "Paragem",
    // exemplos genéricos — substituir pelos trabalhos reais da empresa
    stops: [
      { city: "Porto", type: "Concerto ao ar livre", text: "Palco de 12 metros, line array e desenho de luz para milhares de pessoas numa noite de verão." },
      { city: "Coimbra", type: "Congresso", text: "Auditório com régie, ecrãs, microfonia para painéis e som equalizado para que cada fila oiça bem." },
      { city: "Lisboa", type: "Festival", text: "Dois palcos, três dias, uma equipa técnica no terreno do primeiro teste de som ao último acorde." },
      { city: "Algarve", type: "Evento privado", text: "Casamento ao pôr do sol: iluminação ambiente, pista com DJ e som discreto para o jantar." },
    ],
    outro: "Do Minho ao Algarve — levamos o espetáculo onde ele for preciso.",
  },
  next: "A seguir: escolhe o teu pack",
};

export default pt;
export type Dictionary = typeof pt;
