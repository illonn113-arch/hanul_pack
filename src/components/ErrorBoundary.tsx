import { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught Error caught by ErrorBoundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">한울팩 홈페이지</h2>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              화면을 불러오는 도중 오류가 발생했습니다.<br />아래 버튼을 눌러 페이지를 다시 불러와주세요.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3.5 bg-[#FF6321] hover:bg-[#E5591D] text-white font-bold rounded-xl transition-all shadow-md"
            >
              페이지 새로고침
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
