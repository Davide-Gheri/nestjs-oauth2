module.exports = {
  title: 'NestJs OAuth2',
  tagline: 'The tagline of my site',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'Davide-Gheri', // Usually your GitHub org/user name.
  projectName: 'nestjs-oauth2', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'NestJs OAuth2',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
      },
      links: [
        {
          to: 'docs/',
          // activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          to: 'docs/api/introduction',
          // activeBasePath: 'docs/api',
          label: 'API',
          position: 'left',
        },
        {
          href: 'https://github.com/Davide-Gheri/nestjs-oauth2',
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
            {
              label: 'Documentation',
              to: 'docs/',
            },
            {
              label: 'API Documentation',
              to: 'docs/api/introduction',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} NestJs OAuth2, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // routeBasePath: '/',
          homePageId: 'getting-started',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        // },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
