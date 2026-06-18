import { useRouter } from 'next/router'

export default {
  logo: <strong>FRT FinOps</strong>,
  project: {
    link: 'https://github.com/alan-do/frt-finops-gitbook'
  },
  i18n: [
    { locale: 'vi', text: 'Tiếng Việt' },
    { locale: 'en', text: 'English' }
  ],
  useNextSeoProps() {
    return {
      titleTemplate: '%s – FRT FinOps'
    }
  },
  primaryHue: 20,
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true
  },
  // Cache buster for Vercel: 1
}
