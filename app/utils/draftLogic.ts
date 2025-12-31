export function getDraftOrder(members: string[], rounds: number) {
  const order = [];
  for (let r = 0; r < rounds; r++) {
    const roundOrder = r % 2 === 0 ? members : [...members].reverse();
    order.push(...roundOrder);
  }
  return order;
}
