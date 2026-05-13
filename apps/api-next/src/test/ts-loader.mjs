import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const PROJECT_SRC_ROOT = path.resolve(process.cwd(), "src");
const SUPPORTED_EXTENSIONS = [".ts", ".tsx", ".js", ".mjs", ".cjs"];

function resolveExistingPath(candidatePath) {
  if (fs.existsSync(candidatePath)) {
    return candidatePath;
  }

  for (const extension of SUPPORTED_EXTENSIONS) {
    const withExtension = `${candidatePath}${extension}`;

    if (fs.existsSync(withExtension)) {
      return withExtension;
    }
  }

  return null;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/src/")) {
    const relativePath = specifier.replace("@/src/", "");
    const candidatePath = path.join(PROJECT_SRC_ROOT, relativePath);
    const resolvedPath = resolveExistingPath(candidatePath);

    if (!resolvedPath) {
      throw new Error(`No se pudo resolver alias '${specifier}'.`);
    }

    return nextResolve(pathToFileURL(resolvedPath).href, context);
  }

  if (specifier.startsWith("./") || specifier.startsWith("../")) {
    const parentPath = context.parentURL
      ? path.dirname(fileURLToPath(context.parentURL))
      : process.cwd();
    const candidatePath = path.resolve(parentPath, specifier);
    const resolvedPath = resolveExistingPath(candidatePath);

    if (resolvedPath) {
      return nextResolve(pathToFileURL(resolvedPath).href, context);
    }
  }

  return nextResolve(specifier, context);
}
