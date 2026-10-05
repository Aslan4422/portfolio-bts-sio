/*
 * Formulaire de contact : validation des champs et adresse d'envoi Formspree.
 * Fonctions « pures » (sans affichage) : elles sont testées automatiquement (Vitest).
 */

export type ContactField = "name" | "email" | "subject" | "message";

export type ContactFormInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Champ piège invisible : un humain le laisse vide, un robot le remplit. */
  honeypot: string;
};

export type ContactValidation = {
  /** true si le message peut être envoyé. */
  valid: boolean;
  /** true si le champ piège est rempli : envoi refusé (probable robot). */
  spam: boolean;
  /** Message d'erreur par champ (vide si tout est correct). */
  errors: Partial<Record<ContactField, string>>;
  /** Valeurs nettoyées (espaces superflus retirés). */
  data: Record<ContactField, string>;
};

export const CONTACT_LIMITS = {
  nameMax: 100,
  emailMax: 254,
  subjectMax: 150,
  messageMin: 10,
  messageMax: 5000,
} as const;

/** Format d'e-mail volontairement simple : texte@texte.extension, sans espace. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(email: string): boolean {
  return email.length <= CONTACT_LIMITS.emailMax && EMAIL_PATTERN.test(email);
}

export function validateContactForm(input: ContactFormInput): ContactValidation {
  const data = {
    name: input.name.trim(),
    email: input.email.trim(),
    subject: input.subject.trim(),
    message: input.message.trim(),
  };
  const errors: ContactValidation["errors"] = {};

  if (!data.name) errors.name = "Indiquez votre nom.";
  else if (data.name.length > CONTACT_LIMITS.nameMax)
    errors.name = `Votre nom est trop long (${CONTACT_LIMITS.nameMax} caractères maximum).`;

  if (!data.email) errors.email = "Indiquez votre adresse e-mail.";
  else if (!isValidEmail(data.email))
    errors.email = "Cette adresse e-mail ne semble pas valide (exemple : nom@exemple.fr).";

  if (!data.subject) errors.subject = "Indiquez le sujet de votre message.";
  else if (data.subject.length > CONTACT_LIMITS.subjectMax)
    errors.subject = `Le sujet est trop long (${CONTACT_LIMITS.subjectMax} caractères maximum).`;

  if (!data.message) errors.message = "Écrivez votre message.";
  else if (data.message.length < CONTACT_LIMITS.messageMin)
    errors.message = `Votre message est un peu court (${CONTACT_LIMITS.messageMin} caractères minimum).`;
  else if (data.message.length > CONTACT_LIMITS.messageMax)
    errors.message = `Votre message est trop long (${CONTACT_LIMITS.messageMax} caractères maximum).`;

  const spam = input.honeypot.trim().length > 0;
  return { valid: !spam && Object.keys(errors).length === 0, spam, errors, data };
}

/**
 * Adresse d'envoi Formspree construite à partir de l'identifiant du formulaire
 * (variable d'environnement NEXT_PUBLIC_FORMSPREE_ID, jamais écrit en dur).
 * Renvoie null si l'identifiant est absent ou mal formé.
 */
export function getFormspreeEndpoint(formId: string | undefined): string | null {
  const id = formId?.trim();
  if (!id || !/^[A-Za-z0-9]+$/.test(id)) return null;
  return `https://formspree.io/f/${id}`;
}
