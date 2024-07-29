import { Injectable } from '@angular/core';

declare var MathJax: any;

@Injectable({
  providedIn: 'root'
})
export class MathJaxService {
  constructor() {}

  render(element: HTMLElement): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (typeof MathJax !== 'undefined' && MathJax.Hub && MathJax.Hub.Queue) {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, element], () => {
          resolve();
        });
      } else {
        reject(new Error('MathJax is not loaded properly.'));
      }
    });
  }
}
