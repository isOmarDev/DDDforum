import { CreateUserDTO } from '../dtos/userDTO';
import { UserRepo } from '../persistence/user-repo';
import {
  EmailAlreadyInUseException,
  UsernameAlreadyTakenException,
} from '../shared/errors/exceptions';

export class UserService {
  constructor(private userRepo: UserRepo) {}

  public async createUser(dto: CreateUserDTO) {
    const existingUserByEmail = await this.userRepo.findByEmail(dto.email);

    if (existingUserByEmail) {
      throw new EmailAlreadyInUseException();
    }

    const existingUserByUsername = await this.userRepo.findByUsername(
      dto.username,
    );

    if (existingUserByUsername) {
      throw new UsernameAlreadyTakenException();
    }

    const user = await this.userRepo.create(dto);
    return user;
  }

  public async getUsers(filters?: { email?: string }) {
    return await this.userRepo.findAll(filters);
  }
}
