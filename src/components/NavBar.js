import Link from 'next/link'

const NavBar = () => {
  return (
    <nav className="navbar">
      <Link href="/">
        <span className="logo">Lode</span>
      </Link>
      <Link href="/about">About</Link>
      <Link href="/auth/signin">Sign In</Link>
      <Link href="/auth/register">Register</Link>
    </nav>
  )
}

export default NavBar