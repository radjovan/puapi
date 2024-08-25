import { Injectable } from '@angular/core';

declare var MathJax: any;

@Injectable({
  providedIn: 'root'
})
export class MathJaxService {
  constructor() {}

  render(element: HTMLElement): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub], () => {
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
