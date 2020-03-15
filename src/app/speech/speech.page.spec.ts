import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SpeechPage } from './speech.page';

describe('SpeechPage', () => {
  let component: SpeechPage;
  let fixture: ComponentFixture<SpeechPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeechPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SpeechPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
