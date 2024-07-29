import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { MathJaxService } from '../../services/math-jax/math-jax.service';


@Component({
  selector: 'app-math-jax-paragraph',
  template: '<div [innerHTML]="mathString"></div>'
})
export class MathJaxParagraphComponent implements OnInit {
  @Input() mathString!: string;

  constructor(private el: ElementRef, private mathJaxService: MathJaxService) {}

  ngOnInit(): void {
    this.mathJaxService.render(this.el.nativeElement).catch((error) => {
      console.error('Error rendering MathJax:', error);
    });
  }
}
