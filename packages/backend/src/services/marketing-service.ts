import { AddEmailToListDTO } from '../dtos/marketingDTO';
import { EmailNotAddedToMailListException } from '../shared/errors/exceptions';
import { FakeMailService } from './fake-mail-service';

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
