import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

// Bell Curve Liquid Distribution System (embedded)
class LiquidDistributionSystem {
  private buckets = new Map();
  private currentDay = 0;
  private minAmount = 0.01;
  private dailyHistory = [];

  createBucket(bucketId, numCompartments) {
    const compartments = [];
    for (let i = 0; i < numCompartments; i++) {
      compartments.push({ amount: 0, lastUsed: -10 });
    }
    
    this.buckets.set(bucketId, {
      id: bucketId,
      compartments,
      totalAmount: 0
    });
  }

  private generateBellCurveWeights(numCompartments) {
    const weights = [];
    const center = (numCompartments - 1) / 2;
    const sigma = numCompartments / 6;
    
    let totalWeight = 0;
    
    for (let i = 0; i < numCompartments; i++) {
      const weight = Math.exp(-Math.pow(i - center, 2) / (2 * Math.pow(sigma, 2)));
      weights.push(weight);
      totalWeight += weight;
    }
    
    return weights.map(w => w / totalWeight);
  }

  addLiquid(bucketId, amount) {
    const bucket = this.buckets.get(bucketId);
    if (!bucket) return;

    const numCompartments = bucket.compartments.length;
    const idealWeights = this.generateBellCurveWeights(numCompartments);
    
    const currentTotal = bucket.totalAmount;
    const targetTotal = currentTotal + amount;
    
    const idealAmounts = idealWeights.map(weight => weight * targetTotal);
    
    const additions = [];
    let totalAdditions = 0;
    let redistributeAmount = 0;
    
    for (let i = 0; i < numCompartments; i++) {
      const targetAmount = idealAmounts[i];
      const currentAmount = bucket.compartments[i].amount;
      let addition = Math.max(0, targetAmount - currentAmount);
      
      if (addition < this.minAmount && addition > 0) {
        redistributeAmount += addition;
        addition = 0;
      }
      
      additions.push(addition);
      totalAdditions += addition;
    }
    
    if (redistributeAmount > 0) {
      const deficits = additions.map((add, i) => ({ index: i, deficit: add }))
        .filter(item => item.deficit > this.minAmount)
        .sort((a, b) => b.deficit - a.deficit);
      
      let remaining = redistributeAmount;
      for (const item of deficits) {
        if (remaining <= 0) break;
        const additional = Math.min(remaining, item.deficit);
        additions[item.index] += additional;
        remaining -= additional;
        totalAdditions += additional;
      }
    }
    
    const normalizer = amount / Math.max(totalAdditions, 0.0001);
    
    for (let i = 0; i < numCompartments; i++) {
      const finalAddition = additions[i] * normalizer;
      bucket.compartments[i].amount += finalAddition;
    }
    
    bucket.totalAmount += amount;
  }

  removeLiquid(totalAmount) {
    const availableCompartments = [];

    for (const [bucketId, bucket] of this.buckets) {
      for (let i = 0; i < bucket.compartments.length; i++) {
        const compartment = bucket.compartments[i];
        if (compartment.amount > 0 && (this.currentDay - compartment.lastUsed) >= 8) {
          availableCompartments.push({
            bucketId,
            compartmentIndex: i,
            amount: compartment.amount
          });
        }
      }
    }

    availableCompartments.sort((a, b) => b.amount - a.amount);

    let remainingToRemove = totalAmount;
    const usedCompartments = [];

    for (const comp of availableCompartments) {
      if (remainingToRemove <= 0) break;
      
      const removeFromThis = Math.min(comp.amount, remainingToRemove);
      usedCompartments.push({
        bucketId: comp.bucketId,
        compartmentIndex: comp.compartmentIndex,
        amount: removeFromThis
      });
      
      remainingToRemove -= removeFromThis;
    }

    if (remainingToRemove > 0.001) {
      return false;
    }

    for (const used of usedCompartments) {
      const bucket = this.buckets.get(used.bucketId);
      bucket.compartments[used.compartmentIndex].amount -= used.amount;
      bucket.compartments[used.compartmentIndex].lastUsed = this.currentDay;
      bucket.totalAmount -= used.amount;
    }

    return true;
  }

  getTotalLiquid() {
    let total = 0;
    for (const bucket of this.buckets.values()) {
      total += bucket.totalAmount;
    }
    return total;
  }

