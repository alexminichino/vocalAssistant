import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy  } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { ChatService, Message } from '../service/chat.service';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-speech',
  templateUrl: './speech.page.html',
  styleUrls: ['./speech.page.scss'],
})
export class SpeechPage implements OnInit, OnDestroy {
  @ViewChild('chatBody', {static: true}) content
  //Speech recognition
  matches: String[];
  isRecording = false;
  permissionGranted =false;
  //DialogFlow
  messages: Array<Message>=[];
  subscription: Subscription;
  

  constructor( 
    private navCtrl: NavController,
    private speechRecognition: SpeechRecognition,
    private plt: Platform,
    private cd: ChangeDetectorRef,
    public chat: ChatService,
    private tts: TextToSpeech,
    private router: Router
  ){  }

  getPermission(){
    // Request permissions
    this.speechRecognition.requestPermission()
    .then(
      () => this.permissionGrantedNorify(),
      () => this.permissionDeniedNorify()
    )
  }

  checkPermission(){
    // Check permission
    this.speechRecognition.hasPermission()
    .then((hasPermission: boolean) => 
      this.permissionGranted = hasPermission
    )
  }

  permissionGrantedNorify(){
    this.permissionGranted=true;
    this.startListening();
  }

  permissionDeniedNorify(){
    this.permissionGranted=false;
    alert("App needs microphone permission to work properly!");
  }

  startListening(){
    if (!this.permissionGranted){
      this.getPermission();
      return;
    }
    let options={
      language: 'en-US'
    }
    this.isRecording=true;
    // Start the recognition process
    this.speechRecognition.startListening(options)
    .subscribe(matches =>{
      this.matches=matches;
      this.sendMessage(this.matches[0]);
      this.isRecording=false;
      this.cd.detectChanges();
    });
  }

  stopListening(){
    // Stop the recognition process (iOS only)
    this.speechRecognition.stopListening().then(()=>{
      this.isRecording=false;
    })
  }

  back(){
    this.navCtrl.back();
  }

  isIos(){
    return this.plt.is('ios');
  }

  ngOnInit() {
    this.subscription = this.chat.conversation.subscribe((data)=>this. responseonseHanlder(data));
    this.startListening();
  }

  ngOnDestroy(){    
    if(this.subscription)
      this.subscription.unsubscribe();
    this.messages = [];
    this.stopListening();
  }

  sendMessage(message) {
    this.chat.sendMessage(message);
    this.cd.detectChanges();
  }

   responseonseHanlder(data){
    console.log(data);
    if(data.length>0){
      this.scrollToBottom();
      if (data[0].sentBy=='user'){
        //Add user question to messages list
        this.messages.push(data[0]);
        //Add fake messages with gif typing...
        this.messages.push(new Message(
          "",
          "bot",
          true
        ));
      }
      
      
      if(data[0].sentBy=='bot' && this.messages.length>0 ){
        //Replace placeholder (gif) with bot  responseonse
        this.messages[this.messages.length-1]=data[0];
        //And now TTS
        this.tts.speak({
          text: data[0].content,
          locale: 'en-US'
        })
        .then(() => console.log('Success') )
        .catch((reason: any) => console.log(reason));
        //execute action
        this.doAction(data[0]);
        }
      }
      
      this.cd.detectChanges();
      
  }

  scrollToBottom(){
    this.content.scrollToBottom(300);  //300 for animate the scroll effect.
}

  addMock(){
    this.messages.push(new Message("Test message1","user"));
    this.messages.push(new Message("Test message1 response","bot"));
    this.messages.push(new Message("Test message2","user"));
    this.messages.push(new Message("Test message2 response","bot"));
    this.messages.push(new Message("Test message3","user"));
    this.messages.push(new Message("Test message3 response","bot"));
    this.messages.push(new Message("Test message4","user"));
    this.messages.push(new Message("Test message4 response","bot"));
    this.messages.push(new Message("Test message5","user"));
    this.messages.push(new Message("Test message5 response","bot"));
    this.messages.push(new Message("","bot",true));
    this.scrollToBottom(); 
  }


  doAction(message){
    if(message.action!="" && message.action!="input.unknown")
      setTimeout(()=>{
        this.navCtrl.navigateRoot(["/"+message.action]);
      },2000)
  }

}
