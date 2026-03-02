declare module 'prismjs' {
  interface Languages {
    [key: string]: any
  }
  
  interface Prism {
    languages: Languages
    highlight: (code: string, grammar: any, language: string) => string
  }
  
  const prism: Prism
  export default prism
  export { prism as Prism }
}

declare module 'prismjs/components/*' {
  const component: any
  export default component
}
