import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './BillingModule.types';

type BillingModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class BillingModule extends NativeModule<BillingModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(BillingModule);
