import { FakeMailService } from '../notification';
import { MarketingService } from './marketing-service';
import { MarketingController } from './marketing-controller';
import { MarketingErrors } from './marketing-errors';
import WebServer from '../../shared/server';

export class MarketingModule {
  private fakeMailService: FakeMailService;
  private marketingService: MarketingService;
  private marketingController: MarketingController;

  private constructor() {
    this.fakeMailService = this.createFakeMailService();
    this.marketingService = this.createMarketingService();
    this.marketingController = this.createMarketingController();
  }

  static build() {
    return new MarketingModule();
  }

  private createFakeMailService() {
    return new FakeMailService();
  }

  private createMarketingService() {
    return new MarketingService(this.fakeMailService);
  }

  private createMarketingController() {
    return new MarketingController(this.marketingService, MarketingErrors);
  }

  public getMarketingController() {
    return this.marketingController;
  }

  public mountRouter(server: WebServer) {
    server.moutRouter('/marketing', this.marketingController.getRouter());
  }
}
