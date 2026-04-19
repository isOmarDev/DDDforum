export class FakeMailService {
  public async addEmailToList(email: string): Promise<string> {
    console.log(`[FakeMailService] Adding ${email} to mailing list...`);

    // simulate async behavior
    await new Promise((resolve) => setTimeout(resolve, 200));

    return email;
  }
}
