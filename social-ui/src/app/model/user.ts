import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Identity } from "../models/api-response";
import { Follow } from "../models/follow";
import { User } from "../models/user";
import { SidebarComponent } from "../pages/sidebar/sidebar.component";
import { FollowService } from "../services/follow.service";
import { GLOBAL } from "../services/global";
import { UserService } from "../services/user.service";

export interface UserLogin {
  username: string;
  password: string;
}

export interface UserRegister {
  username: string;
  password: string;
  passwordConfirmation: string;
  fullname: string;
}

export interface UserResponse {
  id: string;
  username: string;
  fullName: string;
  bio: string;
  roles: any;
  enabled: boolean;
  mfaEnabled: boolean;
}


export interface AuthenticationResponseDTO {
  accessToken: string;
  refreshToken: string;
  isMfa: boolean;
}
