import { storage } from "./storage";
import { v4 as uuidv4 } from 'uuid';
import type { InsertCommissionTransaction } from "@shared/schema";

export class CommissionService {
  
  /**
   * Process commission distribution when customer status is confirmed as "payment_completed"
   */
  async processCommissionDistribution(
    customerId: string, 
    paymentAmount: number,
    f1AgentId: string,
    f0ReferrerId?: string
  ): Promise<void> {
    try {
      console.log(`Processing commission for customer ${customerId}, amount: ${paymentAmount}`);
      
      // Get commission settings
      const commissionSetting = await storage.getActiveCommissionSetting();
      if (!commissionSetting) {
        console.error("No active commission settings found");
        return;
      }

      // Calculate F1 commission
      const f1CommissionPercent = parseFloat(commissionSetting.f1CommissionPercent);
      const f1CommissionAmount = (paymentAmount * f1CommissionPercent) / 100;

      // Create F1 commission transaction
      const f1Transaction: InsertCommissionTransaction = {
        transactionId: `f1_${uuidv4()}`,
        customerId,
        recipientId: f1AgentId,
        recipientType: "F1",
        commissionAmount: f1CommissionAmount.toString(),
        baseAmount: paymentAmount.toString(),
        commissionPercent: f1CommissionPercent.toString(),
        status: "completed",
        processedAt: new Date(),
      };

      await storage.createCommissionTransaction(f1Transaction);
      console.log(`F1 commission created: ${f1CommissionAmount} for agent ${f1AgentId}`);

      // Update F1 agent's token balance
      const f1Agent = await storage.getAffiliateMemberByMemberId(f1AgentId);
      if (f1Agent) {
        const newBalance = parseFloat(f1Agent.tokenBalance) + f1CommissionAmount;
        await storage.updateAffiliateMember(f1Agent.id, {
          tokenBalance: newBalance.toString()
        });
        console.log(`F1 agent ${f1AgentId} balance updated to ${newBalance}`);
      }

      // Process F0 commission if there's a referrer
      if (f0ReferrerId) {
        const f0CommissionPercent = parseFloat(commissionSetting.f0CommissionPercent);
        const f0CommissionAmount = (paymentAmount * f0CommissionPercent) / 100;

        const f0Transaction: InsertCommissionTransaction = {
          transactionId: `f0_${uuidv4()}`,
          customerId,
          recipientId: f0ReferrerId,
          recipientType: "F0",
          commissionAmount: f0CommissionAmount.toString(),
          baseAmount: paymentAmount.toString(),
          commissionPercent: f0CommissionPercent.toString(),
          status: "completed",
          processedAt: new Date(),
        };

        await storage.createCommissionTransaction(f0Transaction);
        console.log(`F0 commission created: ${f0CommissionAmount} for referrer ${f0ReferrerId}`);

        // Update F0 referrer's token balance
        const f0Referrer = await storage.getAffiliateMemberByMemberId(f0ReferrerId);
        if (f0Referrer) {
          const newBalance = parseFloat(f0Referrer.tokenBalance) + f0CommissionAmount;
          await storage.updateAffiliateMember(f0Referrer.id, {
            tokenBalance: newBalance.toString()
          });
          console.log(`F0 referrer ${f0ReferrerId} balance updated to ${newBalance}`);
        }
      }

    } catch (error) {
      console.error("Error processing commission distribution:", error);
      throw error;
    }
  }

  /**
   * Initialize default commission settings if none exist
   */
  async initializeDefaultSettings(): Promise<void> {
    const existing = await storage.getActiveCommissionSetting();
    if (!existing) {
      await storage.createCommissionSetting({
        f1CommissionPercent: "30.00", // 30% for F1
        f0CommissionPercent: "15.00", // 15% for F0
        isActive: true,
      });
      console.log("Default commission settings initialized");
    }
  }

  /**
   * Get commission summary for a specific agent
   */
  async getCommissionSummary(agentId: string): Promise<{
    totalEarned: number;
    totalTransactions: number;
    pendingAmount: number;
  }> {
    const transactions = await storage.getCommissionTransactionsByRecipient(agentId);
    
    const totalEarned = transactions
      .filter(t => t.status === "completed")
      .reduce((sum, t) => sum + parseFloat(t.commissionAmount), 0);
    
    const pendingAmount = transactions
      .filter(t => t.status === "pending")
      .reduce((sum, t) => sum + parseFloat(t.commissionAmount), 0);

    return {
      totalEarned,
      totalTransactions: transactions.length,
      pendingAmount,
    };
  }
}

export const commissionService = new CommissionService();