export const calculateAuthorShares = (authors, totalAwardAmount) => {
    const totalExternalAuthors = authors.filter(author => author.isExternal).length;
    const totalInternalAuthors = authors.length - totalExternalAuthors;
    const externalShareValue = 1 / (totalExternalAuthors + totalInternalAuthors);
    const internalShareValue = 0.5 / totalInternalAuthors;
  
    return authors.map(author => ({
      ...author,
      shareValue: author.isExternal ? externalShareValue : internalShareValue,
      amount: Math.round(totalAwardAmount * (author.isExternal ? externalShareValue : internalShareValue))
    }));
};
