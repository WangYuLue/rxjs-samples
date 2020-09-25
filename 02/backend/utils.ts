export function myTimeout(ms: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

export function randomAdd(num: number, range: number = 5): number {
  return num + Math.floor(Math.random() * range)
}