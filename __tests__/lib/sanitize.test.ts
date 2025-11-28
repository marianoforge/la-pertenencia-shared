import { sanitizeText, sanitizeEmail, sanitizeHtml, sanitizeObject } from '@/lib/sanitize';

describe('sanitize', () => {
  describe('sanitizeText', () => {
    it('should remove script tags', () => {
      const input = 'Hello <script>alert("xss")</script> World';
      const result = sanitizeText(input);
      expect(result).toBe('Hello  World');
    });

    it('should remove control characters', () => {
      const input = 'Hello\x00World';
      const result = sanitizeText(input);
      expect(result).toBe('HelloWorld');
    });

    it('should trim whitespace', () => {
      const input = '  Hello World  ';
      const result = sanitizeText(input);
      expect(result).toBe('Hello World');
    });
  });

  describe('sanitizeEmail', () => {
    it('should sanitize email address', () => {
      const input = '  TEST@EXAMPLE.COM  ';
      const result = sanitizeEmail(input);
      expect(result).toBe('test@example.com');
    });

    it('should remove invalid characters', () => {
      const input = 'test<script>@example.com';
      const result = sanitizeEmail(input);
      expect(result).not.toContain('<script>');
    });
  });

  describe('sanitizeHtml', () => {
    it('should allow safe HTML tags', () => {
      const input = '<p>Hello <strong>World</strong></p>';
      const result = sanitizeHtml(input);
      expect(result).toContain('<p>');
      expect(result).toContain('<strong>');
    });

    it('should remove script tags', () => {
      const input = '<p>Hello</p><script>alert("xss")</script>';
      const result = sanitizeHtml(input);
      expect(result).not.toContain('<script>');
    });
  });

  describe('sanitizeObject', () => {
    it('should sanitize all string properties', () => {
      const input = {
        name: '  Test  ',
        description: '<script>alert("xss")</script>',
        email: 'TEST@EXAMPLE.COM',
      };
      const result = sanitizeObject(input);
      expect(result.name).toBe('Test');
      expect(result.description).not.toContain('<script>');
      expect(result.email).toBe('test@example.com');
    });

    it('should handle nested objects', () => {
      const input = {
        user: {
          name: '<script>alert("xss")</script>',
          email: 'TEST@EXAMPLE.COM',
        },
      };
      const result = sanitizeObject(input);
      expect(result.user.name).not.toContain('<script>');
      expect(result.user.email).toBe('test@example.com');
    });
  });
});

