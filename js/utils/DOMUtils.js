/**
 * DOM Utilities for safe element access and manipulation
 * Provides null-safe methods for DOM operations to prevent runtime errors
 *
 * @author Operator Uplift Team
 * @version 1.0.0
 * @since 2025-01-28
 */

class DOMUtils {
  /**
     * Safely get element by ID with null checking
     * @param {string} id - Element ID
     * @returns {HTMLElement|null} Element or null if not found
     */
  static getById(id) {
    if (!id || typeof id !== 'string') {
      console.warn('DOMUtils.getById: Invalid ID provided:', id);
      return null;
    }
    return document.getElementById(id);
  }

  /**
     * Safely query selector with null checking
     * @param {string} selector - CSS selector
     * @param {HTMLElement} parent - Parent element (defaults to document)
     * @returns {HTMLElement|null} Element or null if not found
     */
  static query(selector, parent = document) {
    if (!selector || typeof selector !== 'string') {
      console.warn('DOMUtils.query: Invalid selector provided:', selector);
      return null;
    }
    try {
      return parent.querySelector(selector);
    } catch (error) {
      console.error('DOMUtils.query: Invalid selector:', selector, error);
      return null;
    }
  }

  /**
     * Safely query all elements with null checking
     * @param {string} selector - CSS selector
     * @param {HTMLElement} parent - Parent element (defaults to document)
     * @returns {NodeList|[]} NodeList or empty array if not found
     */
  static queryAll(selector, parent = document) {
    if (!selector || typeof selector !== 'string') {
      console.warn('DOMUtils.queryAll: Invalid selector provided:', selector);
      return [];
    }
    try {
      return parent.querySelectorAll(selector);
    } catch (error) {
      console.error('DOMUtils.queryAll: Invalid selector:', selector, error);
      return [];
    }
  }

  /**
     * Safely add event listener with null checking
     * @param {HTMLElement|null} element - Target element
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     * @param {Object} options - Event options
     * @returns {boolean} Success status
     */
  static addListener(element, event, handler, options = {}) {
    if (!element) {
      console.warn('DOMUtils.addListener: Element is null for event:', event);
      return false;
    }
    if (!event || typeof event !== 'string') {
      console.warn('DOMUtils.addListener: Invalid event type:', event);
      return false;
    }
    if (typeof handler !== 'function') {
      console.warn('DOMUtils.addListener: Handler is not a function for event:', event);
      return false;
    }

    try {
      element.addEventListener(event, handler, options);
      return true;
    } catch (error) {
      console.error('DOMUtils.addListener: Failed to add listener:', error);
      return false;
    }
  }

  /**
     * Safely remove event listener with null checking
     * @param {HTMLElement|null} element - Target element
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     * @param {Object} options - Event options
     * @returns {boolean} Success status
     */
  static removeListener(element, event, handler, options = {}) {
    if (!element) {
      console.warn('DOMUtils.removeListener: Element is null for event:', event);
      return false;
    }
    if (!event || typeof event !== 'string') {
      console.warn('DOMUtils.removeListener: Invalid event type:', event);
      return false;
    }
    if (typeof handler !== 'function') {
      console.warn('DOMUtils.removeListener: Handler is not a function for event:', event);
      return false;
    }

    try {
      element.removeEventListener(event, handler, options);
      return true;
    } catch (error) {
      console.error('DOMUtils.removeListener: Failed to remove listener:', error);
      return false;
    }
  }

