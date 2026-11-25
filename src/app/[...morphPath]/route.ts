import { readFile } from "node:fs/promises";
import path from "node:path";
import inventory from "@/components/sites/morphogenesis/archive/routes.json";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const directory = path.join(process.cwd(), "src/components/sites/morphogenesis/archive");
const assets = "/sites/morphogenesis/archive";
const routes = new Map(inventory.map((page) => [page.path, page]));

const styles = ["vendor/bootstrap.css", "vendor/slick.css", "vendor/animate.css", "theme/css/style.css", "theme/css/media.css", "theme/css/custom.css", "theme/css/site-overrides.css", "skin.css"];
const scripts = ["vendor/jquery.js", "vendor/bootstrap.js", "vendor/slick.js", "interactions.js", "listings.js"];

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char] ?? char);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ morphPath: string[] }> },
) {
  const { morphPath } = await params;
  const route = routes.get("/" + morphPath.join("/") + "/");
  if (!route) return new Response("Page not found", { status: 404 });

  const [header, main, footer] = await Promise.all([
    readFile(path.join(directory, "header.html"), "utf-8"),
    readFile(path.join(directory, "pages", route.file), "utf-8"),
    readFile(path.join(directory, "footer.html"), "utf-8"),
  ]);
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(route.title)}</title>
<meta name="description" content="${escapeHtml(route.description)}">
<link rel="icon" href="/favicon.ico">
${styles.map((file) => `<link rel="stylesheet" href="${assets}/${file}">`).join("\n")}
${scripts.map((file) => `<script src="${assets}/${file}" defer></script>`).join("\n")}
</head>
<body class="${escapeHtml(route.bodyClass)}">
<div class="clsmain">${header}<main id="archive-main">${main}</main>${footer}</div>
</body>
</html>`;
  return new Response(request.method === "HEAD" ? null : html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Security-Policy": "script-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'",
    },
  });
}
