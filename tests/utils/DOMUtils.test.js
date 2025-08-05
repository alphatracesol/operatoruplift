/**
 * Jest tests for DOMUtils class
 * Tests safe element access and manipulation utilities
 * 
 * @author Operator Uplift Team
 * @version 1.0.0
 * @since 2025-01-28
 */

// Mock DOM environment for Jest
document.body.innerHTML = `
    <div id="test-element">Test Content</div>
    <input id="test-input" value="test value" />
    <button id="test-button" class="btn btn-primary">Test Button</button>
    <div class="test-class">Class Element</div>
    <div class="test-class">Another Class Element</div>
`;

// Import mocks
import { DOMUtils } from '../mocks.js';

describe('DOMUtils', () => {
    beforeEach(() => {
        // Reset DOM before each test
        document.body.innerHTML = `
            <div id="test-element">Test Content</div>
            <input id="test-input" value="test value" />
            <button id="test-button" class="btn btn-primary">Test Button</button>
            <div class="test-class">Class Element</div>
            <div class="test-class">Another Class Element</div>
        `;
    });

    describe('getById', () => {
        test('should return element when valid ID is provided', () => {
            const element = DOMUtils.getById('test-element');
            expect(element).toBeTruthy();
            expect(element.textContent).toBe('Test Content');
        });

        test('should return null when invalid ID is provided', () => {
            const element = DOMUtils.getById('non-existent');
            expect(element).toBeNull();
        });

        test('should return null when null ID is provided', () => {
            const element = DOMUtils.getById(null);
            expect(element).toBeNull();
        });

        test('should return null when undefined ID is provided', () => {
            const element = DOMUtils.getById(undefined);
            expect(element).toBeNull();
        });

        test('should return null when non-string ID is provided', () => {
            const element = DOMUtils.getById(123);
            expect(element).toBeNull();
        });
    });

    describe('query', () => {
        test('should return element when valid selector is provided', () => {
            const element = DOMUtils.query('#test-element');
            expect(element).toBeTruthy();
            expect(element.textContent).toBe('Test Content');
        });

        test('should return null when invalid selector is provided', () => {
            const element = DOMUtils.query('invalid[selector');
            expect(element).toBeNull();
        });

        test('should return null when null selector is provided', () => {
            const element = DOMUtils.query(null);
            expect(element).toBeNull();
        });

        test('should query within parent element', () => {
            const parent = document.getElementById('test-element');
            const element = DOMUtils.query('.test-class', parent);
            expect(element).toBeNull(); // No .test-class inside test-element
        });
    });

    describe('queryAll', () => {
        test('should return NodeList when valid selector is provided', () => {
            const elements = DOMUtils.queryAll('.test-class');
            expect(elements).toHaveLength(2);
        });

        test('should return empty array when invalid selector is provided', () => {
            const elements = DOMUtils.queryAll('invalid[selector');
            expect(elements).toEqual([]);
        });

        test('should return empty array when null selector is provided', () => {
            const elements = DOMUtils.queryAll(null);
            expect(elements).toEqual([]);
        });
    });

    describe('addListener', () => {
        test('should add event listener successfully', () => {
            const element = document.getElementById('test-button');
            const mockHandler = jest.fn();
            
            const result = DOMUtils.addListener(element, 'click', mockHandler);
            expect(result).toBe(true);
            
            element.click();
            expect(mockHandler).toHaveBeenCalled();
        });

        test('should return false when element is null', () => {
            const result = DOMUtils.addListener(null, 'click', jest.fn());
            expect(result).toBe(false);
        });

        test('should return false when event is invalid', () => {
            const element = document.getElementById('test-button');
            const result = DOMUtils.addListener(element, null, jest.fn());
            expect(result).toBe(false);
        });

        test('should return false when handler is not a function', () => {
            const element = document.getElementById('test-button');
            const result = DOMUtils.addListener(element, 'click', 'not a function');
            expect(result).toBe(false);
        });
    });

    describe('removeListener', () => {
        test('should remove event listener successfully', () => {
            const element = document.getElementById('test-button');
            const mockHandler = jest.fn();
            
            DOMUtils.addListener(element, 'click', mockHandler);
            const result = DOMUtils.removeListener(element, 'click', mockHandler);
            expect(result).toBe(true);
            
            element.click();
            expect(mockHandler).not.toHaveBeenCalled();
        });

        test('should return false when element is null', () => {
            const result = DOMUtils.removeListener(null, 'click', jest.fn());
            expect(result).toBe(false);
        });
    });

    describe('setValue', () => {
        test('should set input value successfully', () => {
            const input = document.getElementById('test-input');
            const result = DOMUtils.setValue(input, 'new value');
            expect(result).toBe(true);
            expect(input.value).toBe('new value');
        });

        test('should set text content for non-input elements', () => {
            const element = document.getElementById('test-element');
            const result = DOMUtils.setValue(element, 'new content');
            expect(result).toBe(true);
            expect(element.textContent).toBe('new content');
        });

        test('should return false when element is null', () => {
            const result = DOMUtils.setValue(null, 'value');
            expect(result).toBe(false);
        });

        test('should handle null/undefined values', () => {
            const input = document.getElementById('test-input');
            DOMUtils.setValue(input, null);
            expect(input.value).toBe('');
        });
    });

    describe('getValue', () => {
        test('should get input value successfully', () => {
            const input = document.getElementById('test-input');
            const value = DOMUtils.getValue(input);
            expect(value).toBe('test value');
        });

        test('should get text content for non-input elements', () => {
            const element = document.getElementById('test-element');
            const value = DOMUtils.getValue(element);
            expect(value).toBe('Test Content');
        });

        test('should return empty string when element is null', () => {
            const value = DOMUtils.getValue(null);
            expect(value).toBe('');
        });
    });

    describe('setInnerHTML', () => {
        test('should set innerHTML with sanitization', () => {
            const element = document.getElementById('test-element');
            const result = DOMUtils.setInnerHTML(element, '<script>alert("xss")</script>Safe content');
            expect(result).toBe(true);
            expect(element.innerHTML).not.toContain('<script>');
            expect(element.innerHTML).toContain('Safe content');
        });

        test('should return false when element is null', () => {
            const result = DOMUtils.setInnerHTML(null, 'content');
            expect(result).toBe(false);
        });
    });

    describe('sanitizeHTML', () => {
        test('should sanitize HTML content', () => {
            const input = '<script>alert("xss")</script><p>Safe content</p>';
            const sanitized = DOMUtils.sanitizeHTML(input);
            expect(sanitized).not.toContain('<script>');
            expect(sanitized).toContain('Safe content');
        });

        test('should handle non-string input', () => {
            const sanitized = DOMUtils.sanitizeHTML(123);
            expect(sanitized).toBe('');
        });
    });

    describe('toggleClass', () => {
        test('should toggle class successfully', () => {
            const element = document.getElementById('test-button');
            const result = DOMUtils.toggleClass(element, 'new-class', true);
            expect(result).toBe(true);
            expect(element.classList.contains('new-class')).toBe(true);
        });

        test('should return false when element is null', () => {
            const result = DOMUtils.toggleClass(null, 'class', true);
            expect(result).toBe(false);
        });
    });

    describe('addClass', () => {
        test('should add class successfully', () => {
            const element = document.getElementById('test-button');
            const result = DOMUtils.addClass(element, 'new-class');
            expect(result).toBe(true);
            expect(element.classList.contains('new-class')).toBe(true);
        });

        test('should return false when element is null', () => {
            const result = DOMUtils.addClass(null, 'class');
            expect(result).toBe(false);
        });
    });

    describe('removeClass', () => {
        test('should remove class successfully', () => {
            const element = document.getElementById('test-button');
            const result = DOMUtils.removeClass(element, 'btn-primary');
            expect(result).toBe(true);
            expect(element.classList.contains('btn-primary')).toBe(false);
        });

        test('should return false when element is null', () => {
            const result = DOMUtils.removeClass(null, 'class');
            expect(result).toBe(false);
        });
    });

    describe('hasClass', () => {
        test('should return true when element has class', () => {
            const element = document.getElementById('test-button');
            const hasClass = DOMUtils.hasClass(element, 'btn-primary');
            expect(hasClass).toBe(true);
        });

        test('should return false when element does not have class', () => {
            const element = document.getElementById('test-button');
            const hasClass = DOMUtils.hasClass(element, 'non-existent');
            expect(hasClass).toBe(false);
        });

        test('should return false when element is null', () => {
            const hasClass = DOMUtils.hasClass(null, 'class');
            expect(hasClass).toBe(false);
        });
    });

    describe('setStyle', () => {
        test('should set style property successfully', () => {
            const element = document.getElementById('test-element');
            const result = DOMUtils.setStyle(element, 'color', 'red');
            expect(result).toBe(true);
            expect(element.style.color).toBe('red');
        });

        test('should return false when element is null', () => {
            const result = DOMUtils.setStyle(null, 'color', 'red');
            expect(result).toBe(false);
        });
    });

    describe('getStyle', () => {
        test('should get style property successfully', () => {
            const element = document.getElementById('test-element');
            DOMUtils.setStyle(element, 'color', 'blue');
            const value = DOMUtils.getStyle(element, 'color');
            expect(value).toBe('blue');
        });

        test('should return empty string when element is null', () => {
            const value = DOMUtils.getStyle(null, 'color');
            expect(value).toBe('');
        });
    });

    describe('setAttribute', () => {
        test('should set attribute successfully', () => {
            const element = document.getElementById('test-element');
            const result = DOMUtils.setAttribute(element, 'data-test', 'value');
            expect(result).toBe(true);
            expect(element.getAttribute('data-test')).toBe('value');
        });

        test('should return false when element is null', () => {
            const result = DOMUtils.setAttribute(null, 'attr', 'value');
            expect(result).toBe(false);
        });
    });

    describe('getAttribute', () => {
        test('should get attribute successfully', () => {
            const element = document.getElementById('test-input');
            const value = DOMUtils.getAttribute(element, 'value');
            expect(value).toBe('test value');
        });

        test('should return null when element is null', () => {
            const value = DOMUtils.getAttribute(null, 'attr');
            expect(value).toBeNull();
        });
    });

    describe('removeAttribute', () => {
        test('should remove attribute successfully', () => {
            const element = document.getElementById('test-input');
            const result = DOMUtils.removeAttribute(element, 'value');
            expect(result).toBe(true);
            expect(element.hasAttribute('value')).toBe(false);
        });

        test('should return false when element is null', () => {
            const result = DOMUtils.removeAttribute(null, 'attr');
            expect(result).toBe(false);
        });
    });

    describe('isVisible', () => {
        test('should return true for visible element', () => {
            const element = document.getElementById('test-element');
            const isVisible = DOMUtils.isVisible(element);
            expect(isVisible).toBe(true);
        });

        test('should return false for null element', () => {
            const isVisible = DOMUtils.isVisible(null);
            expect(isVisible).toBe(false);
        });
    });

    describe('scrollIntoView', () => {
        test('should scroll element into view', () => {
            const element = document.getElementById('test-element');
            const result = DOMUtils.scrollIntoView(element);
            expect(result).toBe(true);
        });

        test('should return false when element is null', () => {
            const result = DOMUtils.scrollIntoView(null);
            expect(result).toBe(false);
        });
    });

    describe('focus', () => {
        test('should focus element successfully', () => {
            const input = document.getElementById('test-input');
            const result = DOMUtils.focus(input);
            expect(result).toBe(true);
        });

        test('should return false when element is null', () => {
            const result = DOMUtils.focus(null);
            expect(result).toBe(false);
        });
    });

    describe('blur', () => {
        test('should blur element successfully', () => {
            const input = document.getElementById('test-input');
            const result = DOMUtils.blur(input);
            expect(result).toBe(true);
        });

        test('should return false when element is null', () => {
            const result = DOMUtils.blur(null);
            expect(result).toBe(false);
        });
    });
}); 