import { IsNotEmpty } from 'class-validator';

export class loginModel {
  @IsNotEmpty()
    login: string;

  @IsNotEmpty()
    password: string;
}
