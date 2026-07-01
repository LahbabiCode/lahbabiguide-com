type ClassValue = ClassArray | ClassDictionary | string | number | null | boolean | undefined;
interface ClassDictionary {
  [id: string]: any;
}
interface ClassArray extends Array<ClassValue> {}

export function cn(...inputs: ClassValue[]): string {
  const classes = [];
  
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(input);
    } else if (Array.isArray(input)) {
        if(input.length) {
            const inner = cn(...input);
            if(inner) classes.push(inner);
        }
    } else if (typeof input === 'object') {
        for (const key in input) {
            if (input[key]) classes.push(key);
        }
    }
  }

  return classes.join(' ');
}
