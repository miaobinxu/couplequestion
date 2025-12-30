// Reexport the native module. On web, it will be resolved to BillingModule.web.ts
// and on native platforms to BillingModule.ts
export { default } from './src/BillingModule';
export { default as BillingModuleView } from './src/BillingModuleView';
export * from  './src/BillingModule.types';
