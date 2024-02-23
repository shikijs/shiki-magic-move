export interface AnimationOptions {
  /**
   * Duration of the animation in milliseconds
   *
   * @default 500
   */
  duration?: number
  /**
   * Ratio of the duration to delay the move animation
   *
   * @default 0.3
   */
  delayMove?: number
  /**
   * Ratio of the duration to delay the leave animation
   *
   * @default 0
   */
  delayLeave?: number
  /**
   * Ratio of the duration to delay the enter animation
   *
   * @default 0.7
   */
  delayEnter?: number
  /**
   * Easing function
   *
   * @default 'ease'
   */
  easing?: string
}
