import logging
import sys
import os
from datetime import datetime
from pathlib import Path
from typing import Any, Dict
import structlog
from pythonjsonlogger import jsonlogger
from rich.console import Console
from rich.logging import RichHandler


class CustomJsonFormatter(jsonlogger.JsonFormatter):
    """Custom JSON formatter with additional fields"""
    
    def add_fields(self, log_record: Dict[str, Any], record: logging.LogRecord, message_dict: Dict[str, Any]) -> None:
        super().add_fields(log_record, record, message_dict)
        
        # Add timestamp
        log_record['timestamp'] = datetime.utcnow().isoformat()
        
        # Add log level
        log_record['level'] = record.levelname
        
        # Add module and function info
        log_record['module'] = record.module
        log_record['function'] = record.funcName
        log_record['line'] = record.lineno
        
        # Add process and thread info
        log_record['process_id'] = record.process
        log_record['thread_id'] = record.thread
        
        # Add request ID if available
        if hasattr(record, 'request_id'):
            log_record['request_id'] = record.request_id


def setup_logging(
    log_level: str = "INFO",
    log_file: str = "logs/app.log",
    enable_console: bool = True,
    enable_file: bool = True,
    enable_json: bool = True
) -> None:
    """
    Setup comprehensive logging configuration
    
    Args:
        log_level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        log_file: Path to log file
        enable_console: Whether to enable console logging
        enable_file: Whether to enable file logging
        enable_json: Whether to use JSON format for file logs
    """
    
    # Create logs directory if it doesn't exist
    log_path = Path(log_file)
    log_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Configure structlog
    structlog.configure(
        processors=[
            structlog.stdlib.filter_by_level,
            structlog.stdlib.add_logger_name,
            structlog.stdlib.add_log_level,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.UnicodeDecoder(),
            structlog.processors.JSONRenderer()
        ],
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )
    
    # Get numeric log level
    numeric_level = getattr(logging, log_level.upper(), logging.INFO)
    
    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(numeric_level)
    
    # Clear existing handlers
    root_logger.handlers.clear()
    
    # Console handler with rich formatting
    if enable_console:
        console_handler = RichHandler(
            console=Console(),
            show_time=True,
            show_path=True,
            markup=True,
            rich_tracebacks=True
        )
        console_handler.setLevel(numeric_level)
        root_logger.addHandler(console_handler)
    
    # File handler
    if enable_file:
        if enable_json:
            # JSON file handler
            file_handler = logging.FileHandler(log_file)
            file_handler.setLevel(numeric_level)
            json_formatter = CustomJsonFormatter(
                '%(timestamp)s %(level)s %(name)s %(module)s %(funcName)s %(lineno)d %(message)s'
            )
            file_handler.setFormatter(json_formatter)
        else:
            # Regular file handler
            file_handler = logging.FileHandler(log_file)
            file_handler.setLevel(numeric_level)
            formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(module)s:%(funcName)s:%(lineno)d - %(message)s'
            )
            file_handler.setFormatter(formatter)
        
        root_logger.addHandler(file_handler)
    
    # Set specific logger levels
    logging.getLogger("uvicorn").setLevel(logging.INFO)
    logging.getLogger("uvicorn.access").setLevel(logging.INFO)
    logging.getLogger("fastapi").setLevel(logging.INFO)
    
    # Log startup message
    logger = logging.getLogger(__name__)
    logger.info(
        "Logging system initialized",
        extra={
            "log_level": log_level,
            "log_file": log_file,
            "enable_console": enable_console,
            "enable_file": enable_file,
            "enable_json": enable_json
        }
    )


def get_logger(name: str) -> structlog.BoundLogger:
    """
    Get a structured logger instance
    
    Args:
        name: Logger name (usually __name__)
        
    Returns:
        Structured logger instance
    """
    return structlog.get_logger(name)


class RequestLogger:
    """Context manager for logging request/response cycles"""
    
    def __init__(self, logger: structlog.BoundLogger, request_id: str = None):
        self.logger = logger
        self.request_id = request_id or f"req_{datetime.utcnow().strftime('%Y%m%d_%H%M%S_%f')}"
        self.start_time = None
    
    def __enter__(self):
        self.start_time = datetime.utcnow()
        self.logger.info(
            "Request started",
            request_id=self.request_id,
            start_time=self.start_time.isoformat()
        )
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        end_time = datetime.utcnow()
        duration = (end_time - self.start_time).total_seconds()
        
        if exc_type:
            self.logger.error(
                "Request failed",
                request_id=self.request_id,
                duration=duration,
                error_type=exc_type.__name__,
                error_message=str(exc_val),
                end_time=end_time.isoformat()
            )
        else:
            self.logger.info(
                "Request completed",
                request_id=self.request_id,
                duration=duration,
                end_time=end_time.isoformat()
            )


def log_function_call(logger: structlog.BoundLogger, func_name: str = None):
    """
    Decorator to log function calls with parameters and execution time
    
    Args:
        logger: Logger instance
        func_name: Optional function name override
    """
    def decorator(func):
        def wrapper(*args, **kwargs):
            func_name_to_log = func_name or func.__name__
            
            # Log function entry
            logger.info(
                "Function called",
                function=func_name_to_log,
                args_count=len(args),
                kwargs_keys=list(kwargs.keys())
            )
            
            try:
                result = func(*args, **kwargs)
                logger.info(
                    "Function completed successfully",
                    function=func_name_to_log
                )
                return result
            except Exception as e:
                logger.error(
                    "Function failed",
                    function=func_name_to_log,
                    error_type=type(e).__name__,
                    error_message=str(e)
                )
                raise
        
        return wrapper
    return decorator 