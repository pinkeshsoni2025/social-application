export class User {
    gettoken: never | undefined;
  
    constructor(
        public _id: string,
        public name: string,
        public surname: string,
        public nick: string,
        public email: string,
        public password: string,
        public role: string,
        public image: string
    ) {}
}


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

