import * as React from 'react';

import { BillingModuleViewProps } from './BillingModule.types';

export default function BillingModuleView(props: BillingModuleViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
