import {Base} from '../Utils/Base';
import { fixture } from '../Utils/fixture';
import { config } from 'dotenv';

export class Homepage extends Base {  

  public static async navigateToHomePageUrl() {
    const url = process.env.Base_URL;
    if (!url) {
      throw new Error('Environment variable Base_URL is not defined');
    }
    await this.landOn(url);
  }
}