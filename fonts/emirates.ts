import localFont from 'next/font/local'

export const emirates = localFont({
  src: [
    {
      path: '../public/fonts/Emirates-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/Emirates-LightItalic.ttf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../public/fonts/Emirates-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Emirates-MediumItalic.ttf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../public/fonts/Emirates-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/Emirates-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-emirates',
  display: 'swap',
})