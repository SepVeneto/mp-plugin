type Page = {
  path: string
  style: Record<string, string>
  ROUTER_VIEW_EXCLUDE?: boolean
}
export interface PageJSON {
  easycom: {
    autoscan?: boolean
    custom?: Record<string, string>
  }
  condition: {
    current: number
    list: Array<{ name: string, path: string}>
  }
  subPackages?: Array<{root: string, pages: Page[]}>
  pages: Page[]
  tabBar: {
    color?: string
    selectedColor?: string
    borderStyle?: string
    backgroundColor?: string
    list: {
      pagePath: string
      iconPath: string
      selectedIconPath: string
      text: string
    }[]
  }
  permission?: Record<string, string>
  globalStyle: Record<string, string>
}
