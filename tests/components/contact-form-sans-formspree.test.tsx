// @vitest-environment jsdom
/*
 * Formulaire de contact quand Formspree n'est pas configuré (variable
 * NEXT_PUBLIC_FORMSPREE_ID absente, ex. avant le premier déploiement) :
 * pas de formulaire inutilisable, mais l'adresse e-mail en solution de repli.
 */
import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

vi.hoisted(() => {
  delete process.env.NEXT_PUBLIC_FORMSPREE_ID;
});

import { ContactForm } from "@/components/contact/contact-form";
import { site } from "@/content/site";

it("affiche l'adresse e-mail à la place d'un formulaire inutilisable", () => {
  const { container } = render(<ContactForm />);
  expect(container.querySelector("form")).toBeNull();
  expect(screen.getByText(/momentanément indisponible/)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: site.contact.email })).toHaveAttribute("href", `mailto:${site.contact.email}`);
});
