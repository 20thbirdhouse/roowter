declare function setRoute(route: string): string;
declare function onRouteSwitch(regex: RegExp | string, callback: () => any, once: boolean): void;
declare function onRouteSwitch(regex: RegExp | string, callback: () => any): void;
declare function initializeRouteButtons(elements: HTMLElement[] | void): void;
