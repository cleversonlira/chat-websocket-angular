import {Injectable} from '@angular/core';
import {Observable, Observer, Subject} from 'rxjs';
import {AnonymousSubject} from 'rxjs/internal/Subject';
import {map} from 'rxjs/operators';

export interface Message {
  source: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class WebsocketService {
  private subject: AnonymousSubject<MessageEvent> | undefined;
  public messages: Subject<Message>;
  CHAT_URL = "ws://192.168.1.67:8080/chat";
  websocket: WebSocket;

  constructor() {
    this.websocket = new WebSocket(this.CHAT_URL);
    this.messages = <Subject<Message>>this.connect(this.CHAT_URL).pipe(
      map(
        (response: MessageEvent): Message => {
          console.log(response.data);
          let data = JSON.parse(response.data)
          return data;
        }
      )
    );
  }

  public connect(url: string | URL): AnonymousSubject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
      console.log("Successfully connected: " + url);
    }
    return this.subject;
  }

  private create(url: string | URL): AnonymousSubject<MessageEvent> {
    let recebedorDeMensagem = new Observable((obs: Observer<MessageEvent>) => {
      this.websocket.onmessage = obs.next.bind(obs);
      this.websocket.onopen = () => console.log("Conexao foi aberta!");
      this.websocket.onerror = (evt) => console.log("Erro de conexão!!");
      this.websocket.onclose = () => console.log("Conexao foi encerrada!");
      return this.websocket.close.bind(this.websocket);
    });
    return new AnonymousSubject<MessageEvent>(this.enviadorDeMensagem(), recebedorDeMensagem);
  }

  enviadorDeMensagem():Observer<MessageEvent<any>> {
    return {
      complete(): void {
      }, error(err: any): void {
      },
      next: (data: Object) => {
        console.log('Dados que serão enviados: ', data);
        if (WebSocket.OPEN === this.websocket.readyState) {
          this.websocket.send(JSON.stringify(data));
        }
      }
    };
  }

}
