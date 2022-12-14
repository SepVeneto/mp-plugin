export function isAppVue(id: string) {
  return id.endsWith('App.vue')
}

export function isEntryPage(id: string, entryList: string[]) {
  return id.endsWith('.vue') && entryList.includes(id.replace('.vue', ''))
}
