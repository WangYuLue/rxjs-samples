export function myTimeout(ms: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

export function randomId(): string {
  return String(Math.random()).slice(10)
}