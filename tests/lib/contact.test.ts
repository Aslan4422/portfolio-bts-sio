/*
 * Validation du formulaire de contact (lib/contact.ts) : champs obligatoires,
 * format de l'e-mail, longueurs maximales, champ piège anti-robots
 * et construction de l'adresse d'envoi Formspree.
 */
import { describe, expect, it } from "vitest";
import {
  CONTACT_LIMITS,
  getFormspreeEndpoint,
  isValidEmail,
  validateContactForm,
  type ContactFormInput,
} from "@/lib/contact";

const valid: ContactFormInput = {
  name: "Camille Martin",
  email: "camille.martin@exemple.fr",
  subject: "Proposition de stage",
  message: "Bonjour, votre profil m'intéresse pour un stage.",
  honeypot: "",
};
const withFields = (changes: Partial<ContactFormInput>) => validateContactForm({ ...valid, ...changes });

describe("Formulaire correctement rempli", () => {
  it("est accepté, sans aucune erreur", () => {
    const result = validateContactForm(valid);
    expect(result).toMatchObject({ valid: true, spam: false, errors: {} });
  });

  it("retire les espaces superflus avant l'envoi", () => {
    const result = withFields({ name: "  Camille  ", email: " camille@exemple.fr ", subject: " Stage ", message: "  Message assez long.  " });
    expect(result.valid).toBe(true);
    expect(result.data).toEqual({
      name: "Camille",
      email: "camille@exemple.fr",
      subject: "Stage",
      message: "Message assez long.",
    });
  });

  it("n'envoie jamais le champ piège", () => {
    expect(validateContactForm(valid).data).not.toHaveProperty("honeypot");
  });
});

describe("Champs obligatoires", () => {
  it("signale les 4 champs quand tout est vide", () => {
    const result = validateContactForm({ name: "", email: "", subject: "", message: "", honeypot: "" });
    expect(result.valid).toBe(false);
    expect(Object.keys(result.errors).sort()).toEqual(["email", "message", "name", "subject"]);
  });

  it.each(["name", "email", "subject", "message"] as const)("refuse « %s » rempli uniquement d'espaces", (field) => {
    const result = withFields({ [field]: "   \n\t " });
    expect(result.valid).toBe(false);
    expect(Object.keys(result.errors)).toEqual([field]);
  });

  it("donne des messages d'erreur en français", () => {
    const { errors } = validateContactForm({ name: "", email: "", subject: "", message: "", honeypot: "" });
    expect(errors.name).toBe("Indiquez votre nom.");
    expect(errors.email).toBe("Indiquez votre adresse e-mail.");
    expect(errors.subject).toBe("Indiquez le sujet de votre message.");
    expect(errors.message).toBe("Écrivez votre message.");
  });
});

describe("Adresse e-mail", () => {
  it.each(["nom@exemple.fr", "prenom.nom+portfolio@sous.domaine.com", "a@b.io"])("accepte « %s »", (email) => {
    expect(isValidEmail(email)).toBe(true);
    expect(withFields({ email }).valid).toBe(true);
  });

  it.each([
    "nom.exemple.fr", // pas d'arobase
    "nom@", // pas de domaine
    "@exemple.fr", // pas de nom
    "nom@exemple", // pas d'extension
    "nom@exemple.f", // extension trop courte
    "nom @exemple.fr", // espace
    "nom@@exemple.fr", // double arobase
    "nom@exemple .fr",
  ])("refuse « %s »", (email) => {
    expect(isValidEmail(email)).toBe(false);
    const result = withFields({ email });
    expect(result.valid).toBe(false);
    expect(result.errors.email).toMatch(/ne semble pas valide/);
  });

  it("accepte une adresse de exactement 254 caractères, refuse 255 (limite des normes e-mail)", () => {
    const domain = "@exemple.fr";
    expect(isValidEmail("a".repeat(254 - domain.length) + domain)).toBe(true);
    expect(isValidEmail("a".repeat(255 - domain.length) + domain)).toBe(false);
  });
});

describe("Longueurs minimales et maximales (valeurs limites)", () => {
  it("respecte les limites prévues", () => {
    expect(CONTACT_LIMITS).toEqual({ nameMax: 100, emailMax: 254, subjectMax: 150, messageMin: 10, messageMax: 5000 });
  });

  it("accepte un nom de exactement 100 caractères, refuse 101", () => {
    expect(withFields({ name: "a".repeat(CONTACT_LIMITS.nameMax) }).valid).toBe(true);
    expect(withFields({ name: "a".repeat(CONTACT_LIMITS.nameMax + 1) }).errors.name).toMatch(/trop long/);
  });

  it("accepte un sujet de exactement 150 caractères, refuse 151", () => {
    expect(withFields({ subject: "s".repeat(CONTACT_LIMITS.subjectMax) }).valid).toBe(true);
    expect(withFields({ subject: "s".repeat(CONTACT_LIMITS.subjectMax + 1) }).errors.subject).toMatch(/trop long/);
  });

  it("refuse un message de 9 caractères, accepte 10", () => {
    expect(withFields({ message: "m".repeat(CONTACT_LIMITS.messageMin - 1) }).errors.message).toMatch(/un peu court/);
    expect(withFields({ message: "m".repeat(CONTACT_LIMITS.messageMin) }).valid).toBe(true);
  });

  it("accepte un message de 5 000 caractères, refuse 5 001", () => {
    expect(withFields({ message: "m".repeat(CONTACT_LIMITS.messageMax) }).valid).toBe(true);
    expect(withFields({ message: "m".repeat(CONTACT_LIMITS.messageMax + 1) }).errors.message).toMatch(/trop long/);
  });
});

describe("Champ piège anti-robots (honeypot)", () => {
  it("bloque l'envoi quand il est rempli, même si le reste est valide", () => {
    const result = withFields({ honeypot: "https://spam.example" });
    expect(result.spam).toBe(true);
    expect(result.valid).toBe(false);
  });

  it("ne bloque pas un humain qui l'a laissé vide (ou avec des espaces)", () => {
    expect(withFields({ honeypot: "" }).spam).toBe(false);
    expect(withFields({ honeypot: "   " }).spam).toBe(false);
  });
});

describe("Adresse d'envoi Formspree", () => {
  it("est construite à partir de l'identifiant du formulaire", () => {
    expect(getFormspreeEndpoint("xyzabcde")).toBe("https://formspree.io/f/xyzabcde");
    expect(getFormspreeEndpoint("  xyzabcde  ")).toBe("https://formspree.io/f/xyzabcde");
  });

  it.each([undefined, "", "   "])("est absente si l'identifiant n'est pas renseigné (%j)", (id) => {
    expect(getFormspreeEndpoint(id)).toBeNull();
  });

  it.each(["abc/../autre", "abc?x=1", "abc#x", "https://formspree.io/f/abc", "abc def", "<script>"])(
    "refuse un identifiant mal formé ou piégé (%s)",
    (id) => {
      expect(getFormspreeEndpoint(id)).toBeNull();
    },
  );
});
