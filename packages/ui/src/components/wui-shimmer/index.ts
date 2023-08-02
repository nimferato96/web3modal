import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import type { BorderRadiusType } from '../../utils/TypesUtil'
import styles from './styles'

@customElement('wui-shimmer')
export class WuiShimmer extends LitElement {
  public static override styles = [styles]

  // -- State & Properties -------------------------------- //
  @property() public width = ''

  @property() public height = ''

  @property() public borderRadius: BorderRadiusType = 'm'

  // -- Render -------------------------------------------- //
  public override render() {
    this.style.cssText = `
      width: ${this.width};
      height: ${this.height};
      border-radius: ${`var(--wui-border-radius-${this.borderRadius})`};
    `

    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wui-shimmer': WuiShimmer
  }
}