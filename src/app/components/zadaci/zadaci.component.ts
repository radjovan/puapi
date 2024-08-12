import { AfterViewInit, Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Predmet } from '../../models/predmet';
import { ZadatakService } from '../../services/zadatak-service/zadatak.service';
import { tacnostOdgovora } from '../../../enviroment'; // Proveri tačnu putanju za uvoz
import MathJax from 'better-react-mathjax/MathJax';
import { UserService } from '../../services/user-service/user.service';
import { Zadatak } from '../../models/zadatak';
import { Router } from '@angular/router';
import { FileService } from '../../services/file-service/file.service';
import { MathJaxService } from '../../services/math-jax/math-jax.service';

@Component({
  selector: 'app-zadaci',
  templateUrl: './zadaci.component.html',
  styleUrls: ['./zadaci.component.css']
})
export class ZadaciComponent implements OnInit {
  taskForm: FormGroup;
  //hintForm: FormGroup;
  definitionForm: FormGroup;
  answersForm: FormGroup;
  predmeti: Predmet[] | undefined;
  selectedFile: File | null = null;
  selectedFileDefinition: File | null = null;
  filePath: string | null = null;
  showTaskForm = true;
  showAnswersForm = false;
  showdefinitionForm = false;
  latexInput: string = ''; // Polje za unos LaTeX izraza
  renderedLatex: string = ''; // Bezbedan HTML za prikaz LaTeX izraza
  taskId = 0;
  imageUrl: string | null = null;
  definitionImageUrl: string | null = null;
  taskAdded = false;

  zadatak: Zadatak | null = null;

  @Input() mathString!: string;
  @Input() defMathString!: string;