  private recordDailyState(deposits, withdrawals) {
    const bucketStates = [];
    
    for (const [bucketId, bucket] of this.buckets) {
      bucketStates.push({
        bucketId,
        compartments: bucket.compartments.map(c => c.amount)
      });
    }

    this.dailyHistory.push({
      day: this.currentDay,
      deposits,
      withdrawals,
      bucketStates
    });
  }

  simulate365Days() {
    for (let day = 0; day < 365; day++) {
      this.currentDay = day;
      let dailyDeposits = 0;
      let dailyWithdrawals = 0;

      const totalLiquid = this.getTotalLiquid();
      const action = Math.random();

      if (action < 0.5) {
        const bucketIds = Array.from(this.buckets.keys());
        const bucketId = bucketIds[Math.floor(Math.random() * bucketIds.length)];
        const amount = Math.random() * 50 + 10;
        this.addLiquid(bucketId, amount);
        dailyDeposits = amount;
        
      } else if (totalLiquid > 1) {
        let removalAmount;
        const rand = Math.random();
        
        if (rand < 0.9) {
          removalAmount = totalLiquid * Math.random() * 0.01;
        } else if (rand < 0.99) {
          removalAmount = totalLiquid * Math.random() * 0.2;
        } else {
          removalAmount = totalLiquid * (0.2 + Math.random() * 0.6);
        }

        if (this.removeLiquid(removalAmount)) {
          dailyWithdrawals = removalAmount;
        }
      }

      this.recordDailyState(dailyDeposits, dailyWithdrawals);
    }
  }

  getSimulationData() {
    return this.dailyHistory;
  }

  getBucketStates() {
    const states = [];
    
    for (const [bucketId, bucket] of this.buckets) {
      states.push({
        bucketId,
        compartments: bucket.compartments.map(c => c.amount),
        total: bucket.totalAmount
      });
    }
    
    return states;
  }
}

