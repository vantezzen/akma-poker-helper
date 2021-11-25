enum TapState {
  IDLE = 0,
  TAPPED = 1,
  DOUBLE_TAPPED = 2,
};

export default class GlassTapListener {

  private onSingleTap: () => void;
  private onDoubleTap: () => void;

  private tapState = TapState.IDLE;

  constructor(onSingleTap: () => void, onDoubleTap: () => void) {
    this.onSingleTap = onSingleTap;
    this.onDoubleTap = onDoubleTap;
  }
  
  public setAsCurrentListener() {
    window.glassTap = this.handleTap.bind(this);
  }

  private handleTap() {

    if (this.tapState === TapState.TAPPED) {
      this.tapState = TapState.DOUBLE_TAPPED;
      this.onDoubleTap();
    } else {
      this.tapState = TapState.TAPPED;
      setTimeout(() => {
        if (this.tapState === TapState.TAPPED) {
          this.onSingleTap();
        }
        this.tapState = TapState.IDLE;
      }, 500);
    }

  }

}