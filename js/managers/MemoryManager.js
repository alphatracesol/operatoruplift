// Memory Manager
// Handles memory cleanup, interval tracking, and resource management

class MemoryManager {
  constructor() {
    this.intervals = new Set();
    this.animations = new Set();
    this.listeners = new Set();
    this.timeouts = new Set();
    this.observers = new Set();
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) {return;}

    console.log('🧠 Memory Manager initialized');
    this.isInitialized = true;

    // Setup cleanup on page unload
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });

    // Setup cleanup on page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseBackgroundProcesses();
      } else {
        this.resumeBackgroundProcesses();
      }
    });
  }

  // Track intervals for cleanup
  trackInterval(interval) {
    this.intervals.add(interval);
    return interval;
  }

  // Track animations for cleanup
  trackAnimation(animation) {
    this.animations.add(animation);
    return animation;
  }

  // Track event listeners for cleanup
  trackListener(element, event, handler, options = {}) {
    const listener = { element, event, handler, options };
    this.listeners.add(listener);
    element.addEventListener(event, handler, options);
    return listener;
  }

  // Track timeouts for cleanup
  trackTimeout(timeout) {
    this.timeouts.add(timeout);
    return timeout;
  }

  // Track observers for cleanup
  trackObserver(observer) {
    this.observers.add(observer);
    return observer;
  }

  // Pause background processes when page is hidden
  pauseBackgroundProcesses() {
    console.log('⏸️ Pausing background processes');
    this.animations.forEach(animation => {
      if (animation.pause) {animation.pause();}
    });
  }

  // Resume background processes when page is visible
  resumeBackgroundProcesses() {
    console.log('▶️ Resuming background processes');
    this.animations.forEach(animation => {
      if (animation.resume) {animation.resume();}
    });
  }

  // Cleanup specific resource
  cleanupResource(resource) {
    if (this.intervals.has(resource)) {
      clearInterval(resource);
      this.intervals.delete(resource);
    } else if (this.timeouts.has(resource)) {
      clearTimeout(resource);
      this.timeouts.delete(resource);
    } else if (this.animations.has(resource)) {
      if (resource.kill) {resource.kill();}
      this.animations.delete(resource);
    } else if (this.observers.has(resource)) {
      if (resource.disconnect) {resource.disconnect();}
      this.observers.delete(resource);
    }
  }

  // Complete cleanup
  cleanup() {
    console.log('🧹 Memory Manager cleanup initiated');

    // Clear all intervals
    this.intervals.forEach(clearInterval);
    this.intervals.clear();

    // Clear all timeouts
    this.timeouts.forEach(clearTimeout);
    this.timeouts.clear();

    // Kill all animations
    this.animations.forEach(animation => {
      if (animation.kill) {animation.kill();}
    });
    this.animations.clear();

    // Remove all listeners
    this.listeners.forEach(listener => {
      try {
        listener.element.removeEventListener(
          listener.event,
          listener.handler,
          listener.options
        );
      } catch (error) {
        console.warn('Failed to remove listener:', error);
      }
    });
    this.listeners.clear();

    // Disconnect all observers
    this.observers.forEach(observer => {
      if (observer.disconnect) {observer.disconnect();}
    });
    this.observers.clear();

    console.log('✅ Memory Manager cleanup completed');
  }

  // Get memory usage statistics
  getStats() {
    return {
      intervals: this.intervals.size,
      animations: this.animations.size,
      listeners: this.listeners.size,
      timeouts: this.timeouts.size,
      observers: this.observers.size,
      total: this.intervals.size + this.animations.size +
                   this.listeners.size + this.timeouts.size + this.observers.size
    };
  }

  // Check for memory leaks
  checkForLeaks() {
    const stats = this.getStats();
    if (stats.total > 100) {
      console.warn('⚠️ Potential memory leak detected:', stats);
      return false;
    }
    return true;
  }
}

export default MemoryManager;
