import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

interface Shareholder {
  _id?: ObjectId;
  walletAddress: string;
  tokenBalance: number;
  joinedAt: Date;
  lastVerified: Date;
}

export async function GET() {
  try {
    await client.connect();
    const db = client.db('fantasy-products');
    const collection = db.collection('shareholders');
    
    const shareholders = await collection.find({}).sort({ joinedAt: -1 }).toArray();
    
    return NextResponse.json({
      success: true,
      shareholders: shareholders
    });
  } catch (error) {
    console.error('Error fetching shareholders:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch shareholders'
    }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json();
    
    if (!walletAddress) {
      return NextResponse.json({
        success: false,
        error: 'Wallet address is required'
      }, { status: 400 });
    }

    // Verify token holdings using Helius RPC
    const tokenBalance = await verifyTokenHoldings(walletAddress);
    
    if (tokenBalance === 0) {
      return NextResponse.json({
        success: false,
        error: 'No $Company tokens found in wallet'
      }, { status: 400 });
    }

    await client.connect();
    const db = client.db('fantasy-products');
    const collection = db.collection('shareholders');
    
    // Check if shareholder already exists
    const existingShareholder = await collection.findOne({ walletAddress });
    
    if (existingShareholder) {
      // Update existing shareholder
      await collection.updateOne(
        { walletAddress },
        { 
          $set: { 
            tokenBalance,
            lastVerified: new Date()
          }
        }
      );
      
      return NextResponse.json({
        success: true,
        message: 'You are already a verified shareholder',
        shareholder: {
          walletAddress,
          tokenBalance,
          joinedAt: existingShareholder.joinedAt,
          lastVerified: new Date()
        }
      });
    } else {
      // Create new shareholder
      const newShareholder: Shareholder = {
        walletAddress,
        tokenBalance,
        joinedAt: new Date(),
        lastVerified: new Date()
      };
      
      const result = await collection.insertOne(newShareholder);
      
      return NextResponse.json({
        success: true,
        message: 'Successfully verified as shareholder',
        shareholder: {
          _id: result.insertedId,
          ...newShareholder
        }
      });
    }
  } catch (error) {
    console.error('Error verifying shareholder:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to verify shareholder'
    }, { status: 500 });
  } finally {
    await client.close();
  }
}

async function verifyTokenHoldings(walletAddress: string): Promise<number> {
  try {
    const response = await fetch(process.env.HELIUS_RPC_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'helius-test',
        method: 'getTokenAccountsByOwner',
        params: [
          walletAddress,
          {
            mint: process.env.COMPANY_TOKEN_ADDRESS!
          },
          {
            encoding: 'jsonParsed'
          }
        ]
      })
    });

    const data = await response.json();
    
    if (data.result && data.result.value && data.result.value.length > 0) {
      const tokenAccount = data.result.value[0];
      const balance = tokenAccount.account.data.parsed.info.tokenAmount.uiAmount;
      return balance || 0;
    }
    
    return 0;
  } catch (error) {
    console.error('Error verifying token holdings:', error);
    return 0;
  }
}
