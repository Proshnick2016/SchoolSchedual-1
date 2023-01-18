import { Body, Controller, OnUndefined, Post } from 'routing-controllers';
import 'reflect-metadata';
import { loginModel } from '../model/info';
import { postHttp } from './logInDataParse';
import { response } from 'express';

@Controller()
export class UserController {
  @Post('/userLogIn')
  @OnUndefined(204)
  async postOne (@Body() logInFormData: loginModel) {
    // HTTP POST ЗАПРОС на сайт школы, для получения 'cookie'
    const recievedSchoolSchedual = postHttp('https://edu.gounn.ru/ajaxauthorize', {
      'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryWG83INxnwv2VLIZR',
      username: logInFormData.login,
      password: logInFormData.password
    });
    
    return recievedSchoolSchedual;
  }
}
