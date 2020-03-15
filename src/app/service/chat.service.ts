import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiAiClient } from 'api-ai-javascript/es6/ApiAiClient';
import { BehaviorSubject} from 'rxjs';

// Message class
export class Message {
  profile_pic: string
  
  constructor(
    public content: string,
    public sentBy: string,
    public placeholder : boolean = false,
    public action: string = null,
    
    ) 
    {
      //You can define the message profile pic
      this.profile_pic = (sentBy=='user') ? "../../assets/img/bot/user.png": "../../assets/img/bot/bot.png";
    }
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  //Get API Key
  readonly token = environment.dialogflow.angularBot;
  readonly client = new ApiAiClient({ accessToken: this.token });
  conversation = new BehaviorSubject<Message[]>([]);
  responseHandler;

  constructor() {}

  setResponseHandler(responseHandler){
    this.responseHandler=responseHandler; 
  }

  //Send and receive messages via DialogFlow
  sendMessage(msg: string) {

    const userMessage = new Message(msg, 'user');    
    this.update(userMessage);
    return this.client.textRequest(msg)
               .then(res => {
                 //get text of message
                  const speech = res.result.fulfillment.speech;
                  //Create new message
                  const botMessage = new Message(
                      speech, 
                      'bot',
                      false,
                      res.result.action
                    );
                  this.update(botMessage);
               });
  }


  // Add message to source
  update(msg: Message) {
    console.log(Message);
    this.conversation.next([msg]);
  }

}
