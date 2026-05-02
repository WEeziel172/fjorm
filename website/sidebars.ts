import type { SidebarsConfig } from '@docusaurus/plugin-content-docs'

const sidebars: SidebarsConfig = {
  docs: [
    'intro',
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api/config',
        'api/form-builder',
        'api/form-display',
        'api/hooks',
        'api/types',
        'api/layout-primitives',
        'api/display-components',
        'api/atoms',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/custom-components',
        'guides/value-handling',
        'guides/editor-primitives',
        'guides/custom-form-builder',
        'guides/hook-usage',
      ],
    },
    'examples',
  ],
}

export default sidebars
