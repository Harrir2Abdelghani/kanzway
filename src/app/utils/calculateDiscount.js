export const calculateDiscount = (total) => {
    let discount = 0;
    if (total > 200) discount = total * 0.15;
    else if (total > 100) discount = total * 0.10;
    else if (total > 50) discount = total * 0.05;
    
    const finalTotal = total - discount;
    return { discount, finalTotal };
  };