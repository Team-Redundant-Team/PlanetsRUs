const calculateDistance = (obj1, obj2)=> {
  if (!obj1 || !obj2 || !obj1.position || !obj2.position) {
    console.error("One or both objects do not have a valid position.");
    return Infinity; // Return a large distance if positions are invalid
  }

  const { x: x1, y: y1, z: z1 } = obj1.position;
  const { x: x2, y: y2, z: z2 } = obj2.position;

  const dx = x1 - x2;
  const dy = y1 - y2;
  const dz = z1 - z2;

  return Math.sqrt(dx * dx, dy * dy, dz * dz);
}
export default calculateDistance