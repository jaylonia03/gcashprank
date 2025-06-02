// Utility functions
class Utils {
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    static angleBetween(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    }

    static collides(a, b) {
        return Utils.distance(a.x, a.y, b.x, b.y) < a.radius + b.radius;
    }

    static getRandomColor() {
        const colors = [
            '#e74c3c', // red
            '#3498db', // blue
            '#2ecc71', // green
            '#f1c40f', // yellow
            '#9b59b6', // purple
            '#1abc9c', // teal
            '#e67e22', // orange
            '#34495e'  // dark blue
        ];
        return colors[Utils.randomInt(0, colors.length - 1)];
    }

    static drawProgressBar(ctx, x, y, width, height, progress, color, bgColor) {
        ctx.fillStyle = bgColor || '#333';
        ctx.fillRect(x, y, width, height);
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width * progress, height);
    }
}
