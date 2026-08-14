import { Component } from '@angular/core';
import { LoggerMessage, WebSocketService } from '../webSocket/web-socket.service';

@Component({
  selector: 'app-logger-test',
  standalone: true,
  imports: [],
  templateUrl: './logger-test.html',
  styleUrl: './logger-test.css'
})
export class LoggerTestComponent {
  latestLogger: LoggerMessage | null = null;

  constructor(private webSocketService: WebSocketService) {
    this.webSocketService.receiveLogger().subscribe((log) => {
      this.latestLogger = log;
      console.log('LOGGER TEST:', log);
    });
  }
}