declare module "firebase/auth" {
  import { Persistence } from "@firebase/auth";
  export function getReactNativePersistence(storage: any): Persistence;
  export * from "@firebase/auth";
}
