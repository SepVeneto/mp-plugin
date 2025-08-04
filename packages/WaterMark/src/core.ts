export class DCTWatermark {
  static createImageData: any
  /**
   * 嵌入水印
   * @param {ImageData} imageData 原始图像数据
   * @param {string} watermarkText 要嵌入的水印文本
   * @param {number} [alpha] 水印强度系数
   * @returns {ImageData} 带有水印的图像数据
   */
  static embed(imageData, watermarkText, alpha = 0.2) {
    const { width, height, data } = imageData
    const blockSize = 8
    const binaryText = this.textToBinary(watermarkText)

    // 将图像转换为Y通道（灰度）
    const yChannel = this.getYChannel(data, width, height)

    // 对每个8x8块进行DCT变换
    let bitIndex = 0
    for (let y = 0; y < height; y += blockSize) {
      for (let x = 0; x < width; x += blockSize) {
        if (bitIndex >= binaryText.length)
          break

        // 提取8x8块
        const block = this.getBlock(yChannel, x, y, width, height, blockSize)

        // 应用DCT
        const dctBlock = this.applyDCT(block)

        // 嵌入水印位（在中频系数）
        if (binaryText[bitIndex] === '1') {
          dctBlock[3][4] += alpha * dctBlock[0][0]
          dctBlock[4][3] += alpha * dctBlock[0][0]
        }
        else {
          dctBlock[3][4] -= alpha * dctBlock[0][0]
          dctBlock[4][3] -= alpha * dctBlock[0][0]
        }

        // 逆DCT
        const idctBlock = this.applyIDCT(dctBlock)

        // 放回图像
        this.putBlock(yChannel, idctBlock, x, y, width, height, blockSize)

        bitIndex++
      }
      if (bitIndex >= binaryText.length)
        break
    }

    // 将Y通道合并回原图像
    return this.mergeYChannel(data, yChannel, width, height)
  }

  /**
   * 提取水印
   * @param {ImageData} imageData 可能含有水印的图像数据
   * @param {number} watermarkLength 水印文本长度（字符数）
   * @returns {string} 提取出的水印文本
   */
  static extract(imageData, watermarkLength) {
    const { width, height, data } = imageData
    const blockSize = 8
    const binaryLength = watermarkLength * 8
    const yChannel = this.getYChannel(data, width, height)
    let binaryText = ''

    // 对每个8x8块进行DCT变换
    let bitIndex = 0
    for (let y = 0; y < height; y += blockSize) {
      for (let x = 0; x < width; x += blockSize) {
        if (bitIndex >= binaryLength)
          break

        const block = this.getBlock(yChannel, x, y, width, height, blockSize)
        const dctBlock = this.applyDCT(block)

        // 比较中频系数
        const diff = dctBlock[3][4] - dctBlock[4][3]
        binaryText += diff > 0 ? '1' : '0'

        bitIndex++
      }
      if (bitIndex >= binaryLength)
        break
    }

    return this.binaryToText(binaryText)
  }

  // 辅助方法

  static textToBinary(text) {
    return text.split('').map(c =>
      c.charCodeAt(0).toString(2).padStart(8, '0'),
    ).join('')
  }

  static binaryToText(binary) {
    let text = ''
    for (let i = 0; i < binary.length; i += 8) {
      const byte = binary.substr(i, 8)
      text += String.fromCharCode(Number.parseInt(byte, 2))
    }
    return text
  }

  static getYChannel(data, width, height) {
    const yChannel = new Float32Array(width * height)
    for (let i = 0, j = 0; i < data.length; i += 4, j++) {
      // RGB转Y（亮度分量）
      yChannel[j] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    }
    return yChannel
  }

  static mergeYChannel(data, yChannel, width, height) {
    const newData = new Uint8ClampedArray(data.length)
    for (let i = 0, j = 0; i < data.length; i += 4, j++) {
      const y = yChannel[j]
      // 保持原始色度，只替换亮度
      const u = -0.147 * data[i] - 0.289 * data[i + 1] + 0.436 * data[i + 2]
      const v = 0.615 * data[i] - 0.515 * data[i + 1] - 0.100 * data[i + 2]

      newData[i] = y + 1.140 * v
      newData[i + 1] = y - 0.395 * u - 0.581 * v
      newData[i + 2] = y + 2.032 * u
      newData[i + 3] = data[i + 3] // alpha通道不变
    }
    return DCTWatermark.createImageData(newData, width, height)
  }

  static getBlock(channel, x, y, width, height, blockSize) {
    const block = Array.from({ length: blockSize }, () =>
      new Array(blockSize).fill(0))

    for (let i = 0; i < blockSize; i++) {
      for (let j = 0; j < blockSize; j++) {
        const px = x + j
        const py = y + i
        if (px < width && py < height) {
          block[i][j] = channel[py * width + px] - 128 // 中心化
        }
      }
    }

    return block
  }

  static putBlock(channel, block, x, y, width, height, blockSize) {
    for (let i = 0; i < blockSize; i++) {
      for (let j = 0; j < blockSize; j++) {
        const px = x + j
        const py = y + i
        if (px < width && py < height) {
          channel[py * width + px] = Math.max(0, Math.min(255, block[i][j] + 128))
        }
      }
    }
  }

  static applyDCT(block) {
    const N = block.length
    const dctBlock = Array.from({ length: N }, () => new Array(N).fill(0))

    for (let u = 0; u < N; u++) {
      for (let v = 0; v < N; v++) {
        let sum = 0
        for (let i = 0; i < N; i++) {
          for (let j = 0; j < N; j++) {
            const cu = u === 0 ? Math.sqrt(1 / N) : Math.sqrt(2 / N)
            const cv = v === 0 ? Math.sqrt(1 / N) : Math.sqrt(2 / N)
            const cos1 = Math.cos(((2 * i + 1) * u * Math.PI) / (2 * N))
            const cos2 = Math.cos(((2 * j + 1) * v * Math.PI) / (2 * N))
            sum += cu * cv * block[i][j] * cos1 * cos2
          }
        }
        dctBlock[u][v] = sum
      }
    }

    return dctBlock
  }

  static applyIDCT(dctBlock) {
    const N = dctBlock.length
    const block = Array.from({ length: N }, () => new Array(N).fill(0))

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        let sum = 0
        for (let u = 0; u < N; u++) {
          for (let v = 0; v < N; v++) {
            const cu = u === 0 ? Math.sqrt(1 / N) : Math.sqrt(2 / N)
            const cv = v === 0 ? Math.sqrt(1 / N) : Math.sqrt(2 / N)
            const cos1 = Math.cos(((2 * i + 1) * u * Math.PI) / (2 * N))
            const cos2 = Math.cos(((2 * j + 1) * v * Math.PI) / (2 * N))
            sum += cu * cv * dctBlock[u][v] * cos1 * cos2
          }
        }
        block[i][j] = sum
      }
    }

    return block
  }
}
