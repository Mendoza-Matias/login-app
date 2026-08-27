import { Service } from '@angular/core';

@Service()
export class Store {

    set(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    get<T>(key: string): T | null {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    }
}
