class Object {
    constructor(position, width, height, depth, color, direction) {
        this.position = position;
        this.width=width;
        this.height=height;
        this.depth=depth;
        this.color=color;
        this.direction = direction;
    }

    update() {
        
    }

    render(ctx1, ctx2, ctx3) {
        ctx1.fillStyle = this.color;
        ctx2.fillStyle = this.color;
        ctx3.fillStyle = this.color;

        const corners = this.getRotatedCorners();
        const slice = this.getSlicePolygon(corners);

        if (slice.length >= 3) {
            this.fillPolygon(ctx1, slice);
        }

        const sideView = corners.map(({ y, t }) => ({ x: t, y }));
        const topView = corners.map(({ x, t }) => ({ y: t, x }));
        this.fillPolygon(ctx2, this.orderPolygonPoints(sideView));
        this.fillPolygon(ctx3, this.orderPolygonPoints(topView));

        ctx2.fillStyle = "black";
        ctx3.fillStyle = "black";
        ctx2.fillRect(SLICE, 0, 1, 500)
        ctx3.fillRect(0, SLICE, 500, 1)
    }

    getRotatedCorners() {
        const angleX = this.direction.x * Math.PI / 180;
        const angleY = this.direction.y * Math.PI / 180;
        const angleT = this.direction.t * Math.PI / 180;
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        const cosT = Math.cos(angleT);
        const sinT = Math.sin(angleT);

        return Array.from({ length: 8 }, (_, index) => {
            const xSign = index & 4 ? 1 : -1;
            const ySign = index & 2 ? 1 : -1;
            const tSign = index & 1 ? 1 : -1;
            const x = xSign * this.width / 2;
            const y = ySign * this.height / 2;
            const t = tSign * this.depth / 2;

            const rotatedY = y * cosX - t * sinX;
            const rotatedT = y * sinX + t * cosX;
            const rotatedX = x * cosY + rotatedT * sinY;
            const finalT = -x * sinY + rotatedT * cosY;

            return {
                x: this.position.x + rotatedX * cosT - rotatedY * sinT,
                y: this.position.y + rotatedX * sinT + rotatedY * cosT,
                t: this.position.t + finalT
            };
        });
    }

    getSlicePolygon(corners) {
        const points = [];
        const edgeBits = [4, 2, 1];

        for (let index = 0; index < corners.length; index++) {
            for (const bit of edgeBits) {
                if (index & bit) continue;

                const start = corners[index];
                const end = corners[index | bit];
                const startDistance = start.t - SLICE;
                const endDistance = end.t - SLICE;

                if (startDistance === 0) points.push({ x: start.x, y: start.y });
                if (endDistance === 0) points.push({ x: end.x, y: end.y });
                if (startDistance * endDistance < 0) {
                    const fraction = -startDistance / (endDistance - startDistance);
                    points.push({
                        x: start.x + fraction * (end.x - start.x),
                        y: start.y + fraction * (end.y - start.y)
                    });
                }
            }
        }

        return this.orderPolygonPoints(points);
    }

    orderPolygonPoints(points) {
        const uniquePoints = points.filter((point, index) =>
            points.findIndex(other => other.x === point.x && other.y === point.y) === index
        );
        if (uniquePoints.length < 3) return uniquePoints;

        const sorted = uniquePoints.sort((a, b) => a.x - b.x || a.y - b.y);
        const cross = (origin, a, b) =>
            (a.x - origin.x) * (b.y - origin.y) - (a.y - origin.y) * (b.x - origin.x);
        const lower = [];
        const upper = [];

        for (const point of sorted) {
            while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0) {
                lower.pop();
            }
            lower.push(point);
        }

        for (const point of sorted.slice().reverse()) {
            while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0) {
                upper.pop();
            }
            upper.push(point);
        }

        return lower.slice(0, -1).concat(upper.slice(0, -1));
    }

    fillPolygon(ctx, points) {
        if (points.length < 3) return;

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (const point of points.slice(1)) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.closePath();
        ctx.fill();
    }
}