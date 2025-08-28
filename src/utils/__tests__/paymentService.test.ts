import { wldToWei, weiToWld, PAYMENT_SERVICE_CONFIG } from '../paymentService';

describe('PaymentService Utils', () => {
  describe('wldToWei', () => {
    it('should convert WLD to wei correctly', () => {
      expect(wldToWei(1)).toBe('1000000000000000000');
      expect(wldToWei(0.5)).toBe('500000000000000000');
      expect(wldToWei(10.25)).toBe('10250000000000000000');
    });

    it('should handle zero amount', () => {
      expect(wldToWei(0)).toBe('0');
    });

    it('should handle small amounts', () => {
      expect(wldToWei(0.000001)).toBe('1000000000000');
    });
  });

  describe('weiToWld', () => {
    it('should convert wei to WLD correctly', () => {
      expect(weiToWld('1000000000000000000')).toBe(1);
      expect(weiToWld('500000000000000000')).toBe(0.5);
      expect(weiToWld('10250000000000000000')).toBe(10.25);
    });

    it('should handle zero amount', () => {
      expect(weiToWld('0')).toBe(0);
    });

    it('should handle small amounts', () => {
      expect(weiToWld('1000000000000')).toBe(0.000001);
    });
  });

  describe('PAYMENT_SERVICE_CONFIG', () => {
    it('should have correct contract addresses', () => {
      expect(PAYMENT_SERVICE_CONFIG.CONTRACT_ADDRESS).toBe('0x8f894C64de54bE90c256C7fbd51ff2240Ee82F1b');
      expect(PAYMENT_SERVICE_CONFIG.WLD_TOKEN_ADDRESS).toBe('0x2cFc85d8E48F8EAB294be644d9E25C3030863003');
      expect(PAYMENT_SERVICE_CONFIG.RECIPIENT_ADDRESS).toBe('0x5744c7c3b2825f6478673676015657a9c81594ba');
    });

    it('should have valid Ethereum addresses', () => {
      const addressRegex = /^0x[a-fA-F0-9]{40}$/;
      expect(PAYMENT_SERVICE_CONFIG.CONTRACT_ADDRESS).toMatch(addressRegex);
      expect(PAYMENT_SERVICE_CONFIG.WLD_TOKEN_ADDRESS).toMatch(addressRegex);
      expect(PAYMENT_SERVICE_CONFIG.RECIPIENT_ADDRESS).toMatch(addressRegex);
    });
  });
});
