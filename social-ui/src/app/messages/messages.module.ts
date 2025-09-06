// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


// Rutas
import { MessagesRoutingModule } from './messages.routing';

// Components
import { MainComponent } from './components/main/main.component';
import { AddComponent } from './components/add/add.component';
import { ReceivedComponent } from './components/received/received.component';
import { SendedComponent } from './components/sended/sended.component';
import { ConversationComponent } from './components/conversation/conversation.component';
import { UsersComponent } from './components/users/users.component';

// Services
import {UserService} from '../services/user.service';
import { AuthGuard } from '../guards/auth.guard';

@NgModule({
  declarations: [
   
  ],
  imports: [
    CommonModule,
    FormsModule,
    MessagesRoutingModule,
   
    
  ],
  
  providers: [
    UserService,
   
  ]
})
export class MessagesModule { }
