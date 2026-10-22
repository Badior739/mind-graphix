"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminBase } from "@/lib/server/admin-path";
import { assertAdmin, endSession, requestCode, revokeAllSessions, verifyCode } from "@/lib/server/auth";
import { query } from "@/lib/server/db";
import {
  deleteMedia,
  resetContent,
  saveContent,
  saveImage,
  validatePosters,
  validateServices,
} from "@/lib/server/store";

const STATUSES = ["nouveau", "en cours", "traité", "archivé"];

// Les erreurs de validation (messages écrits dans store.js) sont montrées telles quelles ; le reste reste générique.
const SAFE = /^(Entre|Chaque|Identifiant|Source|30 images|Image trop|Formats acceptés|Session expirée)/;
function fail(e) {
  console.error("[admin]", e?.message);
  return { ok: false, error: SAFE.test(e?.message || "") ? e.message : "Une erreur est survenue. Réessayez." };
}

const publish = () => revalidatePath("/", "layout");

/* ----- connexion ----- */
export async function requestCodeAction(email) {
  try {
    return await requestCode(email);
  } catch (e) {
    return { ok: true };
  }
}

export async function verifyCodeAction(email, code) {
  try {
    return await verifyCode(email, code);
  } catch (e) {
    console.error("[admin] verify", e?.message);
    return { ok: false, error: "Connexion impossible pour le moment." };
  }
}

export async function logoutAction() {
  await endSession();
  redirect(adminBase());
}

export async function revokeSessionsAction() {
  try {
    await assertAdmin();
    await revokeAllSessions();
  } catch (e) {
    return fail(e);
  }
  redirect(adminBase());
}

/* ----- demandes ----- */
export async function setBriefStatus(id, status) {
  try {
    await assertAdmin();
    if (!Number.isInteger(id) || !STATUSES.includes(status)) throw new Error("invalid");
    await query("UPDATE briefs SET status=$1 WHERE id=$2", [status, id]);
    revalidatePath("/gestion-mgs/demandes");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteBrief(id) {
  try {
    await assertAdmin();
    if (!Number.isInteger(id)) throw new Error("invalid");
    await query("DELETE FROM briefs WHERE id=$1", [id]);
    revalidatePath("/gestion-mgs/demandes");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/* ----- services ----- */
export async function saveServicesAction(json) {
  try {
    await assertAdmin();
    await saveContent("services", validateServices(JSON.parse(json)));
    publish();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function resetServicesAction() {
  try {
    await assertAdmin();
    await resetContent("services");
    publish();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/* ----- images ----- */
export async function savePostersAction(json) {
  try {
    await assertAdmin();
    await saveContent("posters", validatePosters(JSON.parse(json)));
    publish();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function resetPostersAction() {
  try {
    await assertAdmin();
    await resetContent("posters");
    publish();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function uploadImageAction(formData) {
  try {
    await assertAdmin();
    const file = formData.get("file");
    if (!file || typeof file === "string" || !file.size) throw new Error("Image trop lourde ou absente.");
    const saved = await saveImage(Buffer.from(await file.arrayBuffer()), file.name);
    revalidatePath("/gestion-mgs/images");
    return { ok: true, ...saved };
  } catch (e) {
    if (/Input buffer|unsupported image|corrupt|VipsJpeg|pngload|webpload/i.test(e?.message || "")) {
      return { ok: false, error: "Formats acceptés : JPG, PNG, WebP." };
    }
    return fail(e);
  }
}

export async function deleteImageAction(id) {
  try {
    await assertAdmin();
    if (!/^[0-9a-f-]{36}$/.test(id)) throw new Error("invalid");
    await deleteMedia(id);
    publish();
    revalidatePath("/gestion-mgs/images");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}
