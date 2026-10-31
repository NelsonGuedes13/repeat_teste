export const locales = ["pt", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "pt";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

// Placeholder até a marca estar definida — trocar só aqui.
export const BRAND = "Repeat";

// Para onde vão os pedidos de orçamento. Email de testes até haver o da empresa; telefone ainda por definir.
export const CONTACT = {
  email: "nelson2000guedes@gmail.com",
  phone: "+351 000 000 000",
};
