# Logging System Documentation

This document describes the comprehensive logging system implemented in the Agri-Smart backend.

## Overview

The logging system provides:
- **Structured logging** with JSON format for easy parsing
- **Request/response tracking** with unique request IDs
- **Performance monitoring** with timing metrics
- **Error tracking** with detailed context
- **Usage analytics** for API calls and features
- **System monitoring** with resource usage
- **Rich console output** for development

## Features

### 1. Structured Logging
- JSON format logs for production
- Rich console output for development
- Configurable log levels (DEBUG, INFO, WARNING, ERROR, CRITICAL)
- Automatic timestamp and context information

### 2. Request Tracking
- Unique request ID for each HTTP request
- Request/response timing
- Client IP and user agent tracking
- Error tracking with request context

### 3. Performance Monitoring
- Function execution timing
- API response time tracking
- Slow request detection
- Performance metrics aggregation

### 4. Error Tracking
- Detailed error context
- Error categorization
- Error frequency tracking
- Stack trace preservation

### 5. Usage Analytics
- API call tracking
- Feature usage monitoring
- User action tracking
- Analytics summaries

## Configuration

### Environment Variables

```bash
# Logging Configuration
LOG_LEVEL=INFO                    # DEBUG, INFO, WARNING, ERROR, CRITICAL
LOG_FILE=logs/app.log            # Path to log file
ENABLE_CONSOLE_LOGGING=true      # Enable console output
ENABLE_FILE_LOGGING=true         # Enable file logging
ENABLE_JSON_LOGGING=true         # Use JSON format for file logs
```

### Log Levels

- **DEBUG**: Detailed information for debugging
- **INFO**: General information about application flow
- **WARNING**: Warning messages for potential issues
- **ERROR**: Error messages for actual problems
- **CRITICAL**: Critical errors that may cause application failure

## Usage

### Basic Logging

```python
from src.logging_config import get_logger

logger = get_logger(__name__)

# Basic logging
logger.info("User logged in", user_id="123", action="login")
logger.error("Database connection failed", error_type="ConnectionError")
logger.debug("Processing request", request_data=data)
```

### Function Decorators

```python
from src.logging_config import log_function_call
from src.utils import monitor_performance, track_usage, track_errors

# Log function calls
@log_function_call(logger)
def my_function():
    pass

# Monitor performance
@monitor_performance("database_query")
def query_database():
    pass

# Track usage
@track_usage("user_registration")
def register_user():
    pass

# Track errors
@track_errors("api_call")
def api_call():
    pass
```

### Request Context

```python
from fastapi import Request

@router.post("/endpoint")
async def my_endpoint(request: Request):
    request_id = getattr(request.state, 'request_id', 'unknown')
    logger.info("Processing request", request_id=request_id)
```

## Monitoring Endpoints

### Health Check
```
GET /api/monitoring/health
```

### Performance Metrics
```
GET /api/monitoring/metrics
```

### Recent Logs
```
GET /api/monitoring/logs?lines=100
```

### Error Summary
```
GET /api/monitoring/errors
```

### Usage Analytics
```
GET /api/monitoring/analytics
```

### System Information
```
GET /api/monitoring/system-info
```

### Log Summary
```
POST /api/monitoring/logs/summary
```

## Log Format

### Console Output (Development)
```
2024-01-15 10:30:45.123 [INFO] src.routes.chat: Processing chat message
request_id=abc123 session_id=def456 message_length=50
```

### JSON Output (Production)
```json
{
  "timestamp": "2024-01-15T10:30:45.123456Z",
  "level": "INFO",
  "module": "src.routes.chat",
  "function": "send_message",
  "line": 45,
  "message": "Processing chat message",
  "request_id": "abc123",
  "session_id": "def456",
  "message_length": 50
}
```

## Middleware

### LoggingMiddleware
- Logs all HTTP requests and responses
- Generates unique request IDs
- Tracks request timing
- Logs client information

### PerformanceMiddleware
- Monitors request performance
- Detects slow requests
- Logs performance warnings

### ErrorLoggingMiddleware
- Catches unhandled exceptions
- Logs detailed error information
- Preserves request context

## Utilities

### PerformanceMonitor
```python
from src.utils import performance_monitor

# Record timing
performance_monitor.record_timing("database_query", 0.5)

# Record counter
performance_monitor.record_counter("user_login")

# Get summary
summary = performance_monitor.log_summary()
```

### ErrorTracker
```python
from src.utils import error_tracker

# Record error
error_tracker.record_error("DatabaseError", "Connection failed", {"user_id": "123"})

# Get summary
summary = error_tracker.log_error_summary()
```

### UsageAnalytics
```python
from src.utils import usage_analytics

# Track API call
usage_analytics.track_api_call("/api/chat", "POST", "user123")

# Track feature usage
usage_analytics.track_feature_usage("chat_translation", "user123")

# Get summary
summary = usage_analytics.log_analytics_summary()
```

## Best Practices

### 1. Use Appropriate Log Levels
- **DEBUG**: For detailed debugging information
- **INFO**: For general application flow
- **WARNING**: For potential issues
- **ERROR**: For actual problems
- **CRITICAL**: For critical failures

### 2. Include Context
```python
# Good
logger.info("User action", user_id=user.id, action="login", ip=request.client.host)

# Bad
logger.info("User logged in")
```

### 3. Use Structured Logging
```python
# Good
logger.error("API call failed", endpoint="/api/data", status_code=500, error=str(e))

# Bad
logger.error(f"API call to /api/data failed with status {status_code}: {error}")
```

### 4. Handle Sensitive Data
```python
# Don't log sensitive information
logger.info("User action", user_id=user.id, action="password_change")
# NOT: logger.info("User changed password", password=new_password)
```

### 5. Use Request IDs
```python
request_id = getattr(request.state, 'request_id', 'unknown')
logger.info("Processing request", request_id=request_id)
```

## Troubleshooting

### Common Issues

1. **Logs not appearing**
   - Check log level configuration
   - Verify log file path exists
   - Check file permissions

2. **Performance issues**
   - Monitor log file size
   - Use appropriate log levels
   - Consider log rotation

3. **Missing request IDs**
   - Ensure LoggingMiddleware is added
   - Check middleware order

### Log Rotation

For production, consider implementing log rotation:

```python
import logging.handlers

# Rotating file handler
handler = logging.handlers.RotatingFileHandler(
    'logs/app.log',
    maxBytes=10*1024*1024,  # 10MB
    backupCount=5
)
```

## Monitoring Dashboard

Consider implementing a monitoring dashboard using the provided endpoints:

- **Real-time metrics**: Use `/api/monitoring/metrics`
- **Error tracking**: Use `/api/monitoring/errors`
- **Usage analytics**: Use `/api/monitoring/analytics`
- **System health**: Use `/api/monitoring/system-info`

## Integration with External Tools

### ELK Stack (Elasticsearch, Logstash, Kibana)
- JSON logs are compatible with ELK
- Use structured logging for better parsing
- Configure log shipping to Elasticsearch

### Prometheus + Grafana
- Export metrics via `/api/monitoring/metrics`
- Create custom metrics endpoints
- Use Prometheus client library

### Sentry
- Integrate with error tracking
- Use structured logging for better error context
- Configure error reporting

## Security Considerations

1. **Sensitive Data**: Never log passwords, tokens, or personal information
2. **Log Access**: Restrict access to log files
3. **Log Retention**: Implement appropriate log retention policies
4. **Audit Logging**: Log security-relevant events
5. **Data Protection**: Ensure compliance with data protection regulations 