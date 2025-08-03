import time
import functools
from typing import Any, Dict, Optional, Callable
from datetime import datetime, timedelta
from collections import defaultdict, Counter
from src.logging_config import get_logger

logger = get_logger(__name__)


class PerformanceMonitor:
    """Monitor and log performance metrics"""
    
    def __init__(self):
        self.metrics = defaultdict(list)
        self.counters = Counter()
        self.start_time = datetime.utcnow()
    
    def record_timing(self, operation: str, duration: float, **kwargs):
        """Record timing for an operation"""
        self.metrics[f"{operation}_timing"].append(duration)
        logger.info(
            "Performance metric recorded",
            operation=operation,
            duration=duration,
            **kwargs
        )
    
    def record_counter(self, event: str, value: int = 1, **kwargs):
        """Record a counter event"""
        self.counters[event] += value
        logger.info(
            "Counter event recorded",
            event=event,
            value=value,
            total=self.counters[event],
            **kwargs
        )
    
    def get_average_timing(self, operation: str) -> Optional[float]:
        """Get average timing for an operation"""
        timings = self.metrics.get(f"{operation}_timing", [])
        return sum(timings) / len(timings) if timings else None
    
    def get_total_count(self, event: str) -> int:
        """Get total count for an event"""
        return self.counters.get(event, 0)
    
    def log_summary(self):
        """Log a summary of all metrics"""
        summary = {
            "uptime_seconds": (datetime.utcnow() - self.start_time).total_seconds(),
            "total_events": sum(self.counters.values()),
            "event_counts": dict(self.counters),
            "average_timings": {
                op.replace("_timing", ""): self.get_average_timing(op.replace("_timing", ""))
                for op in self.metrics.keys()
                if op.endswith("_timing")
            }
        }
        
        logger.info("Performance summary", **summary)
        return summary


# Global performance monitor instance
performance_monitor = PerformanceMonitor()


def monitor_performance(operation: str):
    """Decorator to monitor performance of functions"""
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            start_time = time.time()
            
            try:
                result = func(*args, **kwargs)
                duration = time.time() - start_time
                performance_monitor.record_timing(operation, duration)
                return result
            except Exception as e:
                duration = time.time() - start_time
                performance_monitor.record_timing(f"{operation}_error", duration)
                performance_monitor.record_counter(f"{operation}_errors")
                raise
        
        return wrapper
    return decorator


def track_usage(event: str):
    """Decorator to track usage of functions"""
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            try:
                result = func(*args, **kwargs)
                performance_monitor.record_counter(event)
                return result
            except Exception as e:
                performance_monitor.record_counter(f"{event}_errors")
                raise
        
        return wrapper
    return decorator


class ErrorTracker:
    """Track and analyze errors"""
    
    def __init__(self):
        self.errors = defaultdict(list)
        self.error_counts = Counter()
    
    def record_error(self, error_type: str, error_message: str, context: Dict[str, Any] = None):
        """Record an error with context"""
        error_info = {
            "timestamp": datetime.utcnow().isoformat(),
            "error_type": error_type,
            "error_message": error_message,
            "context": context or {}
        }
        
        self.errors[error_type].append(error_info)
        self.error_counts[error_type] += 1
        
        logger.error(
            "Error recorded",
            error_type=error_type,
            error_message=error_message,
            context=context,
            total_errors=self.error_counts[error_type]
        )
    
    def get_error_summary(self) -> Dict[str, Any]:
        """Get a summary of all errors"""
        return {
            "total_errors": sum(self.error_counts.values()),
            "error_counts": dict(self.error_counts),
            "recent_errors": {
                error_type: errors[-10:]  # Last 10 errors per type
                for error_type, errors in self.errors.items()
            }
        }
    
    def log_error_summary(self):
        """Log error summary"""
        summary = self.get_error_summary()
        logger.warning("Error summary", **summary)
        return summary


# Global error tracker instance
error_tracker = ErrorTracker()


def track_errors(error_type: str = None):
    """Decorator to track errors in functions"""
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                error_type_to_use = error_type or f"{func.__module__}.{func.__name__}"
                error_tracker.record_error(
                    error_type_to_use,
                    str(e),
                    {
                        "function": func.__name__,
                        "module": func.__module__,
                        "args_count": len(args),
                        "kwargs_keys": list(kwargs.keys())
                    }
                )
                raise
        
        return wrapper
    return decorator


class UsageAnalytics:
    """Track usage analytics"""
    
    def __init__(self):
        self.api_calls = Counter()
        self.user_actions = Counter()
        self.feature_usage = Counter()
        self.session_data = defaultdict(dict)
    
    def track_api_call(self, endpoint: str, method: str = "GET", user_id: str = None):
        """Track API call"""
        key = f"{method}_{endpoint}"
        self.api_calls[key] += 1
        
        logger.info(
            "API call tracked",
            endpoint=endpoint,
            method=method,
            user_id=user_id,
            total_calls=self.api_calls[key]
        )
    
    def track_user_action(self, action: str, user_id: str, **kwargs):
        """Track user action"""
        self.user_actions[action] += 1
        
        logger.info(
            "User action tracked",
            action=action,
            user_id=user_id,
            total_actions=self.user_actions[action],
            **kwargs
        )
    
    def track_feature_usage(self, feature: str, user_id: str = None):
        """Track feature usage"""
        self.feature_usage[feature] += 1
        
        logger.info(
            "Feature usage tracked",
            feature=feature,
            user_id=user_id,
            total_usage=self.feature_usage[feature]
        )
    
    def get_analytics_summary(self) -> Dict[str, Any]:
        """Get analytics summary"""
        return {
            "api_calls": dict(self.api_calls),
            "user_actions": dict(self.user_actions),
            "feature_usage": dict(self.feature_usage),
            "total_api_calls": sum(self.api_calls.values()),
            "total_user_actions": sum(self.user_actions.values()),
            "total_feature_usage": sum(self.feature_usage.values())
        }
    
    def log_analytics_summary(self):
        """Log analytics summary"""
        summary = self.get_analytics_summary()
        logger.info("Analytics summary", **summary)
        return summary


# Global analytics instance
usage_analytics = UsageAnalytics()


def track_api_usage(endpoint: str, method: str = "GET"):
    """Decorator to track API usage"""
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            # Try to extract user_id from request if available
            user_id = None
            if args and hasattr(args[0], 'state') and hasattr(args[0].state, 'user_id'):
                user_id = args[0].state.user_id
            
            usage_analytics.track_api_call(endpoint, method, user_id)
            return func(*args, **kwargs)
        
        return wrapper
    return decorator


def track_feature_usage(feature: str):
    """Decorator to track feature usage"""
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            # Try to extract user_id from request if available
            user_id = None
            if args and hasattr(args[0], 'state') and hasattr(args[0].state, 'user_id'):
                user_id = args[0].state.user_id
            
            usage_analytics.track_feature_usage(feature, user_id)
            return func(*args, **kwargs)
        
        return wrapper
    return decorator 