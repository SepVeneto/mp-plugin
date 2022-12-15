export function isAppVue(id: string) {
  return id.endsWith('App.vue')
}

export function isEntryPage(id: string, entryPages: string[]) {
  return id.endsWith('.vue') && entryPages.includes(id.replace('.vue', ''))
}
