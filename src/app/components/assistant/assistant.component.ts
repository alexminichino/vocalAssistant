import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-assistant',
  templateUrl: './assistant.component.html',
  styleUrls: ['./assistant.component.scss'],
})
export class AssistantComponent implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {}

  openAssistant(){
    this.navCtrl.navigateRoot('/speech');
  }

}
