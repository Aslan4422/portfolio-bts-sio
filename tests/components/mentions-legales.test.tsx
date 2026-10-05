// @vitest-environment jsdom
/* Page Mentions légales : informations obligatoires présentes et crédits des photos à jour. */
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LegalNoticePage from "@/app/mentions-legales/page";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

describe("Mentions légales", () => {
  it("indiquent l'éditeur, son contact et l'hébergeur", () => {
    render(<LegalNoticePage />);
    expect(screen.getByRole("heading", { level: 1, name: "Mentions légales" })).toBeInTheDocument();
    const editor = screen.getByRole("region", { name: "Éditeur du site" });
    expect(editor).toHaveTextContent(site.name);
    expect(within(editor).getByRole("link", { name: site.contact.email })).toHaveAttribute(
      "href",
      `mailto:${site.contact.email}`,
    );
    expect(screen.getByRole("region", { name: "Hébergeur" })).toHaveTextContent(/Vercel Inc\..*États-Unis/);
  });

  it("expliquent le traitement des données du formulaire (RGPD), à l'endroit visé par le formulaire", () => {
    const { container } = render(<LegalNoticePage />);
    const section = container.querySelector("#donnees-personnelles");
    expect(section).not.toBeNull();
    for (const mention of ["Responsable du traitement", "Finalité", "Base légale", "Destinataires", "Durée de conservation", "CNIL", "Formspree"]) {
      expect(section).toHaveTextContent(mention);
    }
  });

  it("créditent la photo de chaque projet, avec sa licence quand elle l'exige", () => {
    render(<LegalNoticePage />);
    const credits = screen.getByRole("region", { name: "Propriété intellectuelle et crédits" });
    for (const { title, cover } of projects) {
      const item = within(credits).getByText((_, element) => element?.tagName === "LI" && element.textContent?.startsWith(title) === true);
      expect(within(item).getByRole("link", { name: new RegExp(cover.author) })).toHaveAttribute("href", cover.url);
      if (cover.license) {
        // Licence Creative Commons : son nom ET le lien vers son texte sont obligatoires.
        const { name, url } = cover.license;
        expect(item).toHaveTextContent(name);
        expect(within(item).getByRole("link", { name: (accessibleName) => accessibleName.startsWith(name) })).toHaveAttribute(
          "href",
          url,
        );
      }
    }
  });

  it("n'affichent aucun numéro de téléphone ni adresse postale de l'éditeur", () => {
    const { container } = render(<LegalNoticePage />);
    const editor = container.querySelector("#editeur");
    // Numéros écrits avec espaces, points, tirets ou barres (06 12…, 06.12…, 06-12…, 06/12…) ou code postal.
    expect(editor?.textContent).not.toMatch(/\d{2}[\s./-]?\d{2}[\s./-]?\d{2}[\s./-]?\d{2}|\d{5}/);
  });
});
