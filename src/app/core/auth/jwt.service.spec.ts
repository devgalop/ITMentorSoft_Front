import { JwtService } from './jwt.service';

describe('JwtService', () => {
  let service: JwtService;

  const VALID_STUDENT_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJlaWRlcl90ZXN0Iiwicm9sZSI6InN0dWRlbnQiLCJleHAiOjE3ODIxMDY5OTV9.C29WG-n07km4acqGC5yyh_GOTLFM03cbdYeZ7Y-T5pM';
  const EXPIRED_TEACHER_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJlaWRlcl90ZXN0Iiwicm9sZSI6InRlYWNoZXIiLCJleHAiOjE3ODIwOTk3OTV9.fx6xo71AbG1XPiwzaakcPvjoaKJ1aZTKjkAgB6IjaYs';
  const ADMIN_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJhZG1pbl90ZXN0Iiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzgyMTA2OTk1fQ.Ace80vhttUbQNjMBFAKYmhM4KcDpg6bwshffgO3r3uE';
  const MALFORMED_TOKEN = 'not-a-real-jwt';

  beforeEach(() => {
    service = new JwtService();
  });

  describe('decode', () => {
    it('returns userName and role from a valid student token', () => {
      const result = service.decode(VALID_STUDENT_TOKEN);
      expect(result).toEqual({ userName: 'eider_test', role: 'student' });
    });

    it('returns userName and role from a valid admin token', () => {
      const result = service.decode(ADMIN_TOKEN);
      expect(result).toEqual({ userName: 'admin_test', role: 'admin' });
    });

    it('returns null for a malformed token instead of throwing', () => {
      expect(service.decode(MALFORMED_TOKEN)).toBeNull();
    });
  });

  describe('isExpired', () => {
    it('returns false for a token with future exp', () => {
      expect(service.isExpired(VALID_STUDENT_TOKEN)).toBe(false);
    });

    it('returns true for a token with past exp', () => {
      expect(service.isExpired(EXPIRED_TEACHER_TOKEN)).toBe(true);
    });

    it('returns true for a malformed token instead of throwing', () => {
      expect(service.isExpired(MALFORMED_TOKEN)).toBe(true);
    });
  });
});