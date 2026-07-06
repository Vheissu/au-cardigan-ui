export interface MockContext2D {
    [key: string]: jest.Mock | unknown;
    clearRect: jest.Mock;
    fillRect: jest.Mock;
    strokeRect: jest.Mock;
    fillText: jest.Mock;
    strokeText: jest.Mock;
    beginPath: jest.Mock;
    closePath: jest.Mock;
    moveTo: jest.Mock;
    lineTo: jest.Mock;
    arc: jest.Mock;
    roundRect: jest.Mock;
    fill: jest.Mock;
    stroke: jest.Mock;
    save: jest.Mock;
    restore: jest.Mock;
    translate: jest.Mock;
    rotate: jest.Mock;
    scale: jest.Mock;
    setTransform: jest.Mock;
    measureText: jest.Mock;
}

export function createMockContext2D(): MockContext2D {
    return {
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        font: '',
        textAlign: 'left',
        textBaseline: 'alphabetic',
        globalAlpha: 1,
        lineJoin: 'miter',
        clearRect: jest.fn(),
        fillRect: jest.fn(),
        strokeRect: jest.fn(),
        fillText: jest.fn(),
        strokeText: jest.fn(),
        beginPath: jest.fn(),
        closePath: jest.fn(),
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        arc: jest.fn(),
        roundRect: jest.fn(),
        fill: jest.fn(),
        stroke: jest.fn(),
        save: jest.fn(),
        restore: jest.fn(),
        translate: jest.fn(),
        rotate: jest.fn(),
        scale: jest.fn(),
        setTransform: jest.fn(),
        measureText: jest.fn((text: string) => ({ width: String(text).length * 7 })),
    };
}

/**
 * Replaces HTMLCanvasElement.prototype.getContext with a stub returning the
 * given value (a mock 2d context, or null to exercise the bail-out paths).
 * Returns a restore function.
 */
export function stubCanvasContext(context: MockContext2D | null): () => void {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = jest.fn(() => context) as unknown as typeof original;
    return () => {
        HTMLCanvasElement.prototype.getContext = original;
    };
}

export function tick(ms = 80): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
