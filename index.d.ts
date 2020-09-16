declare function setRoute(route: string, router?: HTMLElement | string): void;
declare function onRouteSwitch(
	regex: RegExp | string,
	callback: () => any,
	once?: boolean,
	router?: HTMLElement | string
): void;
declare function initializeRouteButtons(
	elements: HTMLElement[] | void,
	router?: HTMLElement | string
): void;
