import time
import uuid
from typing import Callable
from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

from src.logging_config import get_logger, RequestLogger


class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware for logging HTTP requests and responses"""
    
    def __init__(self, app: ASGIApp):
        super().__init__(app)
        self.logger = get_logger(__name__)
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Generate unique request ID
        request_id = str(uuid.uuid4())
        
        # Add request ID to request state
        request.state.request_id = request_id
        
        # Log request details
        self.logger.info(
            "HTTP Request received",
            request_id=request_id,
            method=request.method,
            url=str(request.url),
            client_ip=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
            content_length=request.headers.get("content-length")
        )
        
        # Track timing
        start_time = time.time()
        
        try:
            # Process request
            response = await call_next(request)
            
            # Calculate duration
            duration = time.time() - start_time
            
            # Log response details
            self.logger.info(
                "HTTP Response sent",
                request_id=request_id,
                status_code=response.status_code,
                duration=duration,
                content_length=response.headers.get("content-length")
            )
            
            return response
            
        except Exception as e:
            # Calculate duration
            duration = time.time() - start_time
            
            # Log error details
            self.logger.error(
                "HTTP Request failed",
                request_id=request_id,
                duration=duration,
                error_type=type(e).__name__,
                error_message=str(e)
            )
            
            # Return error response
            return JSONResponse(
                status_code=500,
                content={"detail": "Internal server error", "request_id": request_id}
            )


class PerformanceMiddleware(BaseHTTPMiddleware):
    """Middleware for performance monitoring"""
    
    def __init__(self, app: ASGIApp, slow_request_threshold: float = 1.0):
        super().__init__(app)
        self.logger = get_logger(__name__)
        self.slow_request_threshold = slow_request_threshold
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start_time = time.time()
        
        # Process request
        response = await call_next(request)
        
        # Calculate duration
        duration = time.time() - start_time
        
        # Log slow requests
        if duration > self.slow_request_threshold:
            self.logger.warning(
                "Slow request detected",
                request_id=getattr(request.state, 'request_id', 'unknown'),
                method=request.method,
                url=str(request.url),
                duration=duration,
                threshold=self.slow_request_threshold
            )
        
        return response


class ErrorLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware for detailed error logging"""
    
    def __init__(self, app: ASGIApp):
        super().__init__(app)
        self.logger = get_logger(__name__)
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        try:
            return await call_next(request)
        except Exception as e:
            # Log detailed error information
            self.logger.error(
                "Unhandled exception in request",
                request_id=getattr(request.state, 'request_id', 'unknown'),
                method=request.method,
                url=str(request.url),
                error_type=type(e).__name__,
                error_message=str(e),
                headers=dict(request.headers),
                query_params=dict(request.query_params)
            )
            raise 