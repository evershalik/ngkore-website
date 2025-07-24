#!/usr/bin/env python3
"""
NgKore Website - Clean URL Development Server
This server serves clean URLs without .html extensions appearing in the browser
"""

import http.server
import socketserver
import os
import sys
import mimetypes
from urllib.parse import urlparse, unquote


class CleanURLHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        # Parse the requested path
        parsed_url = urlparse(self.path)
        requested_path = unquote(parsed_url.path)

        # Remove leading slash
        if requested_path.startswith('/'):
            requested_path = requested_path[1:]

        # Handle root path
        if not requested_path or requested_path == 'index':
            file_path = 'index.html'
        else:
            # Check if the requested path exists as a file
            if os.path.isfile(requested_path):
                file_path = requested_path
            # If not, try adding .html extension
            elif os.path.isfile(requested_path + '.html'):
                file_path = requested_path + '.html'
            else:
                self.send_404()
                return

        # Serve the file
        self.serve_file(file_path)

    def serve_file(self, file_path):
        try:
            with open(file_path, 'rb') as f:
                content = f.read()

            # Get MIME type
            mime_type, _ = mimetypes.guess_type(file_path)
            if mime_type is None:
                mime_type = 'application/octet-stream'

            # Send response
            self.send_response(200)
            self.send_header('Content-Type', mime_type)
            self.send_header('Content-Length', str(len(content)))

            # Security headers
            self.send_header('X-Content-Type-Options', 'nosniff')
            self.send_header('X-Frame-Options', 'DENY')
            self.send_header('X-XSS-Protection', '1; mode=block')

            self.end_headers()
            self.wfile.write(content)

        except FileNotFoundError:
            self.send_404()
        except Exception as e:
            self.send_500(str(e))

    def send_404(self):
        self.send_response(404)
        self.send_header('Content-Type', 'text/html')
        self.end_headers()
        html = '''
        <!DOCTYPE html>
        <html>
        <head>
            <title>404 - Page Not Found</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 50px; }
                h1 { color: #4A90E2; }
            </style>
        </head>
        <body>
            <h1>404 - Page Not Found</h1>
            <p>The requested page could not be found.</p>
            <p><a href="/">Return to Home</a></p>
        </body>
        </html>
        '''
        self.wfile.write(html.encode())

    def send_500(self, error):
        self.send_response(500)
        self.send_header('Content-Type', 'text/html')
        self.end_headers()
        html = f'''
        <!DOCTYPE html>
        <html>
        <head>
            <title>500 - Server Error</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 50px; }}
                h1 {{ color: #e74c3c; }}
            </style>
        </head>
        <body>
            <h1>500 - Server Error</h1>
            <p>An error occurred while processing your request.</p>
            <p>Error: {error}</p>
        </body>
        </html>
        '''
        self.wfile.write(html.encode())

    def log_message(self, format, *args):
        # Custom log format
        print(f"[{self.log_date_time_string()}] {format % args}")


def run_server(port=8000):
    """Run the clean URL development server"""

    # Change to the website directory
    web_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(web_dir)

    # Create server
    with socketserver.TCPServer(("", port), CleanURLHandler) as httpd:
        print("NgKore Website - Clean URL Server")
        print(f"Serving from: {web_dir}")
        print(f"Server URL: http://localhost:{port}")
        print("Clean URLs enabled (no .html extensions in browser)")
        print("\n Test these clean URLs:")
        print(f"   http://localhost:{port}/")
        print(f"   http://localhost:{port}/pages/about")
        print(f"   http://localhost:{port}/pages/contact")
        print(f"   http://localhost:{port}/pages/expertise")
        print(
            f"   http://localhost:{port}/pages/expertise/telecom-architecture")
        print("\n  Press Ctrl+C to stop the server\n")

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped")


if __name__ == "__main__":
    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("Invalid port number. Using default port 8000.")

    run_server(port)
