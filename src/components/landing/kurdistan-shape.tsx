"use client";

export default function KurdistanShape() {
  // Kurdistan outline path vertices - scaled up 1.5x
  const outlineVertices = [
    { x: 80, y: 250 }, { x: 87, y: 227 }, { x: 110, y: 220 }, { x: 117, y: 205 },
    { x: 140, y: 212 }, { x: 162, y: 197 }, { x: 177, y: 205 }, { x: 200, y: 190 },
    { x: 215, y: 167 }, { x: 237, y: 152 }, { x: 252, y: 122 }, { x: 275, y: 115 },
    { x: 290, y: 137 }, { x: 312, y: 145 }, { x: 327, y: 167 }, { x: 350, y: 197 },
    { x: 380, y: 212 }, { x: 402, y: 227 }, { x: 425, y: 235 }, { x: 447, y: 242 },
    { x: 462, y: 265 }, { x: 492, y: 272 }, { x: 515, y: 295 }, { x: 507, y: 325 },
    { x: 522, y: 347 }, { x: 500, y: 370 }, { x: 507, y: 392 }, { x: 485, y: 407 },
    { x: 462, y: 400 }, { x: 447, y: 422 }, { x: 425, y: 407 }, { x: 402, y: 377 },
    { x: 380, y: 355 }, { x: 357, y: 332 }, { x: 335, y: 310 }, { x: 312, y: 302 },
    { x: 290, y: 317 }, { x: 267, y: 332 }, { x: 245, y: 325 }, { x: 222, y: 317 },
    { x: 200, y: 310 }, { x: 177, y: 317 }, { x: 155, y: 302 }, { x: 132, y: 295 },
    { x: 110, y: 310 }, { x: 87, y: 317 }, { x: 72, y: 295 }, { x: 80, y: 272 },
  ];

  // Inner mesh vertices for triangulation - scaled up 1.5x
  const innerVertices = [
    // First inner ring
    { x: 170, y: 242 }, { x: 200, y: 227 }, { x: 230, y: 212 }, { x: 267, y: 197 },
    { x: 305, y: 205 }, { x: 342, y: 227 }, { x: 380, y: 250 }, { x: 417, y: 272 },
    { x: 447, y: 302 }, { x: 462, y: 340 }, { x: 447, y: 377 }, { x: 417, y: 362 },
    { x: 380, y: 332 }, { x: 342, y: 310 }, { x: 305, y: 302 }, { x: 267, y: 310 },
    { x: 230, y: 302 }, { x: 192, y: 295 }, { x: 155, y: 280 }, { x: 125, y: 265 },
    // Second inner ring (center)
    { x: 230, y: 250 }, { x: 275, y: 242 }, { x: 320, y: 257 }, { x: 365, y: 280 },
    { x: 402, y: 317 }, { x: 380, y: 332 }, { x: 342, y: 310 }, { x: 297, y: 287 },
    { x: 252, y: 280 }, { x: 207, y: 272 },
  ];

  const allVertices = [...outlineVertices, ...innerVertices];

  // Outline connections
  const outlineConnections: [number, number][] = [];
  for (let i = 0; i < outlineVertices.length; i++) {
    outlineConnections.push([i, (i + 1) % outlineVertices.length]);
  }

  // Mesh connections from outline to inner ring
  const meshConnections: [number, number][] = [
    // Connect outline to first inner ring
    [0, 48], [2, 48], [4, 49], [6, 49], [7, 50], [8, 50], [9, 51], [10, 51],
    [11, 52], [13, 52], [14, 53], [16, 53], [17, 54], [18, 55], [19, 55],
    [20, 56], [21, 56], [22, 57], [24, 57], [25, 58], [27, 58], [28, 59],
    [30, 59], [31, 60], [32, 60], [33, 61], [34, 61], [35, 62], [36, 62],
    [37, 63], [38, 63], [39, 64], [40, 64], [41, 65], [42, 65], [44, 66],
    [45, 66], [46, 67], [47, 67],
    // First inner ring connections
    [48, 49], [49, 50], [50, 51], [51, 52], [52, 53], [53, 54], [54, 55],
    [55, 56], [56, 57], [57, 58], [58, 59], [59, 60], [60, 61], [61, 62],
    [62, 63], [63, 64], [64, 65], [65, 66], [66, 67], [67, 48],
    // Connect to center ring
    [49, 68], [50, 68], [51, 69], [52, 69], [53, 70], [54, 70], [55, 71],
    [56, 72], [57, 72], [58, 73], [60, 73], [61, 74], [62, 74], [63, 75],
    [64, 76], [65, 76], [66, 77], [67, 77], [48, 68],
    // Center ring connections
    [68, 69], [69, 70], [70, 71], [71, 72], [72, 73], [73, 74], [74, 75],
    [75, 76], [76, 77], [77, 68],
    // Cross connections for triangulation
    [48, 67], [49, 48], [50, 49], [51, 50], [52, 51], [53, 52], [54, 53],
    [55, 54], [56, 55], [57, 56], [58, 57], [59, 58], [60, 59], [61, 60],
    [62, 61], [63, 62], [64, 63], [65, 64], [66, 65], [67, 66],
  ];

  const allConnections = [...outlineConnections, ...meshConnections];

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center">
      <svg
        width="600"
        height="500"
        viewBox="0 0 600 500"
        className="drop-shadow-xl"
      >
        {/* Wireframe mesh connections */}
        <g stroke="currentColor" strokeWidth="1.5" fill="none" className="text-foreground/70">
          {allConnections.map((conn, i) => (
            <line
              key={i}
              x1={allVertices[conn[0]]?.x}
              y1={allVertices[conn[0]]?.y}
              x2={allVertices[conn[1]]?.x}
              y2={allVertices[conn[1]]?.y}
            />
          ))}
        </g>

        {/* Vertices/nodes */}
        <g fill="currentColor" className="text-foreground">
          {allVertices.map((vertex, i) => (
            <circle
              key={i}
              cx={vertex.x}
              cy={vertex.y}
              r="4"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
