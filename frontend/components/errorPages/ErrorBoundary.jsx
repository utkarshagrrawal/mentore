import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      window.location.href = "/500";
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
