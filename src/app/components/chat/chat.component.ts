import {Component, OnInit} from '@angular/core';
import {Message, WebsocketService} from "../application/websocket.service";
import {Mensagem} from "../domain/mensagem";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {

  objetoDeEnvio: Mensagem = {
    user: '',
    message: ''
  };

  objetoRecebido: Mensagem = {
    user: '',
    message: ''
  };

  historico: string = '';

  constructor(private service: WebsocketService) {}

  ngOnInit(): void {}

  receberMensagem() {
    console.log("Receber foi chamado!!")
    this.service.messages.subscribe(objetoRecebidoDoServer => {
      console.log("from server: " + objetoRecebidoDoServer)
      this.objetoRecebido = (objetoRecebidoDoServer as unknown as Mensagem);
      this.historico += '\n' + this.objetoRecebido.message;
    });
  }

  enviaMensagem() {
    if (this.objetoDeEnvio.message.length == 0) return;
    this.service.messages.next((this.objetoDeEnvio as unknown as Message));
    this.receberMensagem();
    this.objetoDeEnvio.message = '';
  }

}
