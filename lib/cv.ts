import fs from "node:fs";
import path from "node:path";
import { site } from "@/content/site";

/**
 * Indique si le CV a été déposé dans public/.
 * Vérifié côté serveur au moment de la génération du site : après avoir ajouté
 * le fichier, il suffit de republier pour que le bouton de téléchargement apparaisse.
 */
export function isCvAvailable(): boolean {
  return fs.existsSync(path.join(process.cwd(), "public", site.cvFile));
}

export const cvHref = `/${site.cvFile}`;
