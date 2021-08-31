import 'bootstrap/dist/css/bootstrap.css'
import '../styles/globals.css'
import Link from 'next/link'

function App({ Component, pageProps }) {
  return (
    <div className="container">
      <h1>Welcome</h1>
      <nav className="nav">
        <Link href="/">
          <a className="nav-link">
            Home
          </a>
        </Link>
        <Link href="/dashboard">
          <a className="nav-link">
            Dashboard
          </a>
        </Link>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default App;
