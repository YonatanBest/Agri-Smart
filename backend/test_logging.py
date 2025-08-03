#!/usr/bin/env python3
"""
Simple test script to verify the logging system works
"""

import os
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.logging_config import setup_logging, get_logger
from src.utils import performance_monitor, error_tracker, usage_analytics

def test_logging():
    """Test the logging system"""
    
    # Setup logging
    setup_logging(
        log_level="DEBUG",
        log_file="logs/test.log",
        enable_console=True,
        enable_file=True,
        enable_json=True
    )
    
    logger = get_logger(__name__)
    
    print("Testing logging system...")
    
    # Test basic logging
    logger.debug("This is a debug message")
    logger.info("This is an info message")
    logger.warning("This is a warning message")
    logger.error("This is an error message")
    
    # Test structured logging with kwargs
    logger.info("User action", user_id="123", action="login", ip="192.168.1.1")
    
    # Test performance monitoring
    performance_monitor.record_timing("test_operation", 0.5)
    performance_monitor.record_counter("test_event")
    
    # Test error tracking
    error_tracker.record_error(
        "TestError",
        "This is a test error",
        {"test_context": "value"}
    )
    
    # Test usage analytics
    usage_analytics.track_api_call("/api/test", "GET", "test_user")
    usage_analytics.track_feature_usage("test_feature", "test_user")
    
    # Log summaries
    performance_monitor.log_summary()
    error_tracker.log_error_summary()
    usage_analytics.log_analytics_summary()
    
    print("Logging test completed!")
    print("Check logs/test.log for output")

if __name__ == "__main__":
    test_logging() 