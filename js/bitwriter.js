        window.BitWriter = class {
            constructor(byteOrder = 'big-endian', bitOrder = 'msb-first') {
                this.buffer = new Uint8Array(10000);
                this.bitPosition = 0;
                this.byteOrder = byteOrder;
                this.bitOrder = bitOrder;
            }

            writeBits(value, numBits) {
                if (numBits <= 0 || numBits > 64) return;

                value = BigInt(value) & ((1n << BigInt(numBits)) - 1n);

                if (this.bitOrder === 'msb-first') {
                    // MSB-First: старший бит пишем первым
                    for (let i = numBits - 1; i >= 0; i--) {
                        const bit = Number((value >> BigInt(i)) & 1n);
                        this._writeBit(bit);
                    }
                } else {
                    // LSB-First: младший бит пишем первым
                    for (let i = 0; i < numBits; i++) {
                        const bit = Number((value >> BigInt(i)) & 1n);
                        this._writeBit(bit);
                    }
                }
            }

            _writeBit(bit) {
                const byteIdx = Math.floor(this.bitPosition / 8);
                const bitIdx = 7 - (this.bitPosition % 8);
                
                if (byteIdx >= this.buffer.length) {
                    const newBuffer = new Uint8Array(this.buffer.length * 2);
                    newBuffer.set(this.buffer);
                    this.buffer = newBuffer;
                }

                if (bit) {
                    this.buffer[byteIdx] |= (1 << bitIdx);
                }

                this.bitPosition++;
            }

            getBuffer() {
                const totalBytes = Math.ceil(this.bitPosition / 8);
                return this.buffer.slice(0, totalBytes);
            }

            reset() {
                this.buffer.fill(0);
                this.bitPosition = 0;
            }

            getTotalBytes() {
                return Math.ceil(this.bitPosition / 8);
            }
        }
		
		// ===encodeRecursive отвечает за правильную упаковку битов в зависимости от активного типа данных (важно для контейнеров)
		function encodeRecursive(value, param, bitWriter, frameIdx) {
