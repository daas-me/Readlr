export class ReadingServiceError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function devicePracticeNotice(error: unknown): string {
  let reason = 'Online progress could not be reached.';
  if (error instanceof ReadingServiceError) {
    if (error.status === 403) reason = error.message;
    else if (error.status === 404) reason = 'The running backend needs the reading-progress update.';
    else if (error.status === 401) reason = 'Please sign in again to sync progress.';
    else if (error.status >= 500) reason = 'The progress service could not complete the request.';
  }
  return `${reason} Practice progress is saved only in this browser. Teacher access settings are synced.`;
}
