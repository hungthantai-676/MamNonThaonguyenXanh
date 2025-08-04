import { Wallet } from "ethers";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import { AffiliateMember, InsertAffiliateMember } from "@shared/schema";

export interface Web3Wallet {
  address: string;
  privateKey: string;
  mnemonic?: string;
}

export class AffiliateService {
  // Create a new Web3 wallet for affiliate member
  static async createWallet(): Promise<Web3Wallet> {
    const wallet = Wallet.createRandom();
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic?.phrase,
    };
  }

  // Generate QR code for referral link
  static async generateQRCode(referralLink: string): Promise<string> {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(referralLink, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      return qrCodeDataUrl;
    } catch (error) {
      console.error("Error generating QR code:", error);
      throw new Error("Failed to generate QR code");
    }
  }

  // Create unique referral link for member
  static generateReferralLink(memberId: string, baseUrl: string): string {
    // Use production domain if available, otherwise use provided baseUrl
    const productionDomain = process.env.PRODUCTION_DOMAIN || "https://mamnonthaonguyenxanh.com";
    const finalUrl = process.env.NODE_ENV === "production" ? productionDomain : baseUrl;
    return `${finalUrl}/affiliate-register?ref=${memberId}`;
  }

  // Generate unique member ID
  static generateMemberId(): string {
    return uuidv4();
  }

  // Calculate member level based on sponsor hierarchy
  static calculateMemberLevel(sponsor: AffiliateMember | null): number {
    if (!sponsor) return 1;
    return sponsor.level + 1;
  }

  // Calculate referral bonus based on level
  static calculateReferralBonus(level: number, baseBonus: number = 100): number {
    const levelMultipliers = {
      1: 1.0,   // Direct referral: 100%
      2: 0.5,   // 2nd level: 50%
      3: 0.3,   // 3rd level: 30%
      4: 0.2,   // 4th level: 20%
      5: 0.1,   // 5th level: 10%
    };
    
    const multiplier = levelMultipliers[level as keyof typeof levelMultipliers] || 0;
    return baseBonus * multiplier;
  }

  // Encrypt private key for storage
  static encryptPrivateKey(privateKey: string, password: string = "affiliate_system"): string {
    // In production, use proper encryption like AES
    // For now, just encode it - NOT secure for production
    return Buffer.from(privateKey).toString('base64');
  }

  // Decrypt private key
  static decryptPrivateKey(encryptedKey: string, password: string = "affiliate_system"): string {
    // In production, use proper decryption
    // For now, just decode it - NOT secure for production
    return Buffer.from(encryptedKey, 'base64').toString('utf-8');
  }

  // Generate transaction ID for blockchain operations
  static generateTransactionId(): string {
    return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate trade ID for DEX operations
  static generateTradeId(): string {
    return `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Calculate token price based on supply and demand
  static calculateTokenPrice(totalSupply: number, totalDemand: number): number {
    // Simple price calculation - in production, use proper DEX pricing
    const basePrice = 0.001; // 0.001 ETH per token
    const demandMultiplier = totalDemand / totalSupply || 1;
    return basePrice * demandMultiplier;
  }

  // Validate wallet address format
  static isValidWalletAddress(address: string): boolean {
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    return ethAddressRegex.test(address);
  }

  // Get member type display name
  static getMemberTypeDisplayName(memberType: string): string {
    return memberType === "teacher" ? "Chăm sóc phụ huynh" : "Đại sứ thương hiệu";
  }

  // Get category color for UI
  static getCategoryColor(categoryName: string): string {
    return categoryName === "Chăm sóc phụ huynh" ? "#10B981" : "#8B5CF6";
  }

  // Format token amount for display
  static formatTokenAmount(amount: string | number): string {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return num.toLocaleString('vi-VN', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 8 
    });
  }

  // Format wallet address for display (show first 6 and last 4 characters)
  static formatWalletAddress(address: string): string {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
}

export default AffiliateService;