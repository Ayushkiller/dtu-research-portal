export const calculateAuthorShares = (authors, totalAwardAmount, zFactor = 1) => {
  const totalAuthors = authors.length;
  const totalExternalAuthors = authors.filter(author => author.isExternal).length;
  const totalInternalAuthors = totalAuthors - totalExternalAuthors;
  
  // Return early if there are no internal authors
  if (totalInternalAuthors === 0) {
    return authors.map(author => ({
      ...author,
      shareValue: 0,
      amount: 0
    }));
  }
  
  // Contribution factor (Z) - can be adjusted between 0.5 and 1
  const contributionFactor = Math.min(Math.max(zFactor, 0.5), 1); // Ensure Z is between 0.5 and 1
  
  if (totalExternalAuthors === 0) {
    // No external authors: Minimum Amount per Author = (A × Z) / N
    const shareValue = (totalAwardAmount * contributionFactor) / totalAuthors;
    
    return authors.map(author => ({
      ...author,
      shareValue: (shareValue / totalAwardAmount) * 100, // Convert to percentage
      amount: Math.round(shareValue) // Actual amount in currency
    }));
  } else {
    // With external authors: Minimum Amount per Author = ((A - Y × A/N) × Z) / (N - Y)
    const externalShareTotal = totalExternalAuthors * (totalAwardAmount / totalAuthors);
    const internalAwardPool = totalAwardAmount - externalShareTotal;
    const internalShareValue = (internalAwardPool * contributionFactor) / totalInternalAuthors;
    
    return authors.map(author => {
      if (author.isExternal) {
        // External authors get 0 amount as per policy (Case 4 in eligibility rules)
        return {
          ...author,
          shareValue: 0, // 0% share
          amount: 0 // ₹0 amount (as per university policy)
        };
      } else {
        // Internal authors share the remaining pool
        return {
          ...author,
          shareValue: (internalShareValue / totalAwardAmount) * 100, // Convert to percentage
          amount: Math.round(internalShareValue)
        };
      }
    });
  }
};

// Award category definitions with criteria
export const AWARD_CATEGORIES = {
  OUTSTANDING: {
    value: 'OUTSTANDING',
    label: 'Outstanding Research Award',
    amount: 500000,
    description: 'For papers with Impact Factor ≥2, published in Nature Journal, Science, or Harvard Business Review',
    criteria: 'Impact Factor ≥2, published in specific prestigious journals'
  },
  PREMIER: {
    value: 'PREMIER',
    label: 'Premier Research Award',
    amount: 100000,
    description: 'For papers with Impact Factor ≥3.0 (IEEE Transactions) or published in specified prestigious journals',
    criteria: 'Impact Factor ≥3.0 or published in specific prestigious journals, or any SCI/SSCI journal with IF ≥30'
  },
  COMMENDABLE: {
    value: 'COMMENDABLE',
    label: 'Commendable Research Award',
    amount: 50000,
    description: 'For papers with Impact Factor ≥1.0, published in reputable publishers',
    criteria: 'Impact Factor ≥1.0, or SCI/SSCI journals with IF ≥5'
  }
};