const LiquidSystemVisualization = () => {
  const [system, setSystem] = useState(null);
  const [currentDay, setCurrentDay] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [simulationData, setSimulationData] = useState([]);
  const [speed, setSpeed] = useState(50);

  // Initialize system and run simulation
  useEffect(() => {
    const newSystem = new LiquidDistributionSystem();
    
    // Create buckets as specified
    newSystem.createBucket(0, 15); // Main bucket with 15 compartments
    newSystem.createBucket(1, 3);  // 4 other buckets with 3-6 compartments each
    newSystem.createBucket(2, 4);
    newSystem.createBucket(3, 5);
    newSystem.createBucket(4, 6);
    
    // Run simulation
    newSystem.simulate365Days();
    
    setSystem(newSystem);
    setSimulationData(newSystem.getSimulationData());
  }, []);

  // Animation control
  useEffect(() => {
    if (!isPlaying || !simulationData.length) return;

    const interval = setInterval(() => {
      setCurrentDay(prev => {
        if (prev >= simulationData.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 101 - speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed, simulationData.length]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentDay(0);
    setIsPlaying(false);
  };

  const handleDayChange = (e) => {
    setCurrentDay(parseInt(e.target.value));
  };

  if (!system || !simulationData.length) {
    return <div className="p-8">Loading simulation...</div>;
  }

  const currentData = simulationData[currentDay];
  const bucketColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  // Prepare compartment distribution data
  const compartmentData = currentData.bucketStates.map((bucket, idx) => ({
    name: `Bucket ${bucket.bucketId}`,
    compartments: bucket.compartments,
    color: bucketColors[idx % bucketColors.length]
  }));

  // Prepare unified compartment data (all compartments in one chart, properly ordered)
  const allCompartments = [];
  
  // First collect all compartments with their bell curve properties
  currentData.bucketStates.forEach((bucket, bucketIdx) => {
    const bucketColor = bucketColors[bucketIdx % bucketColors.length];
    const numCompartments = bucket.compartments.length;
    const center = (numCompartments - 1) / 2;
    
    bucket.compartments.forEach((amount, idx) => {
      const bellPosition = idx - center;
      const normalizedBellPosition = bellPosition / center; // Normalize by bucket size
      
      allCompartments.push({
        id: `B${bucket.bucketId}-C${idx}`,
        bucketId: bucket.bucketId,
        compartmentIndex: idx,
        amount: amount,
        fill: bucketColor,
        bucketName: `Bucket ${bucket.bucketId}`,
        bellPosition: bellPosition,
        normalizedBellPosition: normalizedBellPosition,
        bucketSize: numCompartments,
        distanceFromCenter: Math.abs(bellPosition)
      });
    });
  });
  
  // Sort all compartments by bell curve position and bucket priority
  // Center compartments first, then by distance from center, then by bucket size (larger buckets first)
  allCompartments.sort((a, b) => {
    // First sort by absolute distance from center (centers first)
    const distanceA = Math.abs(a.normalizedBellPosition);
    const distanceB = Math.abs(b.normalizedBellPosition);
    
    if (Math.abs(distanceA - distanceB) < 0.01) {
      // If same distance, prefer larger buckets (more bell curve-like)
      if (a.bucketSize !== b.bucketSize) {
        return b.bucketSize - a.bucketSize;
      }
      // If same bucket size, group by bucket ID
      return a.bucketId - b.bucketId;
    }
    
    return distanceA - distanceB;
  });
  
  const unifiedCompartmentData = allCompartments;

  // Prepare daily transactions data (last 30 days)
  const transactionData = simulationData
    .slice(Math.max(0, currentDay - 29), currentDay + 1)
    .map(day => ({
      day: day.day,
      deposits: day.deposits,
      withdrawals: -day.withdrawals
    }));

  // Prepare cumulative liquid data
  const liquidData = simulationData.slice(0, currentDay + 1).map(day => {
    const totalLiquid = day.bucketStates.reduce((sum, bucket) => 
      sum + bucket.compartments.reduce((bucketSum, amt) => bucketSum + amt, 0), 0);
    return {
      day: day.day,
      totalLiquid,
      deposits: day.deposits,
      withdrawals: day.withdrawals
    };
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Bell Curve Liquid Distribution System
      </h1>
      
      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handlePlayPause}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Reset
          </button>
          <span className="text-lg font-semibold">Day: {currentDay}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            Day:
            <input
              type="range"
              min="0"
              max={simulationData.length - 1}
              value={currentDay}
              onChange={handleDayChange}
              className="w-64"
            />
          </label>
          <label className="flex items-center gap-2">
            Speed:
            <input
              type="range"
              min="1"
              max="100"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-32"
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Individual Compartment Distribution Visualization */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Individual Bucket Bell Curves</h2>
          <div className="space-y-4">
            {compartmentData.map((bucket, idx) => (
              <div key={bucket.name} className="border-b pb-4">
                <h3 className="text-lg font-medium mb-2" style={{color: bucket.color}}>
                  {bucket.name} ({bucket.compartments.length} compartments)
                </h3>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={bucket.compartments.map((amt, i) => ({ 
                    compartment: i, 
                    amount: amt 
                  }))}>
                    <XAxis dataKey="compartment" />
                    <YAxis />
                    <Tooltip formatter={(value) => [value.toFixed(2), 'Amount']} />
                    <Bar dataKey="amount" fill={bucket.color} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        </div>

        {/* Unified All Compartments Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">All Compartments (Bell Curve Ordered)</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={unifiedCompartmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="id" 
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
                fontSize={10}
              />
              <YAxis />
              <Tooltip 
                formatter={(value, name, props) => [
                  value.toFixed(2), 
                  `${props.payload.bucketName} - Compartment ${props.payload.compartmentIndex}`
                ]}
                labelFormatter={(label) => `ID: ${label}`}
              />
              <Bar dataKey="amount">
                {unifiedCompartmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          
          {/* Legend for bucket colors */}
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            {compartmentData.map((bucket, idx) => (
              <div key={bucket.name} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded"
                  style={{backgroundColor: bucket.color}}
                ></div>
                <span className="text-sm">{bucket.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Transactions */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Daily Transactions (Last 30 Days)</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={transactionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="deposits" fill="#82ca9d" name="Deposits" />
              <Bar dataKey="withdrawals" fill="#ff7c7c" name="Withdrawals" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cumulative Liquid Over Time */}
        <div className="bg-white p-4 rounded-lg shadow-md lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Total Liquid Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={liquidData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="totalLiquid" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="Total Liquid"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Current Statistics */}
      <div className="bg-white p-4 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold mb-4">Current Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {liquidData[liquidData.length - 1]?.totalLiquid.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-gray-600">Total Liquid</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {currentData.deposits.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Today's Deposits</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {currentData.withdrawals.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Today's Withdrawals</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {currentData.bucketStates.length}
            </div>
            <div className="text-sm text-gray-600">Active Buckets</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiquidSystemVisualization;