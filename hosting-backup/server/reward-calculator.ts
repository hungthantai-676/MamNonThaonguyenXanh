import { storage } from "./storage";
import { v4 as uuidv4 } from 'uuid';
import type { InsertCommissionTransaction } from "@shared/schema";

export interface RewardCalculation {
  baseReward: number;
  milestoneBonus: number;
  totalReward: number;
  milestoneReached: boolean;
  nextMilestone: number;
  progressToMilestone: number;
}

export class RewardCalculator {
  
  /**
   * Calculate rewards for teachers (F1 agents) based on confirmed students
   * Rule: 2,000,000 VND per referral + 10,000,000 VND bonus every 5 students
   */
  static calculateTeacherReward(confirmedStudents: number): RewardCalculation {
    const baseRewardPerStudent = 2000000; // 2 triệu VND
    const milestoneBonus = 10000000; // 10 triệu VND
    const milestoneInterval = 5; // Every 5 students
    
    const baseReward = confirmedStudents * baseRewardPerStudent;
    const milestonesCompleted = Math.floor(confirmedStudents / milestoneInterval);
    const milestoneReached = confirmedStudents > 0 && confirmedStudents % milestoneInterval === 0;
    const totalMilestoneBonus = milestonesCompleted * milestoneBonus;
    const totalReward = baseReward + totalMilestoneBonus;
    
    const nextMilestone = Math.ceil(confirmedStudents / milestoneInterval) * milestoneInterval;
    const progressToMilestone = confirmedStudents % milestoneInterval;
    
    return {
      baseReward,
      milestoneBonus: totalMilestoneBonus,
      totalReward,
      milestoneReached,
      nextMilestone,
      progressToMilestone
    };
  }
  
  /**
   * Calculate rewards for parents (F0 ambassadors) based on confirmed students
   * Rule: 2,000 points per referral + 10,000 points bonus every 5 students
   */
  static calculateParentReward(confirmedStudents: number): RewardCalculation {
    const baseRewardPerStudent = 2000; // 2,000 points
    const milestoneBonus = 10000; // 10,000 points
    const milestoneInterval = 5; // Every 5 students
    
    const baseReward = confirmedStudents * baseRewardPerStudent;
    const milestonesCompleted = Math.floor(confirmedStudents / milestoneInterval);
    const milestoneReached = confirmedStudents > 0 && confirmedStudents % milestoneInterval === 0;
    const totalMilestoneBonus = milestonesCompleted * milestoneBonus;
    const totalReward = baseReward + totalMilestoneBonus;
    
    const nextMilestone = Math.ceil(confirmedStudents / milestoneInterval) * milestoneInterval;
    const progressToMilestone = confirmedStudents % milestoneInterval;
    
    return {
      baseReward,
      milestoneBonus: totalMilestoneBonus,
      totalReward,
      milestoneReached,
      nextMilestone,
      progressToMilestone
    };
  }
  
  /**
   * Process reward distribution when a customer payment is confirmed
   */
  static async processRewardDistribution(
    customerId: string,
    f1AgentId: string,
    f0ReferrerId?: string
  ): Promise<void> {
    try {
      console.log(`Processing rewards for customer ${customerId}`);
      
      // Get F1 agent and calculate their total confirmed students
      const f1Agent = await storage.getAffiliateMemberByMemberId(f1AgentId);
      if (!f1Agent) {
        console.error(`F1 agent ${f1AgentId} not found`);
        return;
      }
      
      // Get confirmed customers count for F1 agent
      const f1Customers = await storage.getAffiliateCustomers();
      const f1ConfirmedCount = f1Customers.filter(c => 
        c.agentMemberId === f1AgentId && c.conversionStatus === "payment_completed"
      ).length;
      
      const f1Reward = this.calculateTeacherReward(f1ConfirmedCount);
      
      // Update F1 agent's token balance to reflect total reward
      await storage.updateAffiliateMember(f1Agent.id, {
        tokenBalance: f1Reward.totalReward.toString()
      });
      
      // Create transaction record for F1
      const f1Transaction: InsertCommissionTransaction = {
        transactionId: `reward_f1_${uuidv4()}`,
        customerId,
        recipientId: f1AgentId,
        recipientType: "F1",
        commissionAmount: f1Reward.totalReward.toString(),
        baseAmount: "0", // Fixed reward, not percentage-based
        commissionPercent: "0",
        status: "completed",
        processedAt: new Date(),
      };
      
      await storage.createCommissionTransaction(f1Transaction);
      console.log(`F1 agent ${f1AgentId} total reward: ${f1Reward.totalReward} VND (${f1ConfirmedCount} students)`);
      
      // Process F0 referrer (parent) if exists
      if (f0ReferrerId) {
        const f0Referrer = await storage.getAffiliateMemberByMemberId(f0ReferrerId);
        if (f0Referrer) {
          // Get confirmed customers count for F0 referrer
          const f0ConfirmedCount = f1Customers.filter(c => 
            c.referrerId === f0ReferrerId && c.conversionStatus === "payment_completed"
          ).length;
          
          const f0Reward = this.calculateParentReward(f0ConfirmedCount);
          
          // Update F0 referrer's point balance
          await storage.updateAffiliateMember(f0Referrer.id, {
            pointBalance: f0Reward.totalReward.toString()
          });
          
          // Create transaction record for F0
          const f0Transaction: InsertCommissionTransaction = {
            transactionId: `reward_f0_${uuidv4()}`,
            customerId,
            recipientId: f0ReferrerId,
            recipientType: "F0",
            commissionAmount: f0Reward.totalReward.toString(),
            baseAmount: "0", // Fixed reward, not percentage-based
            commissionPercent: "0",
            status: "completed",
            processedAt: new Date(),
          };
          
          await storage.createCommissionTransaction(f0Transaction);
          console.log(`F0 referrer ${f0ReferrerId} total reward: ${f0Reward.totalReward} points (${f0ConfirmedCount} students)`);
        }
      }
      
    } catch (error) {
      console.error("Error processing reward distribution:", error);
      throw error;
    }
  }
  
  /**
   * Get reward breakdown for display
   */
  static async getRewardBreakdown(memberId: string, memberType: "teacher" | "parent"): Promise<RewardCalculation & {
    confirmedStudents: number;
  }> {
    try {
      const customers = await storage.getAffiliateCustomers();
      
      let confirmedStudents = 0;
      if (memberType === "teacher") {
        confirmedStudents = customers.filter(c => 
          c.agentMemberId === memberId && c.conversionStatus === "payment_completed"
        ).length;
      } else {
        confirmedStudents = customers.filter(c => 
          c.referrerId === memberId && c.conversionStatus === "payment_completed"
        ).length;
      }
      
      const calculation = memberType === "teacher" 
        ? this.calculateTeacherReward(confirmedStudents)
        : this.calculateParentReward(confirmedStudents);
      
      return {
        ...calculation,
        confirmedStudents
      };
    } catch (error) {
      console.error("Error getting reward breakdown:", error);
      throw error;
    }
  }
}

export const rewardCalculator = new RewardCalculator();