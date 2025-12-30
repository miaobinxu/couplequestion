import { requireNativeView } from 'expo';
import * as React from 'react';

import { BillingModuleViewProps } from './BillingModule.types';

const NativeView: React.ComponentType<BillingModuleViewProps> =
  requireNativeView('BillingModule');

export default function BillingModuleView(props: BillingModuleViewProps) {
  return <NativeView {...props} />;
}
