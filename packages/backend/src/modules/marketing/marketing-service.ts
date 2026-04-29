import { FakeMailService } from '../notification/fake-mail-service';
import { AddEmailToListDTO } from './marketing-dto';
import { EmailNotAddedToMailListException } from './marketing-exceptions';

export class MarketingService {
  constructor(private fakeMailService: FakeMailService) {}

  public async addEmailToList(dto: AddEmailToListDTO) {
    const { email } = dto;

    const result = this.fakeMailService.addEmailToList(email);

    if (!result) {
      throw new EmailNotAddedToMailListException(email);
    }

    return result;
  }
}
