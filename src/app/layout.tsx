import './globals.css'

export const metadata = {
  title: 'BPM - Processos InternosControle de Workflow',
  description: 'Sistema de workflow para gerenciar o processo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/LOGO-INSTA.png" type="image/png" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}