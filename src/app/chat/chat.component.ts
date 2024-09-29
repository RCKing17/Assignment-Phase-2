import { Component, OnInit, ViewChild, ElementRef, Optional } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SocketService } from '../services/socket.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { io } from 'socket.io-client';
import Peer from 'peerjs';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}
const BACKEND_URL = 'http://localhost:3000/';

interface MessageData {
  username: string;
  message: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {

  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;
  currentUser: string = 'You'; // You can dynamically get the current user’s name
  remoteUser: string = ''; // Will be set when the remote peer connects
  socket: any;
  messages: (MessageData)[] = []; // Define array for messages with profile image
  notification: string = '';
  username: string = '';
  currentMessage: string = '';
  selectedFile: File | null = null;
  peer: any;
  remotePeerId: string = '';
  localStream: MediaStream | null = null;
  myStream: any;
  profileImage: string = ''; // Profile image for the logged-in user


  constructor(private router: Router, private http: HttpClient, private socketService: SocketService) {}
  
//   ngOnInit(): void {
//     this.username = localStorage.getItem('username') || 'Unknown User';

//     this.socketService.onReceiveMessage().subscribe((data: { username: string, message: string, media?: string }) => {
//       this.messages.push(data);
//     });
//   }

//   // Handle file selection
//   onFileSelected(event: any): void {
//     if (event.target.files.length > 0) {
//       this.selectedFile = event.target.files[0];
//     }
//   }

//   // Send a message with or without media
//   sendMessage(): void {
//     if (this.currentMessage.trim() || this.selectedFile) {
//       const messageData = { username: this.username, message: this.currentMessage, media: '' };

//       if (this.selectedFile) {
//         const formData = new FormData();
//         formData.append('media', this.selectedFile);

//         this.http.post('http://localhost:3000/uploads/', formData).subscribe((res: any) => {
//           messageData.media = res.filePath;  // Get file URL from backend response
//           this.socketService.sendMessage(messageData);  // Send message with media
//           this.messages.push(messageData);
//           this.selectedFile = null;  // Clear file after upload
//         });
//       } else {
//         this.socketService.sendMessage(messageData);  // Send just the message
//         this.messages.push(messageData);
//       }

//       this.currentMessage = '';
//     }
//   }

//   // Helper functions to check file type
//   isImage(url: string): boolean {
//     return url.match(/\.(jpeg|jpg|png|gif)$/) != null;
//   }

//   isVideo(url: string): boolean {
//     return url.match(/\.(mp4|mov|avi)$/) != null;
//   }
// }
  ngOnInit(): void {
    
    // Retrieve the username from local storage
    this.username = localStorage.getItem('username') || 'Unknown User';
    


     // Initialize socket connection
     this.socket = io('http://localhost:3000', {
      query: { token: localStorage.getItem('token') }
    });

    this.socket.on('connect', () => {
      console.log('Connected to socket');
    });
     
    // Listen for incoming messages
    this.socketService.onReceiveMessage().subscribe((data: MessageData) => {
      this.messages.push({
        username: data.username,
        message: data.message
      });
    });

    
    // Listen for user joining notifications
    this.socketService.onUserJoined().subscribe((notification: string) => {
      this.notification = notification;
    });

    // Initialize PeerJS
   this.peer = new Peer({
    host: 'localhost',
    port: 3001,  // Adjust this to your PeerJS server's port if needed
    path: '/peerjs'
 });

 this.peer.on('open', (id: string) => {
    console.log('PeerJS ID: ', id);
    // You can send this ID to the backend or store it in your application state
 });

 // Listen for incoming calls
 this.peer.on('call', (call: any) => {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
          call.answer(stream); // Answer the call with your stream

          // Show your own video
          const localVideo = document.getElementById('localVideo') as HTMLVideoElement;
          if (localVideo) {
              localVideo.srcObject = stream;
          }

          call.on('stream', (remoteStream: MediaStream) => {
              // Show the remote video stream
              const remoteVideo = document.getElementById('remoteVideo') as HTMLVideoElement;
              if (remoteVideo) {
                  remoteVideo.srcObject = remoteStream;
              }
          });
      })
      .catch((err) => console.error('Failed to get local stream', err));
 });
}

  // Send a message to the chat
  sendMessage(): void {
    if (this.currentMessage.trim()) {
      const messageData: MessageData = {
        username: this.username,  // Include username with message
        message: this.currentMessage,
       
      };

      this.socketService.sendMessage(messageData);  // Send message with username
      this.messages.push(messageData);  // Show your own message
      this.currentMessage = '';
    }
  }
 
  notifyUserJoined(username: string): void {
    this.socketService.notifyUserJoined(username);
  }

  // Start video call
  startVideoCall(remotePeerId: string): void {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        // Display your own video stream
        const localVideo = this.localVideo.nativeElement;
        localVideo.srcObject = stream;
  
        // Initiate the call to the remote peer
        const call = this.peer.call(remotePeerId, stream);
  
        // Listen for the remote stream from the other peer
        call.on('stream', (remoteStream: MediaStream) => {
          const remoteVideo = this.remoteVideo.nativeElement;
          remoteVideo.srcObject = remoteStream;
          this.remoteUser = remotePeerId;
        });
      })
      .catch(err => console.error('Failed to get media: ', err));
  }
  // startVideoCall(remotePeerId: string): void {
  //   navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  //     .then((stream) => {
  //       this.localStream = stream;
  //       // Show local video stream
  //       const localVideo = document.getElementById('localVideo') as HTMLVideoElement;
  //       if (localVideo) {
  //         localVideo.srcObject = stream;
  //       }

  //       // Call the remote peer
  //       const call = this.peer.call(remotePeerId, stream);
  //       call.on('stream', (remoteStream: MediaStream) => {
  //         // Show remote video stream
  //         const remoteVideo = document.getElementById('remoteVideo') as HTMLVideoElement;
  //         if (remoteVideo) {
  //           remoteVideo.srcObject = remoteStream;
  //         }
  //       });
  //     })
  //     .catch((err) => {
  //       console.error('Failed to get local stream', err);
  //     });
  // }

  // Listen for incoming calls
  listenForIncomingCalls(): void {
    this.peer.on('call', (call: any) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          call.answer(stream); // Answer the call with your stream
          call.on('stream', (remoteStream: MediaStream) => {
            const remoteVideo = this.remoteVideo.nativeElement;
            remoteVideo.srcObject = remoteStream;
            this.remoteUser = call.peer;
          });
        })
        .catch(err => console.error('Failed to get media: ', err));
    });
  }
 
}
