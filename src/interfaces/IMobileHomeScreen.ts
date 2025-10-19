// interfaces/IMobileHomeScreen.ts
export interface IMobileHomeScreen {
  isPageLoaded(): Promise<boolean>;
  performSearch(term: string): Promise<void>;
  getPageTitle(): Promise<string>;
  navigateToTab(tabName: string): Promise<void>;
  handlePermissions(): Promise<void>;
  swipeLeft(): Promise<void>;
  swipeRight(): Promise<void>;
  swipeUp(): Promise<void>;
  swipeDown(): Promise<void>;
  pressBackButton(): Promise<void>;
  waitForPageToLoad(): Promise<void>;
}
