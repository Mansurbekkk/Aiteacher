"""Vercel serverless entry point for FastAPI"""
from app.main import app
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request


class StripPrefixMiddleware(BaseHTTPMiddleware):
    """/_/backend prefiksini striplab FastAPI ga yuboradi"""
    async def dispatch(self, request: Request, call_next):
        path = request.scope.get("path", "")
        if path.startswith("/_/backend"):
            new_path = path[len("/_/backend"):]
            request.scope["path"] = new_path or "/"
            raw = request.scope.get("raw_path", b"")
            if raw.startswith(b"/_/backend"):
                request.scope["raw_path"] = raw[len(b"/_/backend"):] or b"/"
        return await call_next(request)


app.add_middleware(StripPrefixMiddleware)
