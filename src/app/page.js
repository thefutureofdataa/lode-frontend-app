import Link from "next/link"

export default function Home() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Welcome to My Next.js App</h1>
      <div style={{ marginTop: "2rem" }}>
        <Link 
          href="/dashboard" 
          style={{
            display: "inline-block",
            padding: "1rem 2rem",
            backgroundColor: "#667eea",
            color: "white",
            textDecoration: "none",
            borderRadius: "6px",
            fontWeight: "500",
            margin: "0.5rem"
          }}
        >
          Go to Protected Dashboard
        </Link>
        <Link 
          href="/auth/login" 
          style={{
            display: "inline-block",
            padding: "1rem 2rem",
            backgroundColor: "#28a745",
            color: "white",
            textDecoration: "none",
            borderRadius: "6px",
            fontWeight: "500",
            margin: "0.5rem"
          }}
        >
          Login
        </Link>
      </div>
    </div>
  );
}
