import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000');  // Make sure this matches your backend URL
  }

  // Send a message to the server
  sendMessage(data: { username: string, message: string }): void {
    this.socket.emit('sendMessage', data);
  }

  // Listen for incoming messages
  onReceiveMessage(): Observable<{ username: string, message: string }> {
    return new Observable((observer) => {
      this.socket.on('receiveMessage', (data: { username: string, message: string }) => {
        observer.next(data);  // Notify the subscriber with the message object
      });
    });
  }

  // Notify when a user joins
  notifyUserJoined(username: string): void {
    this.socket.emit('userJoined', username);
  }

  // Listen for user join notifications
  onUserJoined(): Observable<string> {
    return new Observable((observer) => {
      this.socket.on('userJoinedNotification', (notification: string) => {
        observer.next(notification);
      });
    });
  }
}

// import { Injectable } from '@angular/core';
// import { io, Socket } from 'socket.io-client';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class SocketService {
//   private socket: Socket;

//   constructor() {
//     this.socket = io('http://localhost:3000');  // Connect to the server
//   }

//   // Join a channel
//   joinChannel(channelId: string): void {
//     this.socket.emit('joinChannel', channelId);
//   }

//   // Send a message
//   sendMessage(channelId: string, message: string): void {
//     this.socket.emit('sendMessage', { channelId, message });
//   }

//   // Listen for incoming messages
//   onReceiveMessage(): Observable<string> {
//     return new Observable(observer => {
//       this.socket.on('receiveMessage', (message: string) => {
//         observer.next(message);
//       });
//     });
//   }

//   // Listen for user joining notifications
//   onUserJoined(): Observable<string> {
//     return new Observable(observer => {
//       this.socket.on('userJoined', (notification: string) => {
//         observer.next(notification);
//       });
//     });
//   }
// }
