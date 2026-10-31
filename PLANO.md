# Plano — site de eventos (nome da marca por definir)

Empresa de produção técnica de eventos: palcos, luz, som, equalização de ambiente e criação de espetáculos.
Clientes: espaços públicos, privados, congressos, festivais, eventos corporativos e privados.

## Decisões (inquérito 2026-10-31)

| Tema | Decisão |
|---|---|
| 3D | Real, low-poly estilizado — React Three Fiber, câmara guiada pelo scroll |
| Estilo | Escuro de palco + feixes de luz/lasers coloridos, neblina; cada secção "acende" |
| Viagem | Camião desce Portugal com paragens por tipo de evento, cada uma com mini-galeria |
| Packs | 3 packs (Essencial / Pro / Espetáculo) com preço "desde" + configurador de extras com estimativa ao vivo |
| Orçamento próprio | Slider de orçamento + tipo de evento + nº de pessoas; um palco 3D ganha equipamento à medida que o valor sobe |
| Contacto | Pedido guardado em BD + email à empresa + confirmação ao cliente; painel admin para criar e enviar o orçamento final |
| Marca | Por definir — placeholder até lá |
| Línguas | PT (defeito) + EN |

## Percurso da landing (scroll)

1. **Boas-vindas** — sala às escuras, um feixe acende e revela o armazém 3D. Texto geral sobre a empresa.
2. **Carga** — o scroll carrega o camião: flightcases, truss, colunas e moving heads entram um a um (cada peça = um serviço).
3. **Saída** — portão abre, o camião arranca; a câmara sobe para uma vista do mapa de Portugal.
4. **Viagem** — o camião desce o país; em cada paragem o palco "monta-se" e abre uma galeria:
   - Porto — concerto
   - Coimbra — congresso
   - Lisboa — festival / espaço público
   - Algarve — evento privado
5. **Packs** — 3 cartões + configurador de extras (LED, mais luz, DJ booth, técnico extra…), estimativa ao vivo.
6. **"Tenho X de orçamento"** — slider que monta o palco 3D em tempo real.
7. **Contacto** — ambas as opções levam ao formulário, já pré-preenchido com a escolha.

Movimento sempre narrativo — nada de efeitos decorativos soltos. Fallback leve para telemóvel / `prefers-reduced-motion`.

## Stack

Next.js (App Router) + Tailwind + Motion + React Three Fiber/drei + Lenis. Supabase (pedidos + admin auth), Resend (emails), Vercel.

## Fases

1. Fundação: tokens visuais, i18n PT/EN, scroll suave, cena 3D base com luzes.
2. Armazém + carga do camião.
3. Mapa de Portugal + viagem + galerias (imagens genéricas).
4. Packs + configurador.
5. Slider de orçamento com palco 3D.
6. Formulário + Supabase + emails.
7. Painel admin (pedidos → orçamento final → envio).

## Em aberto

- Nome, logótipo e cores da marca
- Preços "desde" de cada pack e preços dos extras
- Fotos reais de trabalhos (até lá, genéricas)
- Email de destino dos pedidos
