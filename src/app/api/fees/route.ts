import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const feesEarned = process.env.FEES_EARNED || '0';
    const feesDistributed = process.env.FEES_DISTRIBUTED || '0';
    const distributionWallet = process.env.DISTRIBUTION_WALLET || '';

    return NextResponse.json({
      success: true,
      feesEarned,
      feesDistributed,
      distributionWallet
    });
  } catch (error) {
    console.error('Error fetching fee data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch fee data' },
      { status: 500 }
    );
  }
}
