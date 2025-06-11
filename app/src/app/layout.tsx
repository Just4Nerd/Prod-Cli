import 'bootstrap/dist/css/bootstrap.css';
import '../styles/global.css'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-100">
      <body className="h-100 d-flex align-items-center bg-body-tertiary">
        {/* Layout UI */}
        {/* Place children where you want to render a page or nested layout */}
        {children}
      </body>
    </html>
  )
}