import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'

const config: Config = {
  title: 'Fjorm',
  tagline: 'Modular drag-and-drop form builder for React',
  favicon: 'img/favicon.ico',

  url: 'https://WEeziel172.github.io',
  baseUrl: '/fjorm/',

  organizationName: 'WEeziel172',
  projectName: 'fjorm',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          editUrl: 'https://github.com/WEeziel172/fjorm/edit/main/website/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Fjorm',
      logo: {
        alt: 'Fjorm',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/WEeziel172/fjorm',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Introduction', to: '/intro' },
            { label: 'API Reference', to: '/api/config' },
            { label: 'Examples', to: '/examples' },
          ],
        },
        {
          title: 'Guides',
          items: [
            { label: 'Custom Components', to: '/guides/custom-components' },
            { label: 'Value Handling', to: '/guides/value-handling' },
            { label: 'Editor Primitives', to: '/guides/editor-primitives' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'GitHub', href: 'https://github.com/WEeziel172/fjorm' },
            { label: 'npm', href: 'https://www.npmjs.com/package/fjorm' },
          ],
        },
      ],
      copyright: `MIT © ${new Date().getFullYear()} Fjorm`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
}

export default config
