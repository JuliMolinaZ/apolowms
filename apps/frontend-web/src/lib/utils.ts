// src/lib/utils.ts
export function cn(...classes: (string | undefined | false)[]) {
    return classes.filter(Boolean).join(" ");
  }
  
  export function addThousandsSeparator(num: number): string {
    return num.toLocaleString();
  }
  
  export function numberToPercentage(num: number): string {
    return `${num.toFixed(0)}%`;
  }
  