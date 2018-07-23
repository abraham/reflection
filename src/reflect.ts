import { Reflection } from './index';

// TODO: Is there a better way to do this?
declare global {
  interface Window {
    Reflect: any;
  }
}

window.Reflect = Reflection;
