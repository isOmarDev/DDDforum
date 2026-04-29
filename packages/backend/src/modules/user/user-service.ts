import { CreateUserDTO } from './user-dto';
import { UserRepo } from './user-repo';
import {
  EmailAlreadyInUseException,
  UsernameAlreadyTakenException,
} from './user-exceptions';

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

    const { password, ...user } = await this.userRepo.create(dto);
    return user;
  }

  public async getUsers(filters?: { email?: string }) {
    const users = await this.userRepo.findAll(filters);
    return users.map((user) => {
      const { password, ...restUser } = user;
      return restUser;
    });
  }
}
