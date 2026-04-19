import Server from './server';
import { prisma } from './database';

import { PostRepo } from './persistence/post-repo';
import { UserRepo } from './persistence/user-repo';

import { FakeMailService } from './services/fake-mail-service';
import { MarketingService } from './services/marketing-service';
import { PostService } from './services/post-service';
import { UserService } from './services/user-service';

import { MarketingController } from './controllers/marketing-controller';
import { PostController } from './controllers/post-controller';
import { UserController } from './controllers/user-controller';

const userRepo = new UserRepo(prisma);
const userService = new UserService(userRepo);
const userController = new UserController(userService);

const postRepo = new PostRepo(prisma);
const postService = new PostService(postRepo);
const postController = new PostController(postService);

const fakeMailService = new FakeMailService();
const marketingService = new MarketingService(fakeMailService);
const marketingController = new MarketingController(marketingService);

const server = new Server(userController, postController, marketingController);

export default server;
