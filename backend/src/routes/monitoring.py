from fastapi import APIRouter, HTTPException, Depends, Request
from typing import Dict, Any, List
import os
from pathlib import Path
from datetime import datetime, timedelta

from src.logging_config import get_logger
from src.utils import (
    performance_monitor,
    error_tracker,
    usage_analytics
)
from src.auth.auth_utils import get_current_user

router = APIRouter(prefix="/api/monitoring", tags=["Monitoring"])
logger = get_logger(__name__)


@router.get("/health")
async def health_check():
    """Basic health check endpoint"""
    logger.info("Health check requested")
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "Agri-Smart API"
    }


@router.get("/metrics")
async def get_metrics():
    """Get performance metrics"""
    logger.info("Metrics requested")
    
    try:
        performance_summary = performance_monitor.get_average_timing("chat_message_processing")
        error_summary = error_tracker.get_error_summary()
        analytics_summary = usage_analytics.get_analytics_summary()
        
        metrics = {
            "performance": {
                "chat_message_processing_avg_ms": performance_summary * 1000 if performance_summary else None,
                "uptime_seconds": (datetime.utcnow() - performance_monitor.start_time).total_seconds(),
                "total_events": sum(performance_monitor.counters.values())
            },
            "errors": error_summary,
            "analytics": analytics_summary,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        logger.info("Metrics retrieved successfully")
        return metrics
        
    except Exception as e:
        logger.error(
            "Failed to retrieve metrics",
            error_type=type(e).__name__,
            error_message=str(e)
        )
        raise HTTPException(status_code=500, detail="Failed to retrieve metrics")


@router.get("/logs")
async def get_recent_logs(lines: int = 100):
    """Get recent log entries"""
    logger.info("Recent logs requested", lines=lines)
    
    try:
        log_file = os.getenv("LOG_FILE", "logs/app.log")
        log_path = Path(log_file)
        
        if not log_path.exists():
            logger.warning("Log file not found", log_file=log_file)
            return {"logs": [], "message": "Log file not found"}
        
        # Read last N lines from log file
        with open(log_path, 'r', encoding='utf-8') as f:
            all_lines = f.readlines()
            recent_lines = all_lines[-lines:] if len(all_lines) > lines else all_lines
        
        logs = []
        for line in recent_lines:
            line = line.strip()
            if line:
                logs.append(line)
        
        logger.info("Recent logs retrieved successfully", log_count=len(logs))
        return {
            "logs": logs,
            "total_lines": len(logs),
            "log_file": str(log_path)
        }
        
    except Exception as e:
        logger.error(
            "Failed to retrieve recent logs",
            error_type=type(e).__name__,
            error_message=str(e)
        )
        raise HTTPException(status_code=500, detail="Failed to retrieve logs")


@router.get("/errors")
async def get_error_summary():
    """Get error summary"""
    logger.info("Error summary requested")
    
    try:
        error_summary = error_tracker.get_error_summary()
        
        logger.info("Error summary retrieved successfully")
        return {
            "error_summary": error_summary,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(
            "Failed to retrieve error summary",
            error_type=type(e).__name__,
            error_message=str(e)
        )
        raise HTTPException(status_code=500, detail="Failed to retrieve error summary")


@router.get("/analytics")
async def get_analytics():
    """Get usage analytics"""
    logger.info("Analytics requested")
    
    try:
        analytics_summary = usage_analytics.get_analytics_summary()
        
        logger.info("Analytics retrieved successfully")
        return {
            "analytics": analytics_summary,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(
            "Failed to retrieve analytics",
            error_type=type(e).__name__,
            error_message=str(e)
        )
        raise HTTPException(status_code=500, detail="Failed to retrieve analytics")


@router.post("/logs/summary")
async def log_summary():
    """Trigger logging of all summaries"""
    logger.info("Log summary requested")
    
    try:
        # Log all summaries
        performance_monitor.log_summary()
        error_tracker.log_error_summary()
        usage_analytics.log_analytics_summary()
        
        logger.info("All summaries logged successfully")
        return {
            "message": "All summaries logged successfully",
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(
            "Failed to log summaries",
            error_type=type(e).__name__,
            error_message=str(e)
        )
        raise HTTPException(status_code=500, detail="Failed to log summaries")


@router.get("/system-info")
async def get_system_info():
    """Get system information"""
    logger.info("System info requested")
    
    try:
        import psutil
        import platform
        
        system_info = {
            "platform": platform.platform(),
            "python_version": platform.python_version(),
            "cpu_count": psutil.cpu_count(),
            "memory_total_gb": round(psutil.virtual_memory().total / (1024**3), 2),
            "memory_available_gb": round(psutil.virtual_memory().available / (1024**3), 2),
            "memory_percent": psutil.virtual_memory().percent,
            "disk_usage": {
                "total_gb": round(psutil.disk_usage('/').total / (1024**3), 2),
                "used_gb": round(psutil.disk_usage('/').used / (1024**3), 2),
                "free_gb": round(psutil.disk_usage('/').free / (1024**3), 2),
                "percent": psutil.disk_usage('/').percent
            },
            "timestamp": datetime.utcnow().isoformat()
        }
        
        logger.info("System info retrieved successfully")
        return system_info
        
    except ImportError:
        logger.warning("psutil not available, returning basic system info")
        return {
            "platform": platform.platform(),
            "python_version": platform.python_version(),
            "message": "psutil not available for detailed system info",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(
            "Failed to retrieve system info",
            error_type=type(e).__name__,
            error_message=str(e)
        )
        raise HTTPException(status_code=500, detail="Failed to retrieve system info") 