  constructor(
    private fb: FormBuilder,
    private zadaciService: ZadatakService,
    private sanitizer: DomSanitizer,
    private userService: UserService,
    private router: Router,
    private fileService: FileService,
    private el: ElementRef,
     private mathJaxService: MathJaxService
  ) {
    this.taskForm = this.fb.group({
      nivo: [0, Validators.required],
      opis: ['', Validators.required],
      tekst: ['', Validators.required],
      idPredmeta: [0, Validators.required],
      latex: [false],
      picture: [false]
    });

    this.definitionForm = this.fb.group({
      tekst: ['', Validators.required],
      defLatex: [false]
    });

    this.answersForm = this.fb.group({
      correct: ['', Validators.required],
      forHint: ['', Validators.required],
      wrong: ['', Validators.required],
      wrong2: ['', Validators.required],
      hint: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if(this.userService.isAdmin())
    {
      this.zadaciService.getPredmeti().subscribe(
        (response: Predmet[]) => {
          this.predmeti = response;
        }
      );
    }
    else{
      var current = this.userService.getCurrentUser().user;
      this.zadaciService.getPredmetiByProfesorId(current.id).subscribe(
        (response: Predmet[]) => {
          this.predmeti = response;
        }
      );
    }

    this.mathJaxService.render(this.el.nativeElement).catch((error) => {
      console.error('Error rendering MathJax:', error);
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
    }
  }

  onFileChangeDefinition(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFileDefinition = input.files[0];
    }
  }

  uploadFile() {
    if (this.selectedFile) {
      this.fileService.uploadFile(this.selectedFile).subscribe(response => {
        if (response.status === 'success') {
          this.zadaciService.addZadatakPath(response.filename, this.taskId).subscribe();
          this.imageUrl = this.fileService.getImageUrlByName(response.filename);
        } else {
          console.error(response.message);
        }
      });
    }
  }

  addTask(): void {
    if (this.taskForm.valid) {
      const zadatak: Zadatak = this.taskForm.value;
      if (this.selectedFile) {
        zadatak.picture = true;
      }
      zadatak.idKreatora = this.userService.getCurrentUser().user.id;
      this.zadaciService.addZadatak(zadatak).subscribe(
        (response: number) => {
          if(response){
            this.zadatak = zadatak;
            this.zadatak.id = response;
            var p =  this.predmeti?.find(x => x.id == this.zadatak?.idPredmeta);
            if(p)
            {
              this.zadatak.predmet =  p;
            }
            this.taskId = response;
            this.showTaskForm = false;
            this.showAnswersForm = true;
            this.uploadFile();
            this.taskAdded = true;
          }
        }
      );
      
    }
  }

  getZadatakClass(nivo: any): string {
    switch (nivo) {
      case 1:
        return 'osnovni-nivo';
      case 2:
        return 'srednji-nivo';
      case 3:
        return 'napredni-nivo';
      default:
        return '';
    }
  }

  submitAnswers() {
    if (this.answersForm.valid) {
      const { correct, forHint, wrong, wrong2 } = this.answersForm.value;

      this.zadaciService.addAnswers(correct, this.taskId, tacnostOdgovora.correct).subscribe();
      this.zadaciService.addAnswers(forHint, this.taskId, tacnostOdgovora.forHint).subscribe();
      this.zadaciService.addAnswers(wrong, this.taskId, tacnostOdgovora.wrong).subscribe();
      this.zadaciService.addAnswers(wrong2, this.taskId, tacnostOdgovora.wrong2).subscribe();
      this.submitHint();
      alert('Odgovori su uspešno dodati!');
      this.showAnswersForm = false; // Sakrivamo odgovor formu nakon submit-a
    }
  }

  submitHint() {
    if (this.answersForm.valid) {
      this.zadaciService.addHint(this.answersForm.value.hint, this.taskId).subscribe();
      //alert('Hint je uspešno dodat!');
      this.showdefinitionForm = true;
    }
  }

  submitDefinition() {
    if (this.definitionForm.valid) {
      if (this.selectedFileDefinition) {
        this.fileService.uploadFile(this.selectedFileDefinition).subscribe(response => {
          if (response.status === 'success') {
            this.zadaciService.addDefinition(this.definitionForm.value.tekst, this.taskId, response.filename, this.definitionForm.value.defLatex).subscribe();
            this.definitionImageUrl = this.fileService.getImageUrlByName(response.filename);
          } else {
            console.error(response.message);
          }
        });
      }
      else{
        this.zadaciService.addDefinition(this.definitionForm.value.tekst, this.taskId, null, this.definitionForm.value.defLatex).subscribe();
      }
      
      alert('Definicija je uspešno dodata!');
      this.showdefinitionForm = false;
      this.router.navigate(['/moji-zadaci']);
    }
  }

  updateLatex() {
    if (this.taskForm.get('latex')?.value) {
      this.mathString = "$" + this.taskForm.get('tekst')?.value + "$";
      this.mathJaxService.render(this.el.nativeElement).catch((error) => {
        console.error('Error rendering MathJax:', error);
      });
      this.mathJaxService.render(this.el.nativeElement).catch((error) => {
        console.error('Error rendering MathJax:', error);
      });
    }

    return true;
  }

  updateDefLatex() {
    if (this.definitionForm.get('defLatex')?.value) {
      this.defMathString = "$" + this.definitionForm.get('tekst')?.value + "$";
      this.mathJaxService.render(this.el.nativeElement).catch((error) => {
        console.error('Error rendering MathJax:', error);
      });
      this.mathJaxService.render(this.el.nativeElement).catch((error) => {
        console.error('Error rendering MathJax:', error);
      });
    }

    return true;
  }
  
  getFile() {
    if (this.filePath) {
      this.fileService.getFile(this.filePath).subscribe(response => {
        const url = URL.createObjectURL(response);
        this.imageUrl = url;
      });
    }
  }

  renderLatex(arg0: string) {
    this.mathString = arg0;
    this.mathJaxService.render(this.el.nativeElement).catch((error) => {
      console.error('Error rendering MathJax:', error);
    });
    return this.mathString;
  }
}
