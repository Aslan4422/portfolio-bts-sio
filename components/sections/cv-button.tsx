import { Download, Mail } from "lucide-react";
import { ButtonLink, buttonStyles } from "@/components/ui/button";
import { cvHref, isCvAvailable } from "@/lib/cv";

/**
 * Bouton « Télécharger mon CV ».
 * Si le PDF n'a pas encore été déposé dans public/, on propose à la place
 * de demander le CV via le formulaire de contact (jamais de lien cassé).
 */
export function CvButton() {
  if (isCvAvailable()) {
    return (
      <a href={cvHref} download type="application/pdf" className={buttonStyles({ variant: "secondary", size: "lg" })}>
        <Download aria-hidden="true" />
        Télécharger mon CV
      </a>
    );
  }

  return (
    <ButtonLink href="/#contact" variant="secondary" size="lg">
      <Mail aria-hidden="true" />
      Demander mon CV
    </ButtonLink>
  );
}
