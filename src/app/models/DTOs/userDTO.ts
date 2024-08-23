export interface UserDTO {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    newPassword?: string;
    newPasswordAgain?: string;
    role: number;
    id: number;
    action: string;
    idSkole: number;
  }
  