export type ActionResult = { ok: true } | { error: string };

export function actionOk(): ActionResult {
  return { ok: true };
}

export function actionError(message: string): ActionResult {
  return { error: message };
}
