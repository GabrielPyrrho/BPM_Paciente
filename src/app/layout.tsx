import './globals.css'

export const metadata = {
  title: 'BPM - Internamento de Paciente',
  description: 'Sistema de workflow para gerenciar o processo de internamento de pacientes',
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
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}