  /**
     * Safely set element value with null checking
     * @param {HTMLElement|null} element - Target element
     * @param {string} value - Value to set
     * @returns {boolean} Success status
     */
  static setValue(element, value) {
    if (!element) {
      console.warn('DOMUtils.setValue: Element is null');
      return false;
    }
    if (value === undefined || value === null) {
      value = '';
    }

    try {
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.value = String(value);
      } else {
        element.textContent = String(value);
      }
      return true;
    } catch (error) {
      console.error('DOMUtils.setValue: Failed to set value:', error);
      return false;
    }
  }

  /**
     * Safely get element value with null checking
     * @param {HTMLElement|null} element - Target element
     * @returns {string} Element value or empty string
     */
  static getValue(element) {
    if (!element) {
      console.warn('DOMUtils.getValue: Element is null');
      return '';
    }

    try {
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        return element.value || '';
      }
      return element.textContent || '';

    } catch (error) {
      console.error('DOMUtils.getValue: Failed to get value:', error);
      return '';
    }
  }

  /**
     * Safely set element innerHTML with XSS protection
     * @param {HTMLElement|null} element - Target element
     * @param {string} html - HTML content
     * @returns {boolean} Success status
     */
  static setInnerHTML(element, html) {
    if (!element) {
      console.warn('DOMUtils.setInnerHTML: Element is null');
      return false;
    }
    if (html === undefined || html === null) {
      html = '';
    }

    try {
      // Basic XSS protection - only allow safe HTML
      const sanitized = this.sanitizeHTML(String(html));
      element.innerHTML = sanitized;
      return true;
    } catch (error) {
      console.error('DOMUtils.setInnerHTML: Failed to set innerHTML:', error);
      return false;
    }
  }

  /**
     * Sanitize HTML to prevent XSS attacks
     * @param {string} html - HTML string to sanitize
     * @returns {string} Sanitized HTML
     */
  static sanitizeHTML(html) {
    if (typeof html !== 'string') {return '';}

    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }

  /**
     * Safely toggle element classes
     * @param {HTMLElement|null} element - Target element
     * @param {string} className - Class name to toggle
     * @param {boolean} force - Force add/remove
     * @returns {boolean} Success status
     */
  static toggleClass(element, className, force) {
    if (!element) {
      console.warn('DOMUtils.toggleClass: Element is null');
      return false;
    }
    if (!className || typeof className !== 'string') {
      console.warn('DOMUtils.toggleClass: Invalid class name:', className);
      return false;
    }

    try {
      element.classList.toggle(className, force);
      return true;
    } catch (error) {
      console.error('DOMUtils.toggleClass: Failed to toggle class:', error);
      return false;
    }
  }

  /**
     * Safely add class to element
     * @param {HTMLElement|null} element - Target element
     * @param {string} className - Class name to add
     * @returns {boolean} Success status
     */
  static addClass(element, className) {
    if (!element) {
      console.warn('DOMUtils.addClass: Element is null');
      return false;
    }
    if (!className || typeof className !== 'string') {
      console.warn('DOMUtils.addClass: Invalid class name:', className);
      return false;
    }

    try {
      element.classList.add(className);
      return true;
    } catch (error) {
      console.error('DOMUtils.addClass: Failed to add class:', error);
      return false;
    }
  }

  /**
     * Safely remove class from element
     * @param {HTMLElement|null} element - Target element
     * @param {string} className - Class name to remove
     * @returns {boolean} Success status
     */
  static removeClass(element, className) {
    if (!element) {
      console.warn('DOMUtils.removeClass: Element is null');
      return false;
    }
    if (!className || typeof className !== 'string') {
      console.warn('DOMUtils.removeClass: Invalid class name:', className);
      return false;
    }

    try {
      element.classList.remove(className);
      return true;
    } catch (error) {
      console.error('DOMUtils.removeClass: Failed to remove class:', error);
      return false;
    }
  }

  /**
     * Check if element has class
     * @param {HTMLElement|null} element - Target element
     * @param {string} className - Class name to check
     * @returns {boolean} Whether element has the class
     */
  static hasClass(element, className) {
    if (!element) {
      return false;
    }
    if (!className || typeof className !== 'string') {
      return false;
    }

    try {
      return element.classList.contains(className);
    } catch (error) {
      console.error('DOMUtils.hasClass: Failed to check class:', error);
      return false;
    }
  }

  /**
     * Safely set element style property
     * @param {HTMLElement|null} element - Target element
     * @param {string} property - CSS property name
     * @param {string} value - CSS property value
     * @returns {boolean} Success status
     */
  static setStyle(element, property, value) {
    if (!element) {
      console.warn('DOMUtils.setStyle: Element is null');
      return false;
    }
    if (!property || typeof property !== 'string') {
      console.warn('DOMUtils.setStyle: Invalid property:', property);
      return false;
    }

    try {
      element.style[property] = value;
      return true;
    } catch (error) {
      console.error('DOMUtils.setStyle: Failed to set style:', error);
      return false;
    }
  }

  /**
     * Safely get element style property
     * @param {HTMLElement|null} element - Target element
     * @param {string} property - CSS property name
     * @returns {string} CSS property value or empty string
     */
  static getStyle(element, property) {
    if (!element) {
      console.warn('DOMUtils.getStyle: Element is null');
      return '';
    }
    if (!property || typeof property !== 'string') {
      console.warn('DOMUtils.getStyle: Invalid property:', property);
      return '';
    }

    try {
      return element.style[property] || '';
    } catch (error) {
      console.error('DOMUtils.getStyle: Failed to get style:', error);
      return '';
    }
  }

  /**
     * Safely set element attribute
     * @param {HTMLElement|null} element - Target element
     * @param {string} name - Attribute name
     * @param {string} value - Attribute value
     * @returns {boolean} Success status
     */
  static setAttribute(element, name, value) {
    if (!element) {
      console.warn('DOMUtils.setAttribute: Element is null');
      return false;
    }
    if (!name || typeof name !== 'string') {
      console.warn('DOMUtils.setAttribute: Invalid attribute name:', name);
      return false;
    }

    try {
      element.setAttribute(name, value);
      return true;
    } catch (error) {
      console.error('DOMUtils.setAttribute: Failed to set attribute:', error);
      return false;
    }
  }

  /**
     * Safely get element attribute
     * @param {HTMLElement|null} element - Target element
     * @param {string} name - Attribute name
     * @returns {string|null} Attribute value or null
     */
  static getAttribute(element, name) {
    if (!element) {
      console.warn('DOMUtils.getAttribute: Element is null');
      return null;
    }
    if (!name || typeof name !== 'string') {
      console.warn('DOMUtils.getAttribute: Invalid attribute name:', name);
      return null;
    }

    try {
      return element.getAttribute(name);
    } catch (error) {
      console.error('DOMUtils.getAttribute: Failed to get attribute:', error);
      return null;
    }
  }

  /**
     * Safely remove element attribute
     * @param {HTMLElement|null} element - Target element
     * @param {string} name - Attribute name
     * @returns {boolean} Success status
     */
  static removeAttribute(element, name) {
    if (!element) {
      console.warn('DOMUtils.removeAttribute: Element is null');
      return false;
    }
    if (!name || typeof name !== 'string') {
      console.warn('DOMUtils.removeAttribute: Invalid attribute name:', name);
      return false;
    }

    try {
      element.removeAttribute(name);
      return true;
    } catch (error) {
      console.error('DOMUtils.removeAttribute: Failed to remove attribute:', error);
      return false;
    }
  }

  /**
     * Check if element exists and is visible
     * @param {HTMLElement|null} element - Target element
     * @returns {boolean} Whether element is visible
     */
  static isVisible(element) {
    if (!element) {return false;}

    try {
      const style = window.getComputedStyle(element);
      return style.display !== 'none' &&
                   style.visibility !== 'hidden' &&
                   element.offsetParent !== null;
    } catch (error) {
      console.error('DOMUtils.isVisible: Failed to check visibility:', error);
      return false;
    }
  }

  /**
     * Safely scroll element into view
     * @param {HTMLElement|null} element - Target element
     * @param {Object} options - Scroll options
     * @returns {boolean} Success status
     */
  static scrollIntoView(element, options = {}) {
    if (!element) {
      console.warn('DOMUtils.scrollIntoView: Element is null');
      return false;
    }

    try {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
        ...options
      });
      return true;
    } catch (error) {
      console.error('DOMUtils.scrollIntoView: Failed to scroll into view:', error);
      return false;
    }
  }

  /**
     * Safely focus element
     * @param {HTMLElement|null} element - Target element
     * @returns {boolean} Success status
     */
  static focus(element) {
    if (!element) {
      console.warn('DOMUtils.focus: Element is null');
      return false;
    }

    try {
      element.focus();
      return true;
    } catch (error) {
      console.error('DOMUtils.focus: Failed to focus element:', error);
      return false;
    }
  }

  /**
     * Safely blur element
     * @param {HTMLElement|null} element - Target element
     * @returns {boolean} Success status
     */
  static blur(element) {
    if (!element) {
      console.warn('DOMUtils.blur: Element is null');
      return false;
    }

    try {
      element.blur();
      return true;
    } catch (error) {
      console.error('DOMUtils.blur: Failed to blur element:', error);
      return false;
    }
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DOMUtils;
} else if (typeof window !== 'undefined') {
  window.DOMUtils = DOMUtils;
}

export default DOMUtils;
