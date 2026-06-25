import { Component } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-6 text-center gap-4 relative">
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <p className="text-sm text-muted-foreground max-w-md">An unexpected error occurred. Please refresh the page or return home.</p>
          <Link to="/" className="text-sm px-4 py-2 rounded-xl bg-primary text-primary-foreground no-underline">Go home</Link>
        </div>
      );
    }
    return this.props.children;
  }
